import React, { useState } from 'react';
import DashboardNavSlider from '../../components/admin/DashboardNavSlider';
import { useSelector, useDispatch } from 'react-redux'
import { addProperty } from '../../redux/slices/admin/adminPropertySlice';
import toast from 'react-hot-toast'

const initialFormData = {
  address: {
    property_address: '',
    city: '',
    state: '',
    pincode: '',
  },
  property_type: 'apartment',
  price: '',
  nums_bedrooms: '',
  nums_bathrooms: '',
  square_feet: '',
  status: 'available',
  usage_type: 'rent',
  description: '',
  uploaded_by: '',
  photos: [], // Store preview URLs
};

function AddProperty() {
  const { userId } = useSelector(state => state.user)
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.adminProperty.addProperty)

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [photoFiles, setPhotoFiles] = useState([]); // Store original File objects
  const [errors, setErrors] = useState({});

  const handleChange = (section, field, value) => {
    if (section === 'main') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }
  };

  const validateStep1 = () => {
    const { property_address, city, state, pincode } = formData.address;
    const newErrors = {};
    if (!property_address.trim()) newErrors.property_address = 'Property address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!pincode.trim()) newErrors.pincode = 'Pincode is required';
    else if (!/^\d{6}$/.test(pincode)) newErrors.pincode = 'Pincode must be 6 digits';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const fields = ['price', 'nums_bedrooms', 'nums_bathrooms', 'square_feet'];
    const newErrors = {};
    fields.forEach(field => {
      if (!formData[field]) newErrors[field] = `${field.replace('_', ' ')} is required`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.description || formData.description.trim().split(' ').length < 20) {
      newErrors.description = 'Description must be at least 20 words';
    }
    if (photoFiles.length < 1) {
      newErrors.photos = 'Please upload at least one image';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photoFiles.length + files.length > 5) return;
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...previewUrls] }));
    setPhotoFiles(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!validateStep3()) return;

    if (!userId) {
      alert("You're not an authenticated user to upload the property.");
      return;
    }

    const newFormData = { ...formData, uploaded_by: userId };
    const fd = new FormData();

    Object.entries(newFormData.address).forEach(([key, value]) => {
      fd.append(`address[${key}]`, value);
    });

    [
      'property_type', 'price', 'nums_bedrooms', 'nums_bathrooms',
      'square_feet', 'status', 'usage_type', 'description', 'uploaded_by'
    ].forEach(field => {
      fd.append(field, newFormData[field]);
    });

    photoFiles.forEach(file => {
      fd.append('photos', file);
    });

    dispatch(addProperty(fd)).then(data => {
      if (data.payload?.success) {
        toast.success("Your property uploaded successfully");

        // ✅ Reset form to initial values
        setFormData(initialFormData);
        setPhotoFiles([]);
        setErrors({});
        setStep(1);
      }
    });
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setErrors({});
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardNavSlider />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Add New Property</h1>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 1: Address Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['property_address', 'city', 'state', 'pincode'].map((field) => (
                <div key={field}>
                  <label className="block mb-1 font-medium capitalize">{field.replace('_', ' ')}</label>
                  <input
                    type="text"
                    className="p-3 border rounded w-full"
                    placeholder={field.replace('_', ' ')}
                    value={formData.address[field]}
                    onChange={(e) => handleChange('address', field, e.target.value)}
                  />
                  {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={nextStep} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 2: Property Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Property Type</label>
                <select
                  className="p-3 border rounded w-full"
                  value={formData.property_type}
                  onChange={(e) => handleChange('main', 'property_type', e.target.value)}
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                </select>
              </div>
              {['price', 'nums_bedrooms', 'nums_bathrooms', 'square_feet'].map((field) => (
                <div key={field}>
                  <label className="block mb-1 font-medium capitalize">{field.replace('_', ' ')}</label>
                  <input
                    type="number"
                    className="p-3 border rounded w-full"
                    value={formData[field]}
                    onChange={(e) => handleChange('main', field, e.target.value)}
                  />
                  {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                </div>
              ))}
              <div>
                <label className="block mb-1 font-medium">Usage Type</label>
                <select
                  className="p-3 border rounded w-full"
                  value={formData.usage_type}
                  onChange={(e) => handleChange('main', 'usage_type', e.target.value)}
                >
                  <option value="rent">Rent</option>
                  <option value="sale">Sale</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  className="p-3 border rounded w-full"
                  value={formData.status}
                  onChange={(e) => handleChange('main', 'status', e.target.value)}
                >
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600">
                Back
              </button>
              <button onClick={nextStep} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Step 3: Description & Photos</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                rows="4"
                className="p-3 border rounded w-full"
                value={formData.description}
                onChange={(e) => handleChange('main', 'description', e.target.value)}
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">Upload Property Images (1-5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="photo-upload"
                onChange={handleImageUpload}
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Upload Images
              </label>
              {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
              <div className="flex gap-4 mt-4 flex-wrap">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img src={photo} alt={`preview-${index}`} className="w-24 h-24 object-cover rounded" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button onClick={prevStep} className="bg-gray-500 text-white px-5 py-2 rounded hover:bg-gray-600">
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 cursor-pointer"
              >
                {loading ? "Uploading..." : "Submit"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddProperty;
