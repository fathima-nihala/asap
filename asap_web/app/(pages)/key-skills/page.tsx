
'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchSkills, addSkill, removeSkill } from '../../redux/features/skillsSlice';
import { XCircle } from 'lucide-react';
import Breadcrumb from "@/app/shared/Breadcrumb";
import { useSnackbar } from 'notistack';
import { Skill } from '../../types/skill.types';

const KeySkills = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { skills, loading, error } = useSelector((state: RootState) => state.skills);
    const [newSkill, setNewSkill] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [isAddingSkill, setIsAddingSkill] = useState(false);

    // Fetch skills on component mount
    useEffect(() => {
        const loadSkills = async () => {
            try {
                await dispatch(fetchSkills()).unwrap();
            } catch (error) {
                console.error('Error fetching skills:', error);
                enqueueSnackbar('Failed to load skills', { variant: 'error' });
            }
        };

        loadSkills();
    }, [dispatch, enqueueSnackbar]);

    const handleAddSkill = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent form submission
        
        if (!newSkill.trim()) {
            enqueueSnackbar('Please enter a skill name', { variant: 'error' });
            return;
        }

        try {
            setIsAddingSkill(true);
             await dispatch(addSkill(newSkill.trim())).unwrap();
            setNewSkill('');
            enqueueSnackbar('Skill added successfully', { variant: 'success' });
        } catch (err) {
            console.error('Error adding skill:', err);
            const errorMessage = typeof err === 'string' ? err : 'Failed to add skill';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        } finally {
            setIsAddingSkill(false);
        }
    };

    const handleRemoveSkill = async (skillId: string) => {
        try {
            const result = await dispatch(removeSkill(skillId)).unwrap();
            console.log('Removed skill result:', result);
            enqueueSnackbar('Skill removed successfully', { variant: 'success' });
        } catch (err) {
            console.error('Error removing skill:', err);
            const errorMessage = typeof err === 'string' ? err : 'Failed to remove skill';
            enqueueSnackbar(errorMessage, { variant: 'error' });
        }
    };

    return (
        <div className='w-full'> 
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <Breadcrumb pageName="Key Skills" />
                    <form 
                        onSubmit={handleAddSkill}
                        className="flex w-full sm:w-auto gap-4"
                    >
                        <input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Enter new skill"
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={loading || isAddingSkill}
                        />
                        <button
                            type="submit"
                            disabled={loading || isAddingSkill}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                        >
                            {isAddingSkill ? 'Adding...' : 'Add Skill'}
                        </button>
                    </form>
                </div>
        <div className="w-full bg-gray-50 min-h-screen p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                {/* Skills Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.isArray(skills) && skills.map((skill: Skill) => (
                        <div
                            key={skill._id}
                            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200"
                        >
                            <span className="text-gray-700 font-medium truncate">
                                {skill.name}
                            </span>
                            <button
                                onClick={() => handleRemoveSkill(skill._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors ml-2 focus:outline-none"
                                disabled={loading}
                                type="button"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {!loading && (!skills || skills.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                        No skills added yet. Add your first skill above.
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-8 text-gray-500">
                        Loading skills...
                    </div>
                )}
            </div>
        </div>
        </div>

    );
};

export default KeySkills;