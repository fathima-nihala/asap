'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, File, Video, Download, Trash2 } from 'lucide-react';
import { useSnackbar } from 'notistack';
import { AppDispatch } from '@/app/redux/store';
import {
    fetchResumes,
    uploadDocumentResume,
    uploadVideoResume,
    updateDocumentResume,
    deleteDocumentResume,
    deleteVideoResume,
    clearError
} from '../../redux/features/resumeSlice';
import { RootState } from '@/app/redux/store';
import Breadcrumb from '@/app/shared/Breadcrumb';

const ResumeUpload = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { enqueueSnackbar } = useSnackbar();
    const { documents, videos, isLoading, error } = useSelector((state: RootState) => state.resume);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadType, setUploadType] = useState<'document' | 'video' | null>(null);

    useEffect(() => {
        dispatch(fetchResumes())
            .unwrap()
            .catch((error) => {
                if (typeof error === 'string') {
                    enqueueSnackbar(error, { variant: 'error' });
                }
            });
    }, [dispatch, enqueueSnackbar]);

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: 'error' });
            dispatch(clearError());
        }
    }, [error, enqueueSnackbar, dispatch]);

    const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type)) {
            enqueueSnackbar('Please upload a PDF or Word document', { variant: 'error' });
            return;
        }

        setIsUploading(true);
        setUploadType('document');
        const formData = new FormData();
        formData.append('resume', file); 

        try {
            await dispatch(uploadDocumentResume(formData)).unwrap();
            enqueueSnackbar('Document resume uploaded successfully', { variant: 'success' });
            e.target.value = ''; // Reset file input
        } catch (error) {
            if (typeof error === 'string') {
                enqueueSnackbar(error, { variant: 'error' });
            }
        } finally {
            setIsUploading(false);
            setUploadType(null);
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['video/mp4', 'video/x-matroska', 'video/x-msvideo'];
        if (!allowedTypes.includes(file.type)) {
            enqueueSnackbar('Please upload an MP4, MKV, or AVI video', { variant: 'error' });
            return;
        }

        setIsUploading(true);
        setUploadType('video');
        const formData = new FormData();
        formData.append('video', file); 
        try {
            await dispatch(uploadVideoResume(formData)).unwrap();
            enqueueSnackbar('Video resume uploaded successfully', { variant: 'success' });
            e.target.value = ''; 
        } catch (error) {
            if (typeof error === 'string') {
                enqueueSnackbar(error, { variant: 'error' });
            }
        } finally {
            setIsUploading(false);
            setUploadType(null);
        }
    };

    const handleDocumentUpdate = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('resume', file); 

        try {
            await dispatch(updateDocumentResume({ id, formData })).unwrap();
            enqueueSnackbar('Document resume updated successfully', { variant: 'success' });
            e.target.value = ''; 
        } catch (error) {
            if (typeof error === 'string') {
                enqueueSnackbar(error, { variant: 'error' });
            }
        }
    };

    const handleDocumentDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;

        try {
            await dispatch(deleteDocumentResume(id)).unwrap();
            enqueueSnackbar('Document resume deleted successfully', { variant: 'success' });
            fetchResumes();
        } catch (error) {
            if (typeof error === 'string') {
                enqueueSnackbar(error, { variant: 'error' });
            }
        }
    };

    const handleVideoDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this video?')) return;

        try {
            await dispatch(deleteVideoResume(id)).unwrap();
            enqueueSnackbar('Video resume deleted successfully', { variant: 'success' });
            fetchResumes();
        } catch (error) {
            if (typeof error === 'string') {
                enqueueSnackbar(error, { variant: 'error' });
            }
        }
    };

    const renderUploadingState = () => (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );

    if (isLoading && !isUploading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <Breadcrumb pageName='Resume' />
            
            {/* Document Resume Section */}
            <div className="border rounded-lg p-6 bg-white relative">
                {isUploading && uploadType === 'document' && renderUploadingState()}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                        <Upload className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-gray-600">Click to upload document resume</span>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={handleDocumentUpload}
                            disabled={isUploading}
                        />
                    </label>
                </div>

                <div className="mt-4 space-y-2">
                    {documents.map((doc) => (
                        <div key={doc._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <File className="w-6 h-6 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{doc.fileName}</p>
                                    <p className="text-xs text-gray-500">
                                        {(doc.fileSize / 1024 / 1024).toFixed(2)} MB • Updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <a
                                    href={`${process.env.NEXT_PUBLIC_API_URL}${doc.downloadUrl}`}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    download
                                >
                                    <Download className="w-5 h-5 text-gray-500" />
                                </a>
                                <label className="p-2 hover:bg-gray-200 rounded-full transition-colors cursor-pointer">
                                    <Upload className="w-5 h-5 text-gray-500" />
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx"
                                        onChange={(e) => handleDocumentUpdate(doc._id, e)}
                                        disabled={isUploading}
                                    />
                                </label>
                                <button
                                    onClick={() => handleDocumentDelete(doc._id)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    disabled={isUploading}
                                >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Video Resume Section */}
            <div className="border rounded-lg bg-white p-6 relative">
                {isUploading && uploadType === 'video' && renderUploadingState()}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <label className="flex flex-col items-center justify-center cursor-pointer">
                        <Video className="w-12 h-12 text-gray-400 mb-2" />
                        <span className="text-gray-600">Click to upload video resume</span>
                        <input
                            type="file"
                            className="hidden"
                            accept=".mp4,.mkv,.avi"
                            onChange={handleVideoUpload}
                            disabled={isUploading}
                        />
                    </label>
                </div>

                <div className="mt-4 space-y-2">
                    {videos.map((video) => (
                        <div key={video._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Video className="w-6 h-6 text-blue-500" />
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{video.fileName}</p>
                                    <p className="text-xs text-gray-500">
                                        {(video.fileSize / 1024 / 1024).toFixed(2)} MB • Duration: {video.duration}s
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <a
                                    href={`${process.env.NEXT_PUBLIC_API_URL}${video.downloadUrl}`}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    download
                                >
                                    <Download className="w-5 h-5 text-gray-500" />
                                </a>
                                <button
                                    onClick={() => handleVideoDelete(video._id)}
                                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                    disabled={isUploading}
                                >
                                    <Trash2 className="w-5 h-5 text-red-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;