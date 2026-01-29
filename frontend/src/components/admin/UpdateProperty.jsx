import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminUpdateProperty, getAdminProperties } from "../../redux/slices/admin/adminPropertySlice";

import toast from "react-hot-toast";

const UpdateProperty = ({ propertyData = {}, onCancel, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.adminProperty.updateProperty);

  const [formData, setFormData] = useState({
    price: propertyData?.price || "",
    status: propertyData?.status || "available",
    usage_type: propertyData?.usage_type || "rent",
    description: propertyData?.description || "",
  });

  useEffect(() => {
    // Optional: you can sync state here if propertyData is fetched async
  }, [propertyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

   const reGetAdminProperties = () =>{
        dispatch(getAdminProperties({}));
    }
  const handleSubmit = (e) => {
    e.preventDefault();
    const id = propertyData._id;
    dispatch(adminUpdateProperty({ id, formData }))
      .then((data) => {
        if(data?.payload?.success){
            toast.success("your property updated..");
            reGetAdminProperties();
            onClose();
        }

      });
    
  };

  return (
    <div className="flex justify-center items-center bg-opacity-40 backdrop-blur-sm fixed inset-0 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Update Property</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Price */}
          <div>
            <label className="block text-gray-700">Price:</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

         

          {/* Status */}
          <div>
            <label className="block text-gray-700">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>

          {/* Usage Type */}
          <div>
            <label className="block text-gray-700">Usage Type:</label>
            <select
              name="usage_type"
              value={formData.usage_type}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </select>
          </div>

           {/* Description */}
           <div>
            <label className="block text-gray-700">Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProperty;
