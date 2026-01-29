import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminDeleteProperty, getAdminProperties } from "../../redux/slices/admin/adminPropertySlice";
import toast from "react-hot-toast";

const DeleteProperty = ({ propertyId, onCancel, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(
    (state) => state.adminProperty.deleteProperty
  );


  const reGetAdminProperties = () => {
    dispatch(getAdminProperties({}));
  }
  const handleDelete = async () => {
    dispatch(adminDeleteProperty(propertyId))
      .then((data) => {
        if (data.payload?.success) {
          toast.success("property deleted successflly");
          reGetAdminProperties();
          onClose();
        }
        else {
          toast.error(data.payload)
          return;
        }
      })

    return;
  };

  return (
    <div className="flex justify-center items-center bg-opacity-100 backdrop-blur-sm">
      <div className="rounded-lg  p-6 w-80 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Are you sure you want to delete this property?
        </h2>

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-500 text-white cursor-pointer px-4 py-2 rounded-md shadow-md hover:bg-red-600 transition disabled:opacity-50"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Sure"}
          </button>
          <button
            className="bg-gray-300 text-gray-700 cursor-pointer px-4 py-2 rounded-md shadow-md hover:bg-gray-400 transition"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProperty;
