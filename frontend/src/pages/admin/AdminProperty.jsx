import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import DashboardNavSlider from "../../components/admin/DashboardNavSlider";
import AdminPropertyCard from "../../components/admin/AdminPropertyCard";
import DeleteModal from "../../components/admin/DeleteProperty.jsx";
import Modal from "../../components/Modal.jsx"
import { getAdminProperties } from "../../redux/slices/admin/adminPropertySlice";
import UpdateProperty from "../../components/admin/UpdateProperty.jsx";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";


function AdminProperty() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [selectedPropertyData,setSelectedPropertyData] = useState({});

  const { properties, totalPage = 1, loading = false } = useSelector(
    (state) => state.adminProperty.properties
  );

  // Fetch properties with debounce
  const fetchProperties = useCallback(() => {
    dispatch(getAdminProperties({ page: currentPage, keywords }));
  }, [dispatch, currentPage, keywords]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchProperties();
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [fetchProperties]);

  // Open Delete Modal with selected property ID
  const deleteModalHandler = (id) => {
    setSelectedPropertyId(id);
    setDeleteModal(true);
  };

  const updateModalHanlder = (id) => {
     setSelectedPropertyId(id);
     setUpdateModal(true)
     const selectedPropertyData = properties.find((property) => property._id == id);

     if(!selectedPropertyData){
          toast.error("Something went wait and try Again")
     };

     setSelectedPropertyData(selectedPropertyData);     
  };




  return (
    <div className="flex min-h-screen bg-gray-100">
      <DashboardNavSlider />
      <div className="flex-1 p-6 flex-wrap">
  <div className="relative w-full mb-5 flex items-center">
    
    {/* Centered Search Input */}
    <div className="absolute left-1/2 transform -translate-x-1/2">
      <input
        type="text"
        placeholder="Search properties..."
        className="border p-3 w-[12rem] md:w-[30rem] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mx-1"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
      />
    </div>

    {/* Right-Aligned Add Property Button */}
    <Link
      to="/dashboard/property/add"
      className="ml-auto text-white px-5 py-3 rounded-lg bg-red-500 hover:bg-red-700 transition"
    >
      Add Property
    </Link>

  </div>



        {/* Properties List */}
        <div className="h-[65vh] overflow-y-auto px-2 custom-scrollbar">
          {loading ? (
            <p className="text-center text-gray-500">
              <Loader />
            </p>
          ) : (
            <div className="min-h-[80vh] overflow-y-scroll scrollbar-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {properties?.length > 0 ? (
                properties.map((property) => (
                  <AdminPropertyCard
                    key={property._id}
                    property={property}
                    onView={() => navigate(`/property/${property._id}`)}
                    onDelete={() => deleteModalHandler(property._id)}
                    onManage={() => updateModalHanlder(property._id)}
                    className="hover:shadow-lg transition-shadow duration-300"
                  />
                ))
              ) : (
                <div className="col-span-3 flex flex-col items-center justify-center py-10">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
                    alt="No Data"
                    className="w-24 h-24 opacity-80"
                  />
                  <h2 className="text-xl font-semibold text-gray-700 mt-4">No Properties Found</h2>
                  <p className="text-gray-500 text-sm text-center max-w-md">
                    Try adjusting your filters or search keywords. You can also add new properties to populate this list.
                  </p>
                  <button
                    className="mt-4 px-5 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600 transition"
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </button>
                </div>

              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPage > 1 && (
          <div className="flex justify-center mt-6 gap-4">
            <button
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-lg font-semibold">
              Page {currentPage} of {totalPage}
            </span>
            <button
              className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPage))}
              disabled={currentPage === totalPage}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteModal && (
        <Modal
          onClose={() => setDeleteModal(false)}
        >
          <DeleteModal
            onCancel={() => setDeleteModal(false)}
            onClose={() => setDeleteModal(false)}
            propertyId={selectedPropertyId}
          />
        </Modal>
      )}

      {/* update property Modal */}
      {updateModal && (
        <Modal
          onClose={() => setUpdateModal(false)}
        >
          <UpdateProperty
            propertyData={selectedPropertyData}
            onCancel={()=> setUpdateModal(false)}
            onClose={()=> setUpdateModal(false)}
        
          />
        </Modal>
      )}
    </div>
  );
}

export default AdminProperty;
