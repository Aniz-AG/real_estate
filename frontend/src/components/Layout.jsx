import { Suspense } from 'react'
import Loader from './Loader.jsx'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className='px-2 py-[5rem] min-h-[80vh]'>{children}</div>
      <Footer />
     
    </>
  )
}

export default Layout
