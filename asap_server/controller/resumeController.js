const Resume = require('../model/resumeModel');
const VideoResume = require('../model/videoResumeModel');
const createError = require('http-errors');
const fs = require('fs').promises;
const path = require('path');
const catchAsyncError = require('../middleware/catchAsyncError');

// Get all resumes for logged in user
exports.getUserResumes = catchAsyncError(async (req, res) => {
  const [resumes, videoResumes] = await Promise.all([
    Resume.find({ userId: req.user.id }).sort({ uploadedAt: -1 }),
    VideoResume.find({ userId: req.user.id }).sort({ uploadedAt: -1 })
  ]);

  const documentResumes = resumes.map(resume => ({
    ...resume.toObject(),
    downloadUrl: `/api/resumes/download/document/${resume._id}`
  }));

  const videoResumesMapped = videoResumes.map(video => ({
    ...video.toObject(),
    downloadUrl: `/api/resumes/download/video/${video._id}`
  }));

  res.status(200).json({
    success: true,
    data: {
      documents: documentResumes,
      videos: videoResumesMapped
    }
  });
});

// Upload document resume
exports.uploadResume = catchAsyncError(async (req, res) => {
  const { file } = req;
  if (!file) {
    throw createError(400, 'No file provided');
  }

  const resume = new Resume({
    userId: req.user.id,
    fileName: file.originalname,
    fileType: path.extname(file.originalname).slice(1),
    fileSize: file.size,
    filePath: file.path
  });

  await resume.save();

  res.status(201).json({
    success: true,
    data: {
      ...resume.toObject(),
      downloadUrl: `/api/resumes/download/document/${resume._id}`
    }
  });
});

// Upload video resume
exports.uploadVideoResume = catchAsyncError(async (req, res) => {
  const { file } = req;
  if (!file) {
    throw createError(400, 'No file provided');
  }

  const videoResume = new VideoResume({
    userId: req.user.id,
    fileName: file.originalname,
    fileType: path.extname(file.originalname).slice(1),
    fileSize: file.size,
    filePath: file.path,
    duration: 0  // You can implement video duration detection if needed
  });

  await videoResume.save();

  res.status(201).json({
    success: true,
    data: {
      ...videoResume.toObject(),
      downloadUrl: `/api/resumes/download/video/${videoResume._id}`
    }
  });
});

// Download resume
exports.downloadResume = catchAsyncError(async (req, res) => {
    const { type, id } = req.params;
    const Model = type === 'video' ? VideoResume : Resume;
  
    const file = await Model.findOne({
      _id: id,
      userId: req.user.id
    });
  
    if (!file) {
      throw createError(404, 'File not found');
    }
  
    try {
      await fs.access(file.filePath);
      
      const contentType = type === 'video' ? 'video/mp4' : 'application/pdf';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
      
      const fileStream = require('fs').createReadStream(file.filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Download error:', error);
      throw createError(404, 'File not found on server');
    }
  });


// Update resume
exports.updateResume = catchAsyncError(async (req, res) => {
  const { id } = req.params;
  const { file } = req;

  if (!file) {
    throw createError(400, 'No file provided');
  }

  const resume = await Resume.findOne({
    _id: id,
    userId: req.user.id
  });

  if (!resume) {
    throw createError(404, 'Resume not found');
  }

  await fs.unlink(resume.filePath);

  resume.fileName = file.originalname;
  resume.fileType = path.extname(file.originalname).slice(1);
  resume.fileSize = file.size;
  resume.filePath = file.path;
  resume.lastUpdated = Date.now();

  await resume.save();

  res.json({
    success: true,
    data: {
      ...resume.toObject(),
      downloadUrl: `/api/resumes/download/document/${resume._id}`
    }
  });
});


// Delete document resume
exports.deleteDocumentResume = catchAsyncError(async (req, res) => {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
  
    if (!resume) {
      throw createError(404, 'Resume not found');
    }
  
    try {
      await fs.unlink(resume.filePath);
    } catch (error) {
      console.error('File delete error:', error);
      // Continue with database deletion even if file doesn't exist
    }
  
    await resume.deleteOne();
  
    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  });
  
  // Delete video resume
  exports.deleteVideoResume = catchAsyncError(async (req, res) => {
    const video = await VideoResume.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
  
    if (!video) {
      throw createError(404, 'Video resume not found');
    }
  
    try {
      await fs.unlink(video.filePath);
    } catch (error) {
      console.error('File delete error:', error);
      // Continue with database deletion even if file doesn't exist
    }
  
    await video.deleteOne();
  
    res.json({
      success: true,
      message: 'Video resume deleted successfully'
    });
  });
  