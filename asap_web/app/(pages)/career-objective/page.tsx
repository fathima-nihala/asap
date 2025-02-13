// 'use client';
// import Breadcrumb from "@/app/shared/Breadcrumb";
// import { useState } from "react";

// const CareerObjective = () => {
//     const [isEditing, setIsEditing] = useState(false);
//     const [careerObjective, setCareerObjective] = useState(
//         "Enthusiastic and highly motivated graduate with a degree in Business Administration, eager to apply strong analytical and communication skills in a fast-paced corporate environment. Looking for an entry-level role in marketing where I can contribute to team success while gaining hands-on experience and advancing my career."
//     );
//     const [heading, setHeading] = useState("For Entry-Level Position");

//     const handleEdit = () => {
//         setIsEditing(true);
//     };

//     const handleSave = () => {
//         setIsEditing(false);
//     };

//     return (
//         <>
//             <div className="w-full">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
//                     <Breadcrumb pageName="Career Objective" />
//                     <button
//                         className="w-full sm:w-auto px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-600"
//                         onClick={handleEdit}
//                     >
//                         update
//                     </button>
//                 </div>

//                 <div className="border bg-white rounded-lg p-4 w-full max-w-2xl mx-auto">
//                     {isEditing ? (
//                         <input
//                             type="text"
//                             className="w-full border border-gray-300 rounded-md p-2 mt-2"
//                             value={heading}
//                             onChange={(e) => setHeading(e.target.value)}
//                         />
//                     ) : (
//                         <h4 className="text-md font-medium mt-2">{heading}</h4>
//                     )}

//                     {isEditing ? (
//                         <textarea
//                             className="w-full border border-gray-300 rounded-md p-2 mt-2"
//                             rows={4}
//                             value={careerObjective}
//                             onChange={(e) => setCareerObjective(e.target.value)}
//                         />
//                     ) : (
//                         <p className="text-sm text-gray-600 mt-2">{careerObjective}</p>
//                     )}

//                     {isEditing && (
//                         <button
//                             className="mt-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
//                             onClick={handleSave}
//                         >
//                             Save
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };

// export default CareerObjective;

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