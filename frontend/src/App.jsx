import React, { lazy, Suspense, useEffect } from 'react';
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import './App.css';


import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { getMyProfile, userExist, userNotExist } from './redux/slices/userSlice.js'


// import components using normal way
import Loader from './components/Loader.jsx';
import Layout from './components/Layout.jsx'; 
import ProtectedRouter, { AuthRouteWrapper } from './components/ProtectedRouter.jsx';


// import pages using lazy loading
const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Agents = lazy(() => import('./pages/Agents.jsx'));
const AgentDetails = lazy(() => import('./pages/AgentDetails.jsx'));
const BrowseProperty = lazy(() => import('./pages/BrowseProperty.jsx'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFound.jsx'));
const Profile = lazy(()=>import('./pages/Profile.jsx'));
const Login = lazy(()=>import('./pages/Login.jsx'));
const Register = lazy(()=>import('./pages/Register.jsx'));



// import admin page using lazy loading.....
const AdminProperty = lazy(()=>import('./pages/admin/AdminProperty.jsx'));
const AddProperty = lazy(()=>import('./pages/admin/AddProperty.jsx'));
const AdminUser = lazy(()=>import('./pages/admin/AdminUser.jsx'));
const AdminContact = lazy(()=>import('./pages/admin/AdminContact.jsx'));





const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/about',
    element: (
      <Layout>
        <About />
      </Layout>
    ),
  },
  {
    path: '/contact',
    element: (
      <Layout>
        <Contact />
      </Layout>
    ),
  },
  {
    path: '/agents',
    element: (
      <Layout>
        <Agents />
      </Layout>
    ),
  },
  {
    path: '/agent/:id',
    element: (
      <Layout>
        <AgentDetails />
      </Layout>
    ),
  },
  {
    path: '/browse',
    element: (
      <Layout>
        <BrowseProperty />
      </Layout>
    ),
  },
  {
    path: '/contact-us',
    element: (
      <Layout>
        <Contact />
      </Layout>
    ),
  },
  {
    path: '/property/:id',
    element: (
      <Layout>
        <PropertyDetails />
      </Layout>
    ),
  },

  // Auth routes
  {
    path: '/login',
    element: (
      <AuthRouteWrapper>
        <Layout>
          <Login />
        </Layout>
      </AuthRouteWrapper>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthRouteWrapper>
        <Layout>
          <Register />
        </Layout>
      </AuthRouteWrapper>
    ),
  },
  

  // Protected Profile Route
  {
    path: '/profile',
    element: (
      <ProtectedRouter>
        <Layout>
          <Profile />
        </Layout>
      </ProtectedRouter>
    ),
  },

  // Admin Protected Dashboard Routes
  {
    path: '/dashboard/property',
    element: (
      <ProtectedRouter adminRoute={true}>
        <Layout>
          <AdminProperty />
        </Layout>
      </ProtectedRouter>
    ),
  },
  {
    path: '/dashboard/property/add',
    element: (
      <ProtectedRouter adminRoute={true}>
        <Layout>
          <AddProperty />
        </Layout>
      </ProtectedRouter>
    ),
  },
  {
    path: '/dashboard/user',
    element: (
      <ProtectedRouter adminRoute={true}>
        <Layout>
          <AdminUser />
        </Layout>
      </ProtectedRouter>
    ),
  },
  {
    path: '/dashboard/contact',
    element: (
      <ProtectedRouter adminRoute={true}>
        <Layout>
          <AdminContact />
        </Layout>
      </ProtectedRouter>
    ),
  },

  // 404 fallback
  {
    path: '*',
    element: (
      <Layout>
        <NotFoundPage />
      </Layout>
    ),
  },
]);



// App Component
const App = () => {

  const dispatch = useDispatch();

  useEffect(()=>{
       dispatch(getMyProfile())
       .then(data=>{
            if(data.payload?.success){
                toast.success("welcome back. "+ data.payload.user.username)
                const  user = data.payload.user;
                dispatch(userExist(user));
            }
            else{
                dispatch(userNotExist())
            }
       })
    
  },[dispatch]);
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
      <Toaster position="bottom-center" />
    </Suspense>
  );
};

export default App;
