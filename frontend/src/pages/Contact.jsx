import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Modal from '../components/Modal'
import AuthicatedModal from "../components/AuthicatedModal";
import { newContactRequest } from '../redux/slices/admin/adminContactSlice';


function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [authicatedModal,setAuthicatedModal] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.adminContact.requestContact)
  const { isAuthenticated } = useSelector(state => state.user)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const submitContactRequest = ()=>{
       dispatch(newContactRequest(formData))
       .then(data =>{
           if(data?.payload?.success){
                toast.success("your contact request send successfully")
           }
           else{
             toast.error("Something went wrong. Try Again")
           }
       })
  }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if(!isAuthenticated){
       setAuthicatedModal(true)
       return;
    }
    else{
      submitContactRequest();
    }

    // Clear form after submit
    setFormData({ name: "", email: "", phone: "", message: "" });

  };

  return (
    <section className="bg-gray-50 py-16 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Side: Info & Heading */}
        <div>
          <h2 className="text-4xl font-bold text-blue-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6">
            We’d love to hear from you! Whether you have a question about a property, want to list yours, or just want to say hello — our team is ready to help.
          </p>

          <div className="space-y-4 text-gray-700">
            <div>
              📍 <span className="font-semibold">Address:</span> 123 RealNest Ave, Jaipur, India
            </div>
            <div>
              📞 <span className="font-semibold">Phone:</span> +91 98765 43210
            </div>
            <div>
              📧 <span className="font-semibold">Email:</span> hello@realnest.com
            </div>
          </div>
        </div>

        {/* Right Side: Controlled Contact Form */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-blue-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition duration-300"
            >
              {loading ? "Sending" : "Send Message"}
            </button>
          </form>
        </div>

        {/* authicated modal when the user not authicated and send contact reaquest */}
        {authicatedModal && (
            <Modal
              onClose={()=>setAuthicatedModal(false)}
            >
            <AuthicatedModal 
            onClose={()=>setAuthicatedModal(false)}
             />
            </Modal>
          )
        }

      </div>
    </section>
  );
}

export default Contact;
