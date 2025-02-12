
"use client";
import Image from "next/image";
import { Edit, Mail, Phone, LogOut } from "lucide-react";
import ProgressBar from "../shared/ProgressBar";

export default function Profile() {
    return (
        <div className="w-full">
            <div className="bg-white shadow-lg rounded-2xl  p-4 border">
                {/* Profile Section */}
                <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden">
                        <Image
                            src="/user.png"
                            alt="Profile Picture"
                            fill
                            className="object-cover rounded-full"
                        />
                    </div>

                    <div className="w-full lg:px-4  md:px-48 px-20">
                        <ProgressBar />
                    </div>

                    {/* Name and Username */}
                    <h2 className="mt-8 text-lg font-bold">Abhishek Shankar</h2>
                    <p className="text-gray-500">@abhisheks2024</p>
                </div>

                {/* <div> */}
                    {/* Contact Info */}
                    <div className="mt-4 space-y-2 text-gray-600">
                        <p className="flex items-center space-x-2">
                            <Phone size={16} className="text-blue-500" />
                            <span>+91 9876543210</span>
                        </p>
                        <p className="flex items-center space-x-2">
                            <Mail size={16} className="text-blue-500" />
                            <span className="truncate">abhisheksankar123@gmail.com</span>
                            <span className="text-yellow-500">⚠️</span>
                        </p>

                        {/* Edit Profile Link */}
                        <button className="mt-4 text-blue-600  flex  items-center">
                            <Edit size={16} className="" />
                            Edit/Update Profile
                        </button>
                    </div>
                {/* </div> */}

                <div className="p-4 mt-4 bg-orange-100 rounded-md w-full">
                    {/* Navigation Menu */}
                    <div className="space-y-3">
                        <div className="p-2 rounded-md text-orange-600 font-medium flex items-center space-x-2">
                            <span>📄</span> {/* Icon Placeholder */}
                            <span>My Profile</span>
                        </div>
                        <div className="p-2 rounded-md flex items-center space-x-2 cursor-pointer">
                            <span>📍</span> {/* Icon Placeholder */}
                            <span>Payments</span>
                        </div>
                        <div className="p-2 rounded-md flex items-center space-x-2 cursor-pointer">
                            <span>📄</span> {/* Icon Placeholder */}
                            <span>Application Status</span>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button className="mt-4 w-full border border-orange-500 text-orange-500 py-2 rounded-md flex items-center justify-center hover:bg-orange-200 transition">
                        <LogOut size={16} className="mr-2" />
                        Logout
                    </button>
                </div>

                {/* Last Updated */}
                </div>
                <p className="mt-4 text-xs text-gray-400 text-start">Last updated on 10 Oct 2024</p>
            </div>
            );
}
