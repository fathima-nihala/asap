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
    Typography,
    Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AppDispatch } from '../redux/store';
import { useSnackbar } from 'notistack';
import { updateProfile } from '../redux/features/authSlice';
import { User } from '../types/auth.types';
import Image from 'next/image';

interface EditProfileProps {
    initialData?: User | null;
    open: boolean;
    handleClose: () => void;
}

interface FormData {
    f_name: string;
    l_name: string;
    phone?: string;
    image?: File | null;
}

const EditProfile: React.FC<EditProfileProps> = ({ open, handleClose, initialData }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [data, setData] = useState<FormData>({
        f_name: '',
        l_name: '',
        phone: '',
        image: null,
    });
    const [error, setError] = useState<Partial<FormData>>({});
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (open && initialData) {
            setData({
                f_name: initialData.f_name || '',
                l_name: initialData.l_name || '',
                phone: initialData.phone || '',
                image: null,
            });
            setPreviewImage(initialData.profile || null);
            setError({});
        }
    }, [open, initialData]);

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setData((prev) => ({ ...prev, image: file }));

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const newErrors: Partial<FormData> = {};

        if (!data.f_name) newErrors.f_name = 'First name is required';
        if (!data.l_name) newErrors.l_name = 'Last name is required';

        setError(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        const formData = new FormData();
        formData.append('f_name', data.f_name);
        formData.append('l_name', data.l_name);
        if (data.phone) formData.append('phone', data.phone);
        if (data.image) formData.append('profile', data.image);

        try {
            await dispatch(updateProfile(formData)).unwrap();
            enqueueSnackbar('Profile updated successfully!', {
                variant: 'success',
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
            handleClose();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to update profile';

            enqueueSnackbar(errorMessage, {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' }
            });
        }
    };

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
                Edit Profile
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
                            label="First Name"
                            fullWidth
                            value={data.f_name}
                            onChange={(e) => setData({ ...data, f_name: e.target.value })}
                            error={!!error.f_name}
                            helperText={error.f_name}
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            value={data.l_name}
                            onChange={(e) => setData({ ...data, l_name: e.target.value })}
                            error={!!error.l_name}
                            helperText={error.l_name}
                        />
                        <TextField
                            label="Phone"
                            fullWidth
                            value={data.phone}
                            onChange={(e) => setData({ ...data, phone: e.target.value })}
                            error={!!error.phone}
                            helperText={error.phone}
                        />
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Profile Image
                            </Typography>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileInputChange}
                                style={{ display: 'none' }}
                                id="profile-image-input"
                            />
                            <label htmlFor="profile-image-input">
                                <Button
                                    variant="outlined"
                                    component="span"
                                >
                                    Choose File
                                </Button>
                            </label>
                            {previewImage && (
                                <Box mt={2}>
                                 
                                    <Image
                                        src={previewImage}
                                        alt="Preview"
                                        width={200}  
                                        height={100} 
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '200px',
                                            borderRadius: '4px'
                                        }}
                                    />

                                </Box>
                            )}
                        </Box>
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
                    Save Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfile;