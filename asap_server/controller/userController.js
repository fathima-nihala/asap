const catchAsyncError = require("../middleware/catchAsyncError");
const { deleteOldUserFile } = require("../middleware/editFiles");
const ErrorHandler = require("../middleware/errorHandler");
const User = require('../model/userModel');
const sendToken = require("../utils/sendToken");

exports.register = catchAsyncError(async (req, res, next) => {
    const { f_name, l_name, email, phone, password } = req.body;

    let profile;
    if (req.file) {
        const filename = req.file.filename;
        profile = `${process.env.BACKEND_URL}/upload/user/${filename}`;
    }

    if (!f_name || !l_name || !email || !password) {
        return next(new ErrorHandler('Please enter all required fields', 400));
    }

    try {
        const user = await User.create({
            f_name,
            l_name,
            email,
            phone,
            password,
            profile
        });

        res.status(201).json({
            success: true,
            message: "Registered Successfully!",
            user: {
                _id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return next(new ErrorHandler(messages.join(', '), 400));
        }
        next(error);
    }
});

exports.login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.isValidPassword(password))) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
});

exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
        .status(200)
        .json({
            success: true,
            message: "Logged out successfully!"
        });
});


exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const { f_name, l_name, email, phone } = req.body;

    let profile;
    if (req.file) {
        const filename = req.file.filename;
        profile = `${process.env.BACKEND_URL}/upload/user/${filename}`;
    }

    // Find the user in DB
    let user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Delete old profile picture if a new one is uploaded
    if (req.file && user.profile) {
        deleteOldUserFile(user.profile);
    }

    // Update user fields
    user.f_name = f_name || user.f_name;
    user.l_name = l_name || user.l_name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    if (profile) user.profile = profile;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
        user: {
            _id: user._id,
            f_name: user.f_name,
            l_name: user.l_name,
            email: user.email,
            phone: user.phone,
            profile: user.profile,
            updatedAt: user.updatedAt 

        }
    });
});