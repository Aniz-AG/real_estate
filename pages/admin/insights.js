import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Newspaper,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className={`fixed bottom-6 right-6 z-[99999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${
      type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
    }`}
  >
    {type === "success" ? (
      <CheckCircle2 className="h-6 w-6" />
    ) : (
      <AlertCircle className="h-6 w-6" />
    )}
    <span className="font-medium">{message}</span>
    <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1">
      <X className="h-4 w-4" />
    </button>
  </motion.div>
);

export default function AdminInsights() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newThumbnail, setNewThumbnail] = useState(null);
  const [creating, setCreating] = useState(false);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.replace("/login");
    } else if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [isAuthenticated, user, router, mounted]);

  useEffect(() => {
    if (mounted && isAuthenticated && user?.role === "admin") {
      fetchInsights();
    }
  }, [mounted, isAuthenticated, user]);

  const fetchInsights = async () => {
    try {
      const { data } = await axios.get("/api/admin/insights");
      setInsights(data.insights || []);
    } catch (error) {
      showToast("Failed to load insights", "error");
    } finally {
      setLoading(false);
    }
  };

  const togglePublished = async (insight) => {
    setBusyId(insight._id);
    try {
      const form = new FormData();
      form.append("is_published", (!insight.is_published).toString());
      await axios.put(`/api/admin/insights/${insight._id}`, form);
      setInsights((prev) =>
        prev.map((i) =>
          i._id === insight._id
            ? { ...i, is_published: !i.is_published }
            : i,
        ),
      );
      showToast(
        !insight.is_published ? "Insight published" : "Insight unpublished",
      );
    } catch (error) {
      showToast("Failed to update insight", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (insight) => {
    if (!confirm(`Delete "${insight.title}"? This cannot be undone.`)) return;
    setBusyId(insight._id);
    try {
      await axios.delete(`/api/admin/insights/${insight._id}`);
      setInsights((prev) => prev.filter((i) => i._id !== insight._id));
      showToast("Insight deleted");
    } catch (error) {
      showToast("Failed to delete insight", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("Title is required", "error");
      return;
    }
    setCreating(true);
    try {
      const form = new FormData();
      form.append("title", newTitle.trim());
      form.append("description", newDescription);
      form.append("link", newLink);
      if (newThumbnail) form.append("thumbnail", newThumbnail);
      const { data } = await axios.post("/api/admin/insights", form);
      setInsights((prev) => [data.insight, ...prev]);
      setNewTitle("");
      setNewDescription("");
      setNewLink("");
      setNewThumbnail(null);
      setShowAddForm(false);
      showToast("Insight created successfully");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to create insight",
        "error",
      );
    } finally {
      setCreating(false);
    }
  };

  if (!mounted || !isAuthenticated || user?.role !== "admin") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SeoHead
        title="Manage Insights"
        description="Add and manage real estate insights shown on the Insights page"
      />
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/50 text-white shadow-lg">
              <Newspaper className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Insights</h1>
              <p className="text-sm text-muted-foreground">
                These appear alongside the market news feed on the public
                Insights page.
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm((v) => !v)}>
            <Plus className="h-4 w-4 mr-2" /> Add Insight
          </Button>
        </div>

        {showAddForm && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>New Insight</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g., Real Estate Prices Rise 8% This Quarter"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <textarea
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="Short summary shown on the card"
                  />
                </div>
                <div>
                  <Label>Link (optional)</Label>
                  <Input
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="https://... (Read full article link)"
                  />
                </div>
                <div>
                  <Label>Thumbnail</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewThumbnail(e.target.files?.[0] || null)}
                  />
                </div>
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Insight"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : insights.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center text-muted-foreground">
              No insights added yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <Card key={insight._id} className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                    {insight.thumbnail?.url ? (
                      <img
                        src={insight.thumbnail.url}
                        alt={insight.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Newspaper className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{insight.title}</p>
                      {!insight.is_published && (
                        <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
                          Unpublished
                        </span>
                      )}
                    </div>
                    {insight.description && (
                      <p className="text-xs text-muted-foreground truncate">
                        {insight.description}
                      </p>
                    )}
                    {insight.link && (
                      <a
                        href={insight.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" /> View link
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={busyId === insight._id}
                    onClick={() => togglePublished(insight)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                      insight.is_published ? "bg-primary" : "bg-gray-300"
                    }`}
                    title={insight.is_published ? "Unpublish" : "Publish"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        insight.is_published ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={busyId === insight._id}
                    onClick={() => handleDelete(insight)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
