"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchPortfolio } from '../../redux/features/protfolioSlice';
import { useState } from 'react';
import EditPortfolio from './EditProtfolio';
import Breadcrumb from '@/app/shared/Breadcrumb';

const PortfolioPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, error } = useSelector((state: RootState) => state.portfolio);
    const [addPortfolioOpen, setPortfolioOpen] = useState<boolean>(false);

    useEffect(() => {
        dispatch(fetchPortfolio());
    }, [dispatch]);

    if (loading && !data) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
                    <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
                    <p className="text-red-600">{error}</p>
                    <button
                        className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition duration-150"
                        onClick={() => dispatch(fetchPortfolio())}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full">
                <div className="flex justify-between items-center mb-6">
                    <Breadcrumb pageName='Protfolio'/>
                    <button 
                        className="px-4 py-2 bg-sky-100 text-sky-600 rounded-md hover:bg-sky-200 transition-colors"
                        onClick={() => setPortfolioOpen(true)}
                    >
                        Update Portfolio
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">GitHub</h3>
                        <p className="text-gray-600">
                            {data?.github || 'https://github.com/abhishekshankar'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Behance</h3>
                        <p className="text-gray-600">
                            {data?.behance || 'https://www.behance.net/abhishekshankar'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Personal Website</h3>
                        <p className="text-gray-600">
                            {data?.personalWebsite || 'http://www.abhishekshankar.info'}
                        </p>
                    </div>
                </div>
            </div>

            <EditPortfolio 
                open={addPortfolioOpen} 
                handleClose={() => setPortfolioOpen(false)} 
            />
        </>
    );
};

export default PortfolioPage;