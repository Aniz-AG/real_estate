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
  MapPin,
  Phone,
  Share2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Settings as SettingsIcon,
  LayoutGrid,
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

export default function AdminSettings() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    whatsapp: "",
    email: "",
    support_email: "",
    office_hours: "",
    social: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
      youtube: "",
    },
    show_top_cities: true,
  });

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
      fetchSettings();
    }
  }, [mounted, isAuthenticated, user]);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get("/api/admin/settings");
      const s = data.settings || {};
      setFormData({
        address_line: s.address_line || "",
        city: s.city || "",
        state: s.state || "",
        pincode: s.pincode || "",
        phone: s.phone || "",
        whatsapp: s.whatsapp || "",
        email: s.email || "",
        support_email: s.support_email || "",
        office_hours: s.office_hours || "",
        social: {
          facebook: s.social?.facebook || "",
          twitter: s.social?.twitter || "",
          instagram: s.social?.instagram || "",
          linkedin: s.social?.linkedin || "",
          youtube: s.social?.youtube || "",
        },
        show_top_cities: s.show_top_cities !== false,
      });
    } catch (error) {
      showToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      social: { ...prev.social, [name]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put("/api/admin/settings", formData);
      showToast("Settings saved successfully!");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to save settings",
        "error",
      );
    } finally {
      setSaving(false);
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
        title="Site Settings"
        description="Manage business address, contact info, and social links"
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

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/50 text-white shadow-lg">
            <SettingsIcon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Site Settings</h1>
            <p className="text-sm text-muted-foreground">
              This information appears in the footer, Contact Us page, and
              anywhere the site shows a way to reach you.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Office Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Address Line</Label>
                  <Input
                    name="address_line"
                    value={formData.address_line}
                    onChange={handleChange}
                    placeholder="123 Real Estate Street"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" /> Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label>WhatsApp Number</Label>
                    <Input
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="If different from phone"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Email</Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="info@yourcompany.com"
                    />
                  </div>
                  <div>
                    <Label>Support Email (optional)</Label>
                    <Input
                      type="email"
                      name="support_email"
                      value={formData.support_email}
                      onChange={handleChange}
                      placeholder="support@yourcompany.com"
                    />
                  </div>
                </div>
                <div>
                  <Label>Office Hours</Label>
                  <Input
                    name="office_hours"
                    value={formData.office_hours}
                    onChange={handleChange}
                    placeholder="Mon-Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-primary" /> Social Media Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      name="facebook"
                      value={formData.social.facebook}
                      onChange={handleSocialChange}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  <div>
                    <Label>Twitter / X</Label>
                    <Input
                      name="twitter"
                      value={formData.social.twitter}
                      onChange={handleSocialChange}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  <div>
                    <Label>Instagram</Label>
                    <Input
                      name="instagram"
                      value={formData.social.instagram}
                      onChange={handleSocialChange}
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                  <div>
                    <Label>LinkedIn</Label>
                    <Input
                      name="linkedin"
                      value={formData.social.linkedin}
                      onChange={handleSocialChange}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  <div>
                    <Label>YouTube</Label>
                    <Input
                      name="youtube"
                      value={formData.social.youtube}
                      onChange={handleSocialChange}
                      placeholder="https://youtube.com/@yourchannel"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-primary" /> Homepage
                  Sections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Explore Top Cities</p>
                    <p className="text-sm text-muted-foreground">
                      Show the "Explore Top Cities" section on the homepage
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        show_top_cities: !prev.show_top_cities,
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                      formData.show_top_cities ? "bg-primary" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.show_top_cities
                          ? "translate-x-6"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </form>
        )}
      </div>
    </Layout>
  );
}
