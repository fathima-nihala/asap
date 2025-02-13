"use client";
import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user,'yyy');

  const nameInitial = user?.f_name ? user.f_name[0].toUpperCase() : '';
  const fullName = user ? `Hi, ${user.f_name} ${user.l_name[0]}...` : 'Hi, Guest';

  

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-[150px] h-[55px] sm:w-[120px] sm:h-[40px] md:w-[150px] md:h-[60px] relative ">
            <Image
              src="/logo.png"
              alt="ASAP Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <button
          className="lg:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Center Section: Navigation */}
        <nav
          className={`absolute lg:static top-16 left-0 w-full lg:w-auto bg-white lg:bg-transparent shadow-md lg:shadow-none flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 text-gray-700 p-4 lg:p-0 transition-all duration-300 ${isOpen ? "block" : "hidden"
            } lg:flex`}
        >
          <a href="#" className="hover:text-blue-600">Jobs</a>
          <a href="#" className="hover:text-blue-600">Internship</a>
          <a href="#" className="hover:text-blue-600">Job Fair</a>
          <a href="#" className="hover:text-blue-600">Companies</a>
          <a href="#" className="hover:text-blue-600">Support</a>
        </nav>

        {/* Right Section: Profile */}
        <div className="hidden lg:flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center">
            {nameInitial}
          </div>
          <span className="text-gray-700 text-sm">{fullName}</span>
        </div>

      </div>
    </header>
  );
}
