import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateProfile } from '@/redux/slices/userSlice';
import { Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditProfileModal({ isOpen, onClose }) {
    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.user);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        city: '',
        state: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || '',
                email: user.email || '',
                phone: user.phone || '',
                city: user.city || '',
                state: user.state || '',
            });
            setPreviewUrl(user.photo?.url || null);
            setSelectedFile(null);
        }
    }, [user, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.username || !formData.email || !formData.phone || !formData.city || !formData.state) {
            toast.error('Please fill all required fields');
            return;
        }

        try {
            const data = new FormData();
            data.append('username', formData.username);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('city', formData.city);
            data.append('state', formData.state);

            // Only append file if a new one was selected
            if (selectedFile) {
                data.append('file', selectedFile);
            }

            await dispatch(updateProfile(data)).unwrap();
            toast.success('Profile updated successfully');
            onClose();
        } catch (error) {
            toast.error(error || 'Failed to update profile');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Profile Photo Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={previewUrl} alt="Profile" />
                                <AvatarFallback className="text-2xl">
                                    {formData.username?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            {previewUrl && (
                                <button
                                    type="button"
                                    onClick={handleRemovePhoto}
                                    className="absolute -top-1 -right-1 bg-destructive rounded-full p-1 text-white hover:bg-destructive/90"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                        <div className="w-full">
                            <Label htmlFor="photo" className="cursor-pointer">
                                <div className="text-center p-2 border-2 border-dashed border-muted-foreground rounded-lg hover:bg-muted transition">
                                    <span className="text-sm text-muted-foreground">
                                        Click to upload photo (Optional)
                                    </span>
                                </div>
                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </Label>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="username">Username *</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Enter username"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="phone">Phone *</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone (10 digits)"
                                maxLength="10"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="Enter city"
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="state">State *</Label>
                            <Input
                                id="state"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="Enter state"
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="gap-2">
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
