const WorkExperience = require('../model/workExpModel');
const ErrorHandler = require('../middleware/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');

// Add work experience
exports.addWorkExperience = catchAsyncError(async (req, res, next) => {
  const {
    title,
    company,
    startDate,
    endDate,
    isCurrent,
    location,
    description,
    projects
  } = req.body;

  // Create new work experience
  const workExperience = new WorkExperience({
    userId: req.user._id,  
    title,
    company,
    startDate,
    endDate: isCurrent ? null : endDate,
    isCurrent,
    location,
    description,
    projects
  });

  await workExperience.save();

  res.status(201).json({
    success: true,
    data: workExperience
  });
});

// Edit work experience
exports.editWorkExperience = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const workExperience = await WorkExperience.findOne({
    _id: id,
    userId: req.user._id
  });

  if (!workExperience) {
    return next(new ErrorHandler('Work experience not found or unauthorized', 404));
  }

  // Handle the "Present" case for end date
  if (updateData.isCurrent) {
    updateData.endDate = null;
  }

  // Update work experience
  const updatedWorkExperience = await WorkExperience.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: updatedWorkExperience
  });
});
