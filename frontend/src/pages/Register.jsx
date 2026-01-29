import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    photo: null,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [preview, setPreview] = useState("/default-avatar.png");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    const registerFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      registerFormData.append(key, value);
    });
    
    dispatch(registerUser(registerFormData)).then((data) => {
      if (data.payload?.success) {
        toast.success(data.payload.message);
        navigate("/");
      } else {
        toast.error(data.payload);
      }
      setFormSubmitting(false);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-200">
        <h2 className="text-3xl font-semibold text-center mb-6 text-blue-700">
          Create Your Account
        </h2>

        <div className="relative w-24 h-24 mx-auto mb-6">
          <img
            src={preview}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover border-4 border-blue-200"
          />
          <label
            htmlFor="photo"
            className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full w-7 h-7 flex items-center justify-center text-sm text-blue-600 cursor-pointer shadow"
            title="Change avatar"
          >
            ✎
          </label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { name: "username", placeholder: "Username" },
            { name: "email", placeholder: "Email", type: "email" },
            { name: "phone", placeholder: "Phone (10 digits)", maxLength: 10 },
            { name: "city", placeholder: "City" },
            { name: "state", placeholder: "State" },
          ].map(({ name, placeholder, ...rest }) => (
            <input
              key={name}
              type={rest.type || "text"}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
              {...rest}
            />
          ))}

          <button
            type="submit"
            disabled={formSubmitting}
            className={`w-full cursor-pointer mt-6 py-2 rounded transition font-medium ${formSubmitting ? "text-black bg-gray-300" : "text-white bg-blue-500 hover:bg-blue-700"}`}
          >
            {formSubmitting ? "Registering..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
