const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/errorHandler");
const BasicInfo = require("../model/basicInfoModel");
const User = require("../model/userModel");

// Create or Update Basic Information
exports.updateBasicInfo = catchAsyncError(async (req, res, next) => {
    const {
        dob,
        gender,
        aadhar,
        address,
        state,
        district,
        pincode,
        parent_name,
        parent_number
    } = req.body;

    // Get logged in user
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Format the data
    const basicInfoData = {
        user: user._id,
        dob,
        gender,
        aadhar,
        address,
        state,
        district,
        pincode,
        parent_name,
        parent_number
    };

    try {
        // Find existing basic info or create new one
        let basicInfo = await BasicInfo.findOne({ user: user._id });

        if (basicInfo) {
            // Update existing record
            basicInfo = await BasicInfo.findOneAndUpdate(
                { user: user._id },
                basicInfoData,
                {
                    new: true,
                    runValidators: true
                }
            );
        } else {
            // Create new record
            basicInfo = await BasicInfo.create(basicInfoData);
        }

        res.status(200).json({
            success: true,
            message: "Basic information updated successfully!",
            data: {
                user: {
                    f_name: user.f_name,
                    l_name: user.l_name,
                    phone: user.phone,
                    email: user.email
                },
                basicInfo
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

// Get Basic Information
exports.getBasicInfo = catchAsyncError(async (req, res, next) => {
    const basicInfo = await BasicInfo.findOne({ user: req.user.id });
    const user = await User.findById(req.user.id);

    if (!basicInfo) {
        return res.status(200).json({
            success: true,
            data: {
                user: {
                    f_name: user.f_name,
                    l_name: user.l_name,
                    phone: user.phone,
                    email: user.email
                },
                basicInfo: null
            }
        });
    }

    res.status(200).json({
        success: true,
        data: {
            user: {
                f_name: user.f_name,
                l_name: user.l_name,
                phone: user.phone,
                email: user.email
            },
            basicInfo
        }
    });
});