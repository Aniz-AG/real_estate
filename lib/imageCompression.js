// Client-side image compression via canvas. Serverless platforms (e.g.
// Vercel) cap request bodies at 4.5MB regardless of any server-side config,
// so multi-photo uploads need to be shrunk in the browser before they're
// ever sent, not just validated after the fact.
const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.75;
const SKIP_BELOW_BYTES = 400 * 1024; // already small enough, not worth recompressing

export async function compressImage(file, options = {}) {
  const { maxDimension = MAX_DIMENSION, quality = JPEG_QUALITY } = options;

  if (
    typeof window === "undefined" ||
    !file?.type?.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.size <= SKIP_BELOW_BYTES
  ) {
    return file;
  }

  const source = await loadImageSource(file);
  if (!source) return file;

  let { width, height } = source;
  if (width > maxDimension || height > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(source, 0, 0, width, height);

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", quality),
  );

  if (source.close) source.close();

  if (!blob || blob.size >= file.size) {
    return file; // recompression didn't help — keep the original
  }

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export async function compressImages(files, options) {
  return Promise.all(Array.from(files).map((file) => compressImage(file, options)));
}

async function loadImageSource(file) {
  try {
    if (window.createImageBitmap) {
      return await createImageBitmap(file);
    }
  } catch {
    // Some formats (e.g. certain HEIC exports) can fail createImageBitmap —
    // fall through to the <img> based approach below.
  }

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

export function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// Keep a safety margin under Vercel's 4.5MB hard limit for the whole
// multipart body (images + brochure + text fields combined).
export const MAX_UPLOAD_PAYLOAD_BYTES = 4 * 1024 * 1024;
