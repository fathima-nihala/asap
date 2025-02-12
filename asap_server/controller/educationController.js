const Education = require("../model/educationModel");
const catchAsyncError = require("../middleware/catchAsyncError");

// Add Education
exports.educationAdd = catchAsyncError(async (req, res, next) => {
    const { degree, institution, location, startYear, endYear } = req.body;

    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "User authentication failed" });
    }

    if (!degree || !institution || !location || !startYear || !endYear) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const newEducation = await Education.create({ 
            userId: req.user.id, 
            degree, 
            institution, 
            location, 
            startYear, 
            endYear 
        });

        res.status(201).json({ 
            success: true, 
            message: "Education added successfully", 
            education: newEducation 
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return next(new ErrorHandler(messages.join(', '), 400));
        }
        next(error);
    }
});

// Edit Education
exports.educationEdit = catchAsyncError(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "User authentication failed" });
    }

    const { degree, institution, location, startYear, endYear } = req.body;
    const education = await Education.findById(req.params.id);

    if (!education) {
        return res.status(404).json({ success: false, message: "Education not found" });
    }

    // Ensure user owns the education entry
    if (education.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    education.degree = degree || education.degree;
    education.institution = institution || education.institution;
    education.location = location || education.location;
    education.startYear = startYear || education.startYear;
    education.endYear = endYear || education.endYear;

    await education.save();

    res.status(200).json({ 
        success: true, 
        message: "Education updated successfully", 
        education 
    });
});


// Get All Education Entries for a User
exports.getEducationByUser = catchAsyncError(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "User authentication failed" });
    }

    const educationList = await Education.find({ userId: req.user.id });

    if (!educationList.length) {
        return res.status(404).json({ success: false, message: "No education records found" });
    }

    res.status(200).json({ success: true, education: educationList });
});


// Delete Education
exports.educationDelete = catchAsyncError(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ success: false, message: "User authentication failed" });
    }

    const education = await Education.findById(req.params.id);

    if (!education) {
        return res.status(404).json({ success: false, message: "Education not found" });
    }

    // Ensure user owns the education entry
    if (education.userId.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    await Education.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Education deleted successfully" });
});
