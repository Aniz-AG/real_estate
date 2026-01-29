// src/pages/admin/AdminUser.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import DashboardNavSlider from "../../components/admin/DashboardNavSlider";
import { getAdminUsers } from "../../redux/slices/admin/adminUserSlice";
import AdminUserCard from "../../components/admin/AdminUserCard";
import Modal from "../../components/Modal";
import DeleteUserModal from "../../components/admin/DeleteUser";
import EditUserModal from "../../components/admin/EditUser";
import toast from "react-hot-toast";
function AdminUser() {
  const dispatch = useDispatch();
  const [keywords, setKeywords] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUserId,setSelectedUserId] = useState('');
  const [selectedUserData,setSelectedUserData] = useState({});
  const [userDeleteModal,setUserDeleteModal] = useState(false);
  const [userEditModal,setUserEditModal] = useState(false);

  const { users = [], totalPage = 1, loading = false } = useSelector(
    (state) => state.adminUser.users || [{}]
  );

  useEffect(() => {
    dispatch(getAdminUsers({ keywords, page: currentPage }));
  }, [dispatch, keywords, currentPage]);



  const userDeleteHandler = (id) => {
    setUserDeleteModal(true);
    setSelectedUserId(id);
  }
  const userEditHandler = (id) => {
    setUserEditModal(true);
    setSelectedUserId(id);

   const selectedUser = users.find((user)=> user._id == id);

   if(!selectedUser){
          toast.error("somthing went wrong try again");
   }
   else{
      setSelectedUserData({...selectedUser});
   }

  }


  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardNavSlider />
      <div className="flex-1 p-6">
        {/* Search Input */}
        <div className="flex justify-center mb-5">
          <input
            type="text"
            placeholder="Search users..."
            className="border p-3 w-2/3 md:w-1/2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={keywords}
            onChange={(e) => {
              setKeywords(e.target.value);
              setCurrentPage(1); // Reset page on new search
            }}
          />
        </div>

        {loading ? (
          <Loader />
        ) : users.length === 0 ? (
          <p className="text-center text-gray-600">No users found.</p>
        ) : (
          <div className="grid gap-4">
            {users.map((user) => (
              <AdminUserCard user={user} onDelete={() => userDeleteHandler(user._id)} onEdit={() => userEditHandler(user._id)} />
            ))}
          </div>

        )}

        {/* Pagination */}
        {totalPage > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPage }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded ${currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>


    {/* deleteUserModal */}
    {
      userDeleteModal && (
        <Modal
         onClose={()=>setUserDeleteModal(false)}
        >
         <DeleteUserModal
           onClose={()=>setUserDeleteModal(false)}
           userId={selectedUserId}
         />
        </Modal>
      )
    }

    {/* Edit Modal */}
    {
      userEditModal && (
        <Modal
          onClose={()=>setUserEditModal(false)}
        >
         <EditUserModal 
            onClose={()=>setUserEditModal(false)}
            userData={selectedUserData}
         />
        </Modal>
      )
    }


    </div>
  );
}

export default AdminUser;
