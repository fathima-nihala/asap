'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button, Box, TextField, Divider, Typography, Stack, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from 'notistack';
import { User } from '../../types/basictype';

interface BasicEditProps {
    initialData?: User | null;
    open: boolean;
    handleClose: () => void;
}

const BasicEdit: React.FC<BasicEditProps> = ({ open, handleClose, initialData }) => {
    const [data, setData] = useState({
        f_name: '',
        l_name: '',
        dob: '',
        gender: '',
        phone: '',
        email: '',
        aadhar: '',
        address: '',
        state: '',
        district: '',
        pincode: '',
        guardian_name: '',
        guardian_phone: '',
    });
    const [error, setError] = useState<Record<string, string>>({});
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (open && initialData) {
            setData({
                f_name: initialData.f_name || '',
                l_name: initialData.l_name || '',
                dob: initialData.dob || '',
                gender: initialData.gender || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                aadhar: initialData.aadhar || '',
                address: initialData.address || '',
                state: initialData.state || '',
                district: initialData.district || '',
                pincode: initialData.pincode || '',
                guardian_name: initialData.guardian_name || '',
                guardian_phone: initialData.guardian_phone || '',
            });
            setError({});
        }
    }, [open, initialData]);

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};
        if (!data.f_name) newErrors.f_name = 'First name is required';
        if (!data.l_name) newErrors.l_name = 'Last name is required';
        if (!data.phone) newErrors.phone = 'Phone number is required';
        if (!data.email) newErrors.email = 'Email is required';
        setError(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        enqueueSnackbar('Profile updated successfully!', { variant: 'success' });
        handleClose();
    };

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
                Basic Information
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
                    <Stack spacing={2}>
                        <TextField label="First Name" fullWidth value={data.f_name} onChange={(e) => setData({ ...data, f_name: e.target.value })} error={!!error.f_name} helperText={error.f_name} />
                        <TextField label="Last Name" fullWidth value={data.l_name} onChange={(e) => setData({ ...data, l_name: e.target.value })} error={!!error.l_name} helperText={error.l_name} />
                        <TextField label="Date of Birth" type="date" fullWidth InputLabelProps={{ shrink: true }} value={data.dob} onChange={(e) => setData({ ...data, dob: e.target.value })} />
                        <FormControl>
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup row value={data.gender} onChange={(e) => setData({ ...data, gender: e.target.value })}>
                                <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                <FormControlLabel value="Non-Binary" control={<Radio />} label="Non-Binary" />
                            </RadioGroup>
                        </FormControl>
                        <TextField label="Mobile" fullWidth value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} error={!!error.phone} helperText={error.phone} />
                        <TextField label="Email" fullWidth value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} error={!!error.email} helperText={error.email} />
                        <TextField label="Aadhar" fullWidth value={data.aadhar} onChange={(e) => setData({ ...data, aadhar: e.target.value })} />
                        <TextField label="Address" fullWidth value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
                        <Stack direction="row" spacing={2}>
                            <TextField label="State" fullWidth value={data.state} onChange={(e) => setData({ ...data, state: e.target.value })} />
                            <TextField label="District" fullWidth value={data.district} onChange={(e) => setData({ ...data, district: e.target.value })} />
                            <TextField label="Pincode" fullWidth value={data.pincode} onChange={(e) => setData({ ...data, pincode: e.target.value })} />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <TextField label="Parent / Guardian Name" fullWidth value={data.guardian_name} onChange={(e) => setData({ ...data, guardian_name: e.target.value })} />
                            <TextField label="Parent / Guardian Number" fullWidth value={data.guardian_phone} onChange={(e) => setData({ ...data, guardian_phone: e.target.value })} />
                        </Stack>
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>Save Changes</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BasicEdit;
