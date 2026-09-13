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
  Building2,
  Crown,
  Loader2,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { compressImage } from "@/lib/imageCompression";

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

export default function AdminBuilders() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [builders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLogo, setNewLogo] = useState(null);
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
      fetchBuilders();
    }
  }, [mounted, isAuthenticated, user]);

  const fetchBuilders = async () => {
    try {
      const { data } = await axios.get("/api/admin/builders");
      setBuilders(data.builders || []);
    } catch (error) {
      showToast("Failed to load builders", "error");
    } finally {
      setLoading(false);
    }
  };

  const togglePremium = async (builder) => {
    setBusyId(builder._id);
    try {
      const form = new FormData();
      form.append("is_premium", (!builder.is_premium).toString());
      await axios.put(`/api/admin/builders/${builder._id}`, form);
      setBuilders((prev) =>
        prev.map((b) =>
          b._id === builder._id ? { ...b, is_premium: !b.is_premium } : b,
        ),
      );
      showToast(
        !builder.is_premium
          ? `${builder.name} marked as Premium`
          : `${builder.name} removed from Premium`,
      );
    } catch (error) {
      showToast("Failed to update builder", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (builder) => {
    if (!confirm(`Delete "${builder.name}"? This cannot be undone.`)) return;
    setBusyId(builder._id);
    try {
      await axios.delete(`/api/admin/builders/${builder._id}`);
      setBuilders((prev) => prev.filter((b) => b._id !== builder._id));
      showToast("Builder deleted");
    } catch (error) {
      showToast("Failed to delete builder", "error");
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast("Builder name is required", "error");
      return;
    }
    setCreating(true);
    try {
      const form = new FormData();
      form.append("name", newName.trim());
      if (newLogo) form.append("logo", newLogo);
      const { data } = await axios.post("/api/admin/builders", form);
      setBuilders((prev) =>
        [...prev, data.builder].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setNewName("");
      setNewLogo(null);
      setShowAddForm(false);
      showToast("Builder created successfully");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to create builder",
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
        title="Manage Builders"
        description="View, feature, and remove builders"
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
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Builders</h1>
              <p className="text-sm text-muted-foreground">
                Mark builders as Premium to feature them more prominently in
                the "Our Partners" carousel on the homepage.
              </p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm((v) => !v)}>
            <Plus className="h-4 w-4 mr-2" /> Add Builder
          </Button>
        </div>

        {showAddForm && (
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle>New Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Builder name"
                  />
                </div>
                <div>
                  <Label>Logo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0] || null;
                      setNewLogo(file ? await compressImage(file) : null);
                    }}
                  />
                </div>
                <Button type="submit" disabled={creating}>
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...
                    </>
                  ) : (
                    "Create Builder"
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
        ) : builders.length === 0 ? (
          <Card className="shadow-lg">
            <CardContent className="py-12 text-center text-muted-foreground">
              No builders yet. Builders are also created inline from the
              property add/edit form.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {builders.map((builder) => (
              <Card key={builder._id} className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                    {builder.logo?.url ? (
                      <img
                        src={builder.logo.url}
                        alt={builder.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{builder.name}</p>
                      {builder.is_premium && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-slate-900">
                          <Crown className="h-3 w-3" /> Premium
                        </span>
                      )}
                    </div>
                    {builder.website && (
                      <p className="text-xs text-muted-foreground truncate">
                        {builder.website}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={busyId === builder._id}
                    onClick={() => togglePremium(builder)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors disabled:opacity-50 ${
                      builder.is_premium ? "bg-amber-400" : "bg-gray-300"
                    }`}
                    title={
                      builder.is_premium
                        ? "Remove from Premium"
                        : "Mark as Premium"
                    }
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        builder.is_premium ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={busyId === builder._id}
                    onClick={() => handleDelete(builder)}
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
