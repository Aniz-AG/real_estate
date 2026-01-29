import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";


// connenect database to mongoDB 
const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "e-state" })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      throw err;
    });
};


// to send Token login time
const sendToken = (res, user, code, message) => {
  const token = jwt.sign(
    { userId: user._id, },
    process.env.JWT_SECRET,
  );

  res.status(code).json({
    success: true,
    message,
    token
  });
};

// upload files on cloudinary as array 
const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);

          resolve(result);
        }
      );
    });
  });

  try {

    const results = await Promise.all(uploadPromises);
    // Format the results to return public_id and secure_url
    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (err) {
    throw new Error("Error uploading files to cloudinary " + err);
  }
};


// delete files from the cloudinary directory
const deletFilesFromCloudinary = async (publicIds = []) => {
  const promises = publicIds.map((id) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(id, (error, result) => {
        if (error) return reject(error);
        resolve();
      });
    });
  });

  await Promise.all(promises);
};

const invalidCache = async ()=> ({
 


});

export {
  connectDB,
  sendToken,
  uploadFilesToCloudinary,
  deletFilesFromCloudinary,
  invalidCache,
}