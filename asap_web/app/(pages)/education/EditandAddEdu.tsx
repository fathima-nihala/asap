'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Button,
    Box,
    TextField,
    Divider,
    Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AppDispatch } from '../../redux/store';
import { useSnackbar } from 'notistack';
import { addEducation, editEducation } from '../../redux/features/educationSlice';
import { Education } from '../../types/edu.type';


interface EditAndAddEduProps {
    mode: 'add' | 'edit';
    open: boolean;
    handleClose: () => void;
    initialData?: Education | null;
}

interface FormData {
    degree: string;
    institution: string;
    location: string;
    startYear: string; // Changed to string to match TextField value type
    endYear: string;   // Changed to string to match TextField value type
}

const EditAndAddEdu: React.FC<EditAndAddEduProps> = ({ mode, open, handleClose, initialData }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { enqueueSnackbar } = useSnackbar();
    
    const [data, setData] = useState<FormData>({
        degree: '',
        institution: '',
        location: '',
        startYear: new Date().getFullYear().toString(), // Convert to string
        endYear: new Date().getFullYear().toString(),   // Convert to string
    });

    const [error, setError] = useState<Partial<FormData>>({});

    useEffect(() => {
        if (open && mode === 'edit' && initialData) {
            setData({
                degree: initialData.degree || '',
                institution: initialData.institution || '',
                location: initialData.location || '',
                startYear: initialData.startYear?.toString() || new Date().getFullYear().toString(),
                endYear: initialData.endYear?.toString() || new Date().getFullYear().toString(),
            });
            setError({});
        } else if (open && mode === 'add') {
            setData({
                degree: '',
                institution: '',
                location: '',
                startYear: new Date().getFullYear().toString(),
                endYear: new Date().getFullYear().toString(),
            });
            setError({});
        }
    }, [open, mode, initialData]);

    const validateForm = () => {
        const newErrors: Partial<FormData> = {};

        if (!data.degree) newErrors.degree = 'Degree is required';
        if (!data.institution) newErrors.institution = 'Institution is required';
        if (!data.location) newErrors.location = 'Location is required';
        if (!data.startYear) newErrors.startYear = 'Start year is required';
        if (!data.endYear) newErrors.endYear = 'End year is required';
        
        const startYearNum = parseInt(data.startYear);
        const endYearNum = parseInt(data.endYear);
        
        if (isNaN(startYearNum)) newErrors.startYear = 'Invalid start year';
        if (isNaN(endYearNum)) newErrors.endYear = 'Invalid end year';
        if (startYearNum > endYearNum) {
            newErrors.startYear = 'Start year cannot be greater than end year';
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            const formattedData = {
                ...data,
                startYear: parseInt(data.startYear),
                endYear: parseInt(data.endYear)
            };

            if (mode === 'add') {
                await dispatch(addEducation(formattedData)).unwrap();
                enqueueSnackbar('Education added successfully!', {
                    variant: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' }
                });
            } else if (mode === 'edit' && initialData?._id) {
                await dispatch(editEducation({ 
                    id: initialData._id, 
                    educationData: formattedData as Education 
                })).unwrap();
                enqueueSnackbar('Education updated successfully!', {
                    variant: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' }
                });
            }
            handleClose();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Operation failed';

            enqueueSnackbar(errorMessage, {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
        }
    };

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
                {mode === 'add' ? 'Add Education' : 'Edit Education'}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Box component="form" noValidate autoComplete="off">
                    <Stack spacing={3}>
                        <TextField
                            label="Degree"
                            fullWidth
                            value={data.degree}
                            onChange={(e) => setData({ ...data, degree: e.target.value })}
                            error={!!error.degree}
                            helperText={error.degree}
                        />
                        <TextField
                            label="Institution"
                            fullWidth
                            value={data.institution}
                            onChange={(e) => setData({ ...data, institution: e.target.value })}
                            error={!!error.institution}
                            helperText={error.institution}
                        />
                        <TextField
                            label="Location"
                            fullWidth
                            value={data.location}
                            onChange={(e) => setData({ ...data, location: e.target.value })}
                            error={!!error.location}
                            helperText={error.location}
                        />
                        <TextField
                            label="Start Year"
                            fullWidth
                            type="number"
                            value={data.startYear}
                            onChange={(e) => setData({ ...data, startYear: e.target.value })}
                            error={!!error.startYear}
                            helperText={error.startYear}
                            inputProps={{ min: 1900, max: 9999 }}
                        />
                        <TextField
                            label="End Year"
                            fullWidth
                            type="number"
                            value={data.endYear}
                            onChange={(e) => setData({ ...data, endYear: e.target.value })}
                            error={!!error.endYear}
                            helperText={error.endYear}
                            inputProps={{ min: 1900, max: 9999 }}
                        />
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: 2 }}>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    color="primary"
                >
                    {mode === 'add' ? 'Add Education' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAndAddEdu;