import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Dialog, DialogContent, DialogTitle, IconButton, TextField,
    FormControl, FormLabel, RadioGroup, FormControlLabel, Radio,
    Button, Stack, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { updateBasicInfo } from '../../redux/features/basicInfoSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { BasicInfo, User } from '../../types/basictype';
import { useSnackbar } from 'notistack';

interface BasicEditProps {
    currentUser?: User | null ;
    currentBasicInfo?: BasicInfo | null;
    open: boolean;
    handleClose: () => void;
}

const BasicEdit: React.FC<BasicEditProps> = ({ open, handleClose, currentUser, currentBasicInfo }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.basicInfo);
    const { enqueueSnackbar } = useSnackbar();

    const [formData, setFormData] = useState<Partial<BasicInfo & User>>({
        f_name: '',
        l_name: '',
        phone: '',
        email: '',
        dob: '',
        gender: 'Male',
        aadhar: '',
        address: '',
        state: '',
        district: '',
        pincode: '',
        parent_name: '',
        parent_number: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (currentUser && currentBasicInfo) {
            setFormData({
                ...currentUser,
                ...currentBasicInfo,
                dob: new Date(currentBasicInfo.dob).toISOString().split('T')[0]
            });
        }
    }, [currentUser, currentBasicInfo]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.f_name) newErrors.f_name = 'First name is required';
        if (!formData.l_name) newErrors.l_name = 'Last name is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.dob) newErrors.dob = 'Date of birth is required';
        if (!formData.aadhar) newErrors.aadhar = 'Aadhar number is required';
        if (formData.aadhar && !/^\d{12}$/.test(formData.aadhar)) {
            newErrors.aadhar = 'Invalid Aadhar number';
        }
        if (!formData.pincode) newErrors.pincode = 'Pincode is required';
        if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Invalid pincode';
        }
        if (!formData.parent_number) newErrors.parent_number = 'Parent number is required';
        if (formData.parent_number && !/^\d{10}$/.test(formData.parent_number)) {
            newErrors.parent_number = 'Invalid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        const result = await dispatch(updateBasicInfo(formData));
        if (updateBasicInfo.fulfilled.match(result)) {
            enqueueSnackbar('Basic information updated successfully!', { variant: 'success' });
            handleClose();
        }
    };

    return (
        <Dialog open={open} maxWidth="md" fullWidth>
            <DialogTitle>
                Update Basic Information
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
                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={formData.f_name}
                                onChange={(e) => setFormData({ ...formData, f_name: e.target.value })}
                                error={!!errors.f_name}
                                helperText={errors.f_name}
                            />
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={formData.l_name}
                                onChange={(e) => setFormData({ ...formData, l_name: e.target.value })}
                                error={!!errors.l_name}
                                helperText={errors.l_name}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                error={!!errors.phone}
                                helperText={errors.phone}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Date of Birth"
                                InputLabelProps={{ shrink: true }}
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                error={!!errors.dob}
                                helperText={errors.dob}
                            />
                            <FormControl fullWidth>
                                <FormLabel>Gender</FormLabel>
                                <RadioGroup
                                    row
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as BasicInfo['gender'] })}
                                >
                                    <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="Non-Binary" control={<Radio />} label="Non-Binary" />
                                </RadioGroup>
                            </FormControl>
                        </Stack>

                        <TextField
                            fullWidth
                            label="Aadhar Number"
                            value={formData.aadhar}
                            onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                            error={!!errors.aadhar}
                            helperText={errors.aadhar}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />

                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                label="State"
                                value={formData.state}
                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="District"
                                value={formData.district}
                                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Pincode"
                                value={formData.pincode}
                                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                error={!!errors.pincode}
                                helperText={errors.pincode}
                            />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <TextField
                                fullWidth
                                label="Parent/Guardian Name"
                                value={formData.parent_name}
                                onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Parent/Guardian Number"
                                value={formData.parent_number}
                                onChange={(e) => setFormData({ ...formData, parent_number: e.target.value })}
                                error={!!errors.parent_number}
                                helperText={errors.parent_number}
                            />
                        </Stack>

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

export default BasicEdit;