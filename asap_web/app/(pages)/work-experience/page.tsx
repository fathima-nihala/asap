
"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import {
    fetchWorkExperiences,
    addWorkExperience,
    editWorkExperience
} from '../../redux/features/workSlice';
import { WorkExperience, WorkExperienceRequest } from '../../types/work.type';
import { useSnackbar } from 'notistack';
import Breadcrumb from '@/app/shared/Breadcrumb';
import { format } from 'date-fns';

interface ApiError {
    message: string;
    status?: number;
}

const WorkExperiencePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading } = useSelector((state: RootState) => state.workExperience);
    const { enqueueSnackbar } = useSnackbar();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);

    const [formData, setFormData] = useState<WorkExperienceRequest>({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        location: '',
        description: '',
        projects: []
    });

    const [newProject, setNewProject] = useState<string>('');

    useEffect(() => {
        dispatch(fetchWorkExperiences());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: val
        }));
    };

    const addProject = () => {
        if (newProject.trim() === '') return;

        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, newProject.trim()]
        }));
        setNewProject('');
    };

    const removeProject = (index: number) => {
        setFormData(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    const openAddModal = () => {
        setEditId(null);
        setFormData({
            title: '',
            company: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            location: '',
            description: '',
            projects: []
        });
        setIsModalOpen(true);
    };

    const openEditModal = (experience: WorkExperience) => {
        setEditId(experience._id);
        setFormData({
            title: experience.title,
            company: experience.company,
            startDate: new Date(experience.startDate).toISOString().split('T')[0],
            endDate: experience.endDate ? new Date(experience.endDate).toISOString().split('T')[0] : '',
            isCurrent: experience.isCurrent,
            location: experience.location || '',
            description: experience.description || '',
            projects: experience.projects || []
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditId(null);
        setNewProject('');
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Present';
        return format(new Date(dateString), 'MMMM yyyy');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editId) {
                await dispatch(editWorkExperience({ id: editId, data: formData })).unwrap();
                enqueueSnackbar('Work experience updated successfully!', { variant: 'success' });
            } else {
                await dispatch(addWorkExperience(formData)).unwrap();
                enqueueSnackbar('Work experience added successfully!', { variant: 'success' });
            }
            closeModal();
        } catch (error) {
            const apiError = error as ApiError;
            enqueueSnackbar(apiError.message || 'Something went wrong', { variant: 'error' });
        }
    };

    if (loading && items.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <Breadcrumb pageName="Work Experience" />

            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Work Experience</h1>
                <button
                    onClick={openAddModal}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                    Add Experience
                </button>
            </div>

            {items.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <p className="text-gray-500">No work experience added yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((experience) => (
                        <div key={experience._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-800 flex items-center">
                                        {experience.title}
                                        {experience.isCurrent && (
                                            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                Current
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-gray-600 mt-1">{experience.company}</p>
                                </div>
                                <button
                                    onClick={() => openEditModal(experience)}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Edit
                                </button>
                            </div>

                            <div className="mt-2 text-sm text-gray-500 flex flex-wrap items-center gap-x-4">
                                {experience.location && (
                                    <span>{experience.location}</span>
                                )}
                                <span>
                                    {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
                                </span>
                            </div>

                            {experience.description && (
                                <p className="mt-3 text-gray-700">{experience.description}</p>
                            )}

                            {experience.projects && experience.projects.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Projects</h4>
                                    <ul className="space-y-2">
                                        {experience.projects.map((project, index) => (
                                            <li key={index} className="bg-gray-50 px-3 py-2 rounded-md">
                                                {project}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editId ? 'Edit Work Experience' : 'Add Work Experience'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Company *
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full rounded-md border border-gray-300 py-2 px-3"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        disabled={formData.isCurrent}
                                        className="w-full rounded-md border border-gray-300 py-2 px-3 disabled:bg-gray-100"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isCurrent"
                                    name="isCurrent"
                                    checked={formData.isCurrent}
                                    onChange={handleChange}
                                    className="h-4 w-4 rounded border-gray-300"
                                />
                                <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-700">
                                    I currently work here
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full rounded-md border border-gray-300 py-2 px-3"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Projects
                                </label>
                                
                                {formData.projects.length > 0 && (
                                    <ul className="mb-4 space-y-2">
                                        {formData.projects.map((project, index) => (
                                            <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                                                <span>{project}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeProject(index)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    Remove
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newProject}
                                        onChange={(e) => setNewProject(e.target.value)}
                                        placeholder="Add a project"
                                        className="flex-1 rounded-md border border-gray-300 py-2 px-3"
                                    />
                                    <button
                                        type="button"
                                        onClick={addProject}
                                        disabled={!newProject.trim()}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkExperiencePage;