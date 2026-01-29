// AdminContact.jsx
import React, { useEffect, useState } from 'react';
import DashboardNavSlider from '../../components/admin/DashboardNavSlider';
import AdminContactCard from '../../components/admin/AdminContactCard';
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../components/Loader';
import { getAllContacts } from '../../redux/slices/admin/adminContactSlice';
import toast from 'react-hot-toast';
import Modal from '../../components/Modal'
import DeleteContactModal from '../../components/admin/DeleteContactModal';
import AdminUpdateContactModal from '../../components/admin/AdminUpdateContactModal';
function AdminContact() {
    const [statusFilter, setStatusFilter] = useState('');
    const [deleteContactModal, setDeleteContactModal] = useState(false);
    const [updateContactModal, setUpdateContactModal] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState('');
    const [selectedContactData, setSelectedContactData] = useState({});
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();

    const { totalPages, contacts, loading } = useSelector(state => state.adminContact.getAllContact);

    const fetchAllContact = () => {
        dispatch(getAllContacts({ status: statusFilter, page }))
            .then(data => {
                if (data.payload?.success) {
                    toast.success(data.payload.message);
                } else {
                    toast.error(data.payload);
                }
            });
    };

    useEffect(() => {
        const fetchId = setTimeout(() => {
            fetchAllContact({ status: statusFilter, page });
        }, 700);

        return () => {
            clearTimeout(fetchId);
        };
    }, [statusFilter, page]);

    const handleUpdate = (id) => {
        setUpdateContactModal(true)
        const currentContact = contacts.find((contact) => contact._id === id);

        if (!currentContact) {
            setSelectedContactData({});
        }
        else {
            setSelectedContactData(currentContact);

        }

    };

    const handleDelete = (id) => {
        setDeleteContactModal(true)

    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <DashboardNavSlider />

            <div className="flex-1 p-4 sm:p-6">
                {/* Heading and Status Filter */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Contact Requests
                    </h1>

                    <div className="flex items-center gap-2">
                        <label htmlFor="status" className="font-semibold text-gray-700">Status:</label>
                        <select
                            name="status"
                            id="status"
                            className="px-3 py-1 rounded border border-gray-300 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="fulfilled">Fulfilled</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Contact Cards or Loader */}
                {loading ? (
                    <div className="flex justify-center items-center mt-20">
                        <Loader />
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="text-center mt-20 text-gray-500 text-lg">
                        No contact requests found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contacts.map(contact => (
                            <AdminContactCard
                                key={contact._id}
                                contactId={contact._id}
                                name={contact.name}
                                email={contact.email}
                                phone={contact.phone}
                                message={contact.message}
                                status={contact.status}
                                onView={handleUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        className={`px-4 py-2 cursor-pointer bg-gray-300 text-gray-700 rounded hover:bg-gray-400
                        ${1 === page ? 'cursor-no-drop' : 'cursor-pointer'}
                            `}
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                    >
                        Previous
                    </button>

                    <div className="text-sm text-gray-700">
                        Page {page} of {totalPages}
                    </div>

                    <button
                        className={`px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400
                        ${page === totalPages ? "cursor-no-drop" : "cursor-pointer"}
                            `}
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>


            {/* delete the contact using modal */}
            {
                deleteContactModal && (
                    <Modal
                        onClose={() => setDeleteContactModal(false)}
                    >
                        <DeleteContactModal
                            contactId={selectedContactId}
                            onClose={() => setDeleteContactModal(false)}
                            onCancel={() => setDeleteContactModal(false)}
                        />
                    </Modal>
                )
            }
            {/* update the status of contact modal */}
            {
                updateContactModal && (
                    <Modal
                        onClose={() => setUpdateContactModal(false)}
                    >
                        <AdminUpdateContactModal
                            onClose={() => setUpdateContactModal(false)}
                            contactData={selectedContactData}
                        />
                    </Modal>
                )
            }

        </div>
    );
}

export default AdminContact;
