import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Loader from '../../components/Loader';
import { getAllContacts ,adminContactUpdate } from '../../redux/slices/admin/adminContactSlice';

function AdminUpdateContactModal({ contactData, onClose }) {
  const [status, setStatus] = useState(contactData.status || '');
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.adminContact.updateConatct); 
  const [isChanged, setIsChanged] = useState(false);

  const updateNewStatus = (newStatus) => {
    dispatch(adminContactUpdate({ contactId: contactData._id, newStatus }))
      .then((data) => {
        if (data.payload?.success) {
          toast.success('Contact status updated.');
          dispatch(getAllContacts({}))
          onClose();
        } else {
          toast.error('Something went wrong. Try again.');
        }

      });
  };

  useEffect(() => {
    setIsChanged(status !== contactData.status);
  }, [status, contactData.status]);

  const handleUpdate = () => {
    if (isChanged && !loading) {
       updateNewStatus(status);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100 animate-scale">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
          Update Contact Status
        </h2>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Current Status
            </label>
            <select
              id="status"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={!isChanged || loading}
              className={`px-4 py-2 text-sm rounded transition flex items-center justify-center gap-2 ${
                isChanged && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-blue-200 text-white cursor-not-allowed'
              }`}
            >
              {loading ? 'updating..' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUpdateContactModal;
