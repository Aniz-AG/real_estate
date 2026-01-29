import { Link } from 'react-router-dom'

function PropertiesDropDown() {
  return (
    <div className="absolute top-full left-0 mt-2 w-max bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-20 pointer-events-none group-hover:pointer-events-auto p-4">
    <div className="flex gap-6">
      {/* Apartments Section */}
      <div className="min-w-[150px]">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">Apartments</h4>
        <hr className="mb-2 border-gray-200" />
        <div className="space-y-1 text-sm text-gray-600">
          <Link to="/browse?category=1bhk" className="block hover:text-blue-600">1 BHK</Link>
          <Link to="/browse?category=2bhk" className="block hover:text-blue-600">2 BHK</Link>
          <Link to="/browse?category=3bhk" className="block hover:text-blue-600">3 BHK</Link>
          <Link to="/browse?category=villa" className="block hover:text-blue-600">Villa</Link>
        </div>
      </div>

      {/* Cities Section */}
      <div className="min-w-[150px]">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">Cities</h4>
        <hr className="mb-2 border-gray-200" />
        <div className="space-y-1 text-sm text-gray-600">
          <Link to="/browse?city=jaipur" className="block hover:text-blue-600">Jaipur</Link>
          <Link to="/browse?city=delhi" className="block hover:text-blue-600">Delhi</Link>
          <Link to="/browse?city=mumbai" className="block hover:text-blue-600">Mumbai</Link>
          <Link to="/browse?city=bangalore" className="block hover:text-blue-600">Bangalore</Link>
        </div>
      </div>

      {/* States Section */}
      <div className="min-w-[150px]">
        <h4 className="text-sm font-semibold text-gray-700 mb-1">States</h4>
        <hr className="mb-2 border-gray-200" />
        <div className="space-y-1 text-sm text-gray-600">
          <Link to="/browse?state=rajasthan" className="block hover:text-blue-600">Rajasthan</Link>
          <Link to="/browse?state=maharashtra" className="block hover:text-blue-600">Maharashtra</Link>
          <Link to="/browse?state=karnataka" className="block hover:text-blue-600">Karnataka</Link>
          <Link to="/browse?state=delhi" className="block hover:text-blue-600">Delhi</Link>
        </div>
      </div>
    </div>
  </div>
  )
}

export default PropertiesDropDown