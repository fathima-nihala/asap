
import { CheckCircle } from "lucide-react";
import Breadcrumb from "./shared/Breadcrumb";

export default function Home() {
  return (
    <div className="w-full">
      {/* Header with Breadcrumb and Update Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <Breadcrumb pageName="Basic Information" />
        <button className="w-full sm:w-auto px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-600">
          Update
        </button>
      </div>

      {/* Information Card */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-12 gap-y-6">
          {/* First Row */}
          <div className="space-y-1">
            <p className="text-gray-700 font-medium text-sm">Full Name</p>
            <p className="text-gray-900">Abhishek Shankar</p>
          </div>

          <div className="space-y-1">
            <p className="text-gray-700 font-medium text-sm">Date of Birth</p>
            <p className="text-gray-900">18/10/1999</p>
          </div>

          <div className="space-y-1">
            <p className="text-gray-700 font-medium text-sm">Gender</p>
            <p className="text-gray-900">Male</p>
          </div>

          {/* Second Row */}
          <div className="space-y-1">
            <p className="text-gray-700 font-medium text-sm">Mobile</p>
            <p className="text-gray-900 flex items-center gap-2">
              +91 9876543210 
              <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-gray-700 font-medium text-sm">Email</p>
            <p className="text-gray-900 flex items-center gap-2">
              <span className="truncate">abhishekshankar123@gmail.com</span>
              <CheckCircle className="text-green-500 flex-shrink-0" size={16} />
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-gray-700 font-medium text-sm">Aadhar</p>
            <div className="flex items-center gap-2">
              <p className="text-gray-900">33XX XXXX XXXX XX22</p>
              <button className="bg-red-500 text-white px-3 py-1 text-xs rounded hover:bg-red-600 flex-shrink-0">
                Verify
              </button>
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 space-y-1">
            <p className="text-gray-700 font-medium text-sm">Address</p>
            <p className="text-gray-900">
              Sweet Home, Evergreen Street, Varkkala, Thiruvananthapuram, Kerala,
              695001, India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}