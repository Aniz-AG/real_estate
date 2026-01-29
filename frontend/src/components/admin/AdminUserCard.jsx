import { FaRegUserCircle } from "react-icons/fa";

function AdminUserCard({ user, onEdit, onDelete }) {
    return (
       <div
             key={user._id}
             className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row justify-between items-center md:items-start gap-4"
           >
             <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
               <img
                 src={user.photo.url}
                 alt={user.username}
                 className="w-24 h-24 object-cover rounded-xl shadow"
               />
               <div className="text-center md:text-left">
                 <p className="font-semibold text-lg">{user.username}</p>
                 <p className="text-sm text-gray-500">{user.email}</p>
                 <p className="text-sm text-gray-500">
                   {user.city}, {user.state}
                 </p>
                 <p className="text-sm text-gray-500">📞 {user.phone}</p>
                 {user.role === "admin" && (
                   <div className="mt-2 inline-flex items-center gap-1 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-medium w-fit mx-auto md:mx-0">
                     <FaRegUserCircle className="text-base" />
                     Admin
                   </div>
                 )}
                 
               </div>
             </div>
             <div className="flex gap-2 md:mt-5">
               <button onClick={onEdit}  className="bg-yellow-400 hover:cursor-pointer hover:bg-yellow-300 px-4 py-2 rounded font-medium">
                 Edit
               </button>
               <button onClick={onDelete} className="bg-red-500  hover:cursor-pointer hover:bg-red-400 text-white px-4 py-2 rounded font-medium">
                 Delete
               </button>
             </div>
           </div>
    );
  }
  

export default AdminUserCard;