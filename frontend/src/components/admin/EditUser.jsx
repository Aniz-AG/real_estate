import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminUserEdit, getAdminUsers } from "../../redux/slices/admin/adminUserSlice";
import toast from "react-hot-toast";

function EditUser({ userData, onClose }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.adminUser.updateUser);

  const [formData, setFormData] = useState({
    username: userData.username || "",
    email: userData.email || "",
    phone: userData.phone || "",
    city: userData.city || "",
    state: userData.state || "",
    role: userData.role || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    const updatedUser = {
      ...formData,
    };

    const reFetchedAllUsers = ()=>{
        dispatch(getAdminUsers({}));
    }
    dispatch(adminUserEdit({ userId: userData._id, updateData: updatedUser }))
      .then((result) => {
        if (result.payload?.success) {
          toast.success("User updated successfully!");
          reFetchedAllUsers();
          onClose();
        } else {
          toast.error(result.payload?.message || "Update failed.");
        }
      })

  };

  return (
    <div className="flex items-center justify-center w-full bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Edit User</h2>

        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="border rounded-md p-2 w-full"
          />

          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded-md p-2 w-full"
          />

          <label className="text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="border rounded-md p-2 w-full"
          />

          <label className="text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="border rounded-md p-2 w-full"
          />

          <label className="text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="border rounded-md p-2 w-full"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mt-6 flex justify-between gap-4">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md w-full cursor-pointer hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update"}
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md w-full cursor-pointer hover:bg-gray-400 transition"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
