import React from 'react';
import { HiOutlineMail, HiOutlinePhone, HiOutlineUser } from 'react-icons/hi';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';


export default function AdminContactCard({
  contactId,
  name,
  email,
  phone,
  message,
  status,
  onView,
  onDelete,
}) {
  const getStatusStyle = () => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-lg transition space-y-4">
      {/* Name & Contact Info */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-gray-800 text-base font-semibold">
          <HiOutlineUser className="text-lg text-blue-600" />
          {name}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <HiOutlineMail className="text-gray-400" />
          {email}
        </div>
        {phone && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <HiOutlinePhone className="text-gray-400" />
            +91 {phone}
          </div>
        )}
      </div>

      {/* Message */}
      <div className="text-sm text-gray-700 border-l-4 border-blue-500 pl-3 italic">
        “{message}”
      </div>

      {/* Footer: Status & Actions */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        {/* Status */}
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusStyle()}`}
        >
          {status}
        </span>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onView(contactId)}
            className="flex items-center gap-1 px-3 cursor-pointer py-1.5 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
          >
            <FiEdit2 className="text-sm" />
            Update
          </button>
          <button
            onClick={() => onDelete(contactId)}
            className="flex items-center gap-1 px-3 py-1.5 cursor-pointer text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
          >
            <FiTrash2 className="text-sm" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
