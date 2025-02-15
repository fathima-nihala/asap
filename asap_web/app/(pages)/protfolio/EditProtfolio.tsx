'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog, DialogContent, DialogTitle, IconButton, TextField,
    Button, Stack, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updatePortfolio } from '../../redux/features/protfolioSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { UpdatePortfolioRequest } from '../../types/protfolio.tyes';
import { useSnackbar } from 'notistack';

interface EditPortfolioProps {
    open: boolean;
    handleClose: () => void;
}

const EditPortfolio: React.FC<EditPortfolioProps> = ({ open, handleClose }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading } = useSelector((state: RootState) => state.portfolio);
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState<UpdatePortfolioRequest>({
        github: '',
        behance: '',
        personalWebsite: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (data) {
            setFormData({
                github: data.github || '',
                behance: data.behance || '',
                personalWebsite: data.personalWebsite || ''
            });
        }
    }, [data]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

        if (formData.github && !urlPattern.test(formData.github)) {
            newErrors.github = 'Invalid URL format';
        }
        if (formData.behance && !urlPattern.test(formData.behance)) {
            newErrors.behance = 'Invalid URL format';
        }
        if (formData.personalWebsite && !urlPattern.test(formData.personalWebsite)) {
            newErrors.personalWebsite = 'Invalid URL format';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            await dispatch(updatePortfolio(formData)).unwrap();
            enqueueSnackbar('Portfolio updated successfully!', { variant: 'success' });
            handleClose();
        } catch (error) {
            enqueueSnackbar(error as string, { variant: 'error' });
        }
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle>
                Update Portfolio Links
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box component="form" noValidate sx={{ mt: 2 }}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="GitHub Profile"
                            value={formData.github}
                            onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                            error={!!errors.github}
                            helperText={errors.github}
                            placeholder="https://github.com/username"
                        />

                        <TextField
                            fullWidth
                            label="Behance Profile"
                            value={formData.behance}
                            onChange={(e) => setFormData({ ...formData, behance: e.target.value })}
                            error={!!errors.behance}
                            helperText={errors.behance}
                            placeholder="https://www.behance.net/username"
                        />

                        <TextField
                            fullWidth
                            label="Personal Website"
                            value={formData.personalWebsite}
                            onChange={(e) => setFormData({ ...formData, personalWebsite: e.target.value })}
                            error={!!errors.personalWebsite}
                            helperText={errors.personalWebsite}
                            placeholder="https://www.yourwebsite.com"
                        />

                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default EditPortfolio;