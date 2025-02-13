
'use client';
import { fetchEducation } from "@/app/redux/features/educationSlice";
import { AppDispatch, RootState } from "@/app/redux/store";
import Breadcrumb from "@/app/shared/Breadcrumb";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Education as EducationType } from '../../types/edu.type';
import EditandAddEdu from "./EditandAddEdu";

const Education = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { educationList, loading, error } = useSelector((state: RootState) => state.education);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedEducation, setSelectedEducation] = useState<EducationType | null>(null);

    useEffect(() => {
        dispatch(fetchEducation())
    }, [dispatch])

    const handleAddClick = () => {
        setModalMode('add');
        setSelectedEducation(null);
        setModalOpen(true);
    };

    const handleEditClick = (education: EducationType) => {
        setModalMode('edit');
        setSelectedEducation(education);
        setModalOpen(true);
    };

    return (
        <>
            <div className="w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <Breadcrumb pageName="Education" />
                    <button 
                        className="w-full sm:w-auto px-4 py-2 bg-blue-300 text-white rounded-md hover:bg-blue-600"
                        onClick={handleAddClick}
                    >
                        Add Education
                    </button>
                </div>

                <div className="border  bg-white rounded-lg p-4 w-full max-w-2xl mx-auto">
                    {loading && <p>Loading...</p>}
                    {error && <p>Error: {error}</p>}
                    
                    {!loading && !error && educationList.map((edu) => (
                        <div key={edu._id} className="mb-4 border-b last:border-none pb-4">
                            <div className="flex justify-between items-start">
                                <h3 className="text-md font-medium">{edu.degree}</h3>
                                <button 
                                    className="text-orange-500 border border-orange-500 px-2 py-1 text-xs rounded flex items-center space-x-1 hover:bg-orange-100"
                                    onClick={() => handleEditClick(edu)}
                                >
                                    <Pencil size={12} />
                                    <span>Edit</span>
                                </button>
                            </div>
                            <p className="text-sm text-gray-600">{edu.institution}, {edu.location}</p>
                            <p className="text-sm text-gray-500">{edu.startYear} – {edu.endYear}</p>
                        </div>
                    ))}

                    {!loading && !error && educationList.length === 0 && (
                        <p className="text-center text-gray-500">No education records found</p>
                    )}
                </div>
            </div>

            <EditandAddEdu 
                open={modalOpen}
                mode={modalMode}
                handleClose={() => setModalOpen(false)}
                initialData={selectedEducation}
            />
        </>
    );
};

export default Education;