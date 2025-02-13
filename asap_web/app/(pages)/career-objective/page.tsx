
'use client';

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/app/shared/Breadcrumb";
import { useState } from "react";
import { 
  selectCareerObjective, 
  selectCareerLoading, 
  selectCareerError,
  fetchCareerObjective,
  updateCareerObjective
} from "../../redux/features/careerSlice";
import { RootState } from "@/app/redux/store";
import { UpdateCareerPayload } from "../../types/career.types";
import { AppDispatch } from "@/app/redux/store";

const CareerObjective = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    
    const careerData = useSelector(selectCareerObjective);
    const isLoading = useSelector(selectCareerLoading);
    const error = useSelector(selectCareerError);
    const { user } = useSelector((state: RootState) => state.auth);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UpdateCareerPayload>({
        mainHeading: "",
        subHeading: "",
        description: ""
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = user?._id;

        if (!token) {
            router.push('/login');
            return;
        }

        if (userId) {
            dispatch(fetchCareerObjective(userId));
        }
    }, [dispatch, router, user?._id]);

    useEffect(() => {
        if (careerData) {
            setFormData({
                mainHeading: careerData.mainHeading,
                subHeading: careerData.subHeading,
                description: careerData.description
            });
        }
    }, [careerData]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        if (!user?._id) return;

        try {
            await dispatch(updateCareerObjective({
                userId: user._id,
                payload: formData
            }));
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update career objective:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        if (careerData) {
            setFormData({
                mainHeading: careerData.mainHeading,
                subHeading: careerData.subHeading,
                description: careerData.description
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="w-full bg-gray-50 min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <Breadcrumb pageName="Career Objective" />
                    {!isEditing && (
                        <button
                            className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm"
                            onClick={handleEdit}
                        >
                            Edit Details
                        </button>
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    {isEditing ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Main Heading
                                </label>
                                <input
                                    type="text"
                                    name="mainHeading"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    value={formData.mainHeading}
                                    onChange={handleChange}
                                    placeholder="Enter main heading"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sub Heading
                                </label>
                                <input
                                    type="text"
                                    name="subHeading"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    value={formData.subHeading}
                                    onChange={handleChange}
                                    placeholder="Enter sub heading"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    rows={4}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter your career objective"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                    onClick={handleSave}
                                >
                                    Save Changes
                                </button>
                                <button
                                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {formData.mainHeading}
                                </h3>
                                <h4 className="text-lg text-gray-600 mt-2">
                                    {formData.subHeading}
                                </h4>
                                <p className="text-gray-600 mt-4 leading-relaxed">
                                    {formData.description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CareerObjective;