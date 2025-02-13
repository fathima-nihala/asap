const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../middleware/errorHandler");
const BasicInfo = require("../model/basicInfoModel");
const User = require("../model/userModel");
const mongoose = require("mongoose");


// Create or Update Basic Information
// exports.updateBasicInfo = catchAsyncError(async (req, res, next) => {
//     const {
//         dob,
//         gender,
//         aadhar,
//         address,
//         state,
//         district,
//         pincode,
//         parent_name,
//         parent_number,
//     } = req.body;

//     // Get logged in user
//     const user = await User.findById(req.user.id);
//     if (!user) {
//         return next(new ErrorHandler('User not found', 404));
//     }

//     // Format the data
//     const basicInfoData = {
//         user: user._id,
//         dob,
//         gender,
//         aadhar,
//         address,
//         state,
//         district,
//         pincode,
//         parent_name,
//         parent_number
//     };

//     try {
//         // Find existing basic info or create new one
//         let basicInfo = await BasicInfo.findOne({ user: user._id });

//         if (basicInfo) {
//             // Update existing record
//             basicInfo = await BasicInfo.findOneAndUpdate(
//                 { user: user._id },
//                 basicInfoData,
//                 {
//                     new: true,
//                     runValidators: true
//                 }
//             );
//         } else {
//             // Create new record
//             basicInfo = await BasicInfo.create(basicInfoData);
//         }

//         res.status(200).json({
//             success: true,
//             message: "Basic information updated successfully!",
//             data: {
//                 user: {
//                     f_name: user.f_name,
//                     l_name: user.l_name,
//                     phone: user.phone,
//                     email: user.email
//                 },
//                 basicInfo
//             }
//         });
//     } catch (error) {
//         if (error.name === 'ValidationError') {
//             const messages = Object.values(error.errors).map(val => val.message);
//             return next(new ErrorHandler(messages.join(', '), 400));
//         }
//         next(error);
//     }
// });

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
        parent_number,
        // Add these fields to be used for user update
        f_name,
        l_name,
        phone,
        email
    } = req.body;

    // Get logged in user
    const user = await User.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    // Format the data for BasicInfo
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
        // Start a session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update user information if provided
            if (f_name || l_name || phone || email) {
                const userUpdateData = {};
                if (f_name) userUpdateData.f_name = f_name;
                if (l_name) userUpdateData.l_name = l_name;
                if (phone) userUpdateData.phone = phone;
                if (email) userUpdateData.email = email;

                // Update user document
                await User.findByIdAndUpdate(
                    user._id,
                    userUpdateData,
                    {
                        new: true,
                        runValidators: true,
                        session
                    }
                );
            }

            // Find existing basic info or create new one
            let basicInfo = await BasicInfo.findOne({ user: user._id }).session(session);

            if (basicInfo) {
                // Update existing record
                basicInfo = await BasicInfo.findOneAndUpdate(
                    { user: user._id },
                    basicInfoData,
                    {
                        new: true,
                        runValidators: true,
                        session
                    }
                );
            } else {
                // Create new record
                basicInfo = await BasicInfo.create([basicInfoData], { session });
                basicInfo = basicInfo[0]; 
            }

            // Commit the transaction
            await session.commitTransaction();

            // Get the updated user data
            const updatedUser = await User.findById(user._id);

            res.status(200).json({
                success: true,
                message: "Information updated successfully!",
                data: {
                    user: {
                        f_name: updatedUser.f_name,
                        l_name: updatedUser.l_name,
                        phone: updatedUser.phone,
                        email: updatedUser.email
                    },
                    basicInfo
                }
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
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