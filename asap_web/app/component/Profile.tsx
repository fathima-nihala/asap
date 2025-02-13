
"use client";
import Image from "next/image";
import { Edit, Mail, Phone, LogOut } from "lucide-react";
import ProgressBar from "../shared/ProgressBar";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { loadUser, logoutUser } from "../redux/features/authSlice";
import { AppDispatch, RootState } from "../redux/store";
import { useSnackbar } from 'notistack';
import { useEffect, useState } from "react";
import EditProfile from "./EditProfile";


export default function Profile() {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [addProfOpen, setAddProfOpen] = useState<boolean>(false); 

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!isAuthenticated && !token) {
            router.push("/login");
        } else if (token) {
            dispatch(loadUser());
        }
    
    }, [isAuthenticated, router, dispatch]);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(date);
    };
    

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            enqueueSnackbar('Logged out successfully!', { 
                variant: 'success',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            router.push("/login");
        } catch (error) {
            enqueueSnackbar('Logout failed. Please try again.', { 
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'right',
                }
            });
            console.error("Logout failed:", error);
        }
    };

    const getFullName = () => {
        const firstName = user?.f_name || '';
        const lastName = user?.l_name || '';
        return `${firstName} ${lastName}`.trim() || 'N/A';
    };
    


    return (
        <>
        <div className="w-full">
            <div className="bg-white shadow-lg rounded-2xl  p-4 border">
                {/* Profile Section */}
                <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 rounded-full border-4 border-dashed border-yellow-400 overflow-hidden">
                        <Image
                            src={user?.profile || "/user.png"}
                            alt="Profile Picture"
                            fill
                            className="object-cover rounded-full"
                        />
                    </div>

                    <div className="w-full lg:px-4  md:px-48 px-20">
                        <ProgressBar />
                    </div>

                    {/* Name and Username */}
                    <h2 className="mt-8 text-lg font-bold">{getFullName()}</h2>
                    <p className="text-gray-500">{user?.f_name}</p>
                </div>

                {/* <div> */}
                {/* Contact Info */}
                <div className="mt-4 space-y-2 text-gray-600">
                    <p className="flex items-center space-x-2">
                        <Phone size={16} className="text-blue-500" />
                        <span>{user?.phone}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                        <Mail size={16} className="text-blue-500" />
                        <span className="truncate">{user?.email}</span>
                        <span className="text-yellow-500">⚠️</span>
                    </p>

                    {/* Edit Profile Link */}
                    <button className="mt-4 text-blue-600  flex  items-center"  onClick={() => setAddProfOpen(true)}>
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
                    <button className="mt-4 w-full border border-orange-500 text-orange-500 py-2 rounded-md flex items-center justify-center hover:bg-orange-200 transition" onClick={handleLogout}>
                        <LogOut size={16} className="mr-2" />
                        Logout
                    </button>
                </div>

                {/* Last Updated */}
            </div>
            <p className="mt-4 text-xs text-gray-400 text-start">Last updated  {formatDate(user?.updatedAt)}</p>
        </div>

        <EditProfile open={addProfOpen} handleClose={() => setAddProfOpen(false)} initialData={user}/>
        </>
    );
}
