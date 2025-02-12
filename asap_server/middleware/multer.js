
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'upload', 'user'));
  },
  filename: function (req, file, cb) {
    let name = file.originalname.replace(/\s\s+/g, ' ');
    name = name.replace(/[&\/\\#, +()$~%'":=*?<>{}@-]/g, '_');
    cb(null, Date.now() + "_" + name)
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/svg+xml',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'image/avif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20 // 20MB file size limit
  },
  fileFilter: fileFilter
});

const flexibleUpload = (fields) => {
  return (req, res, next) => {
    const uploadFields = upload.fields(fields);
    uploadFields(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next();
        }
        return handleMulterErrors(err, req, res, next);
      } else if (err) {
        return handleMulterErrors(err, req, res, next);
      }

      // Process images using Sharp
      if (req.files) {
        let totalOriginalSize = 0;
        let totalProcessedSize = 0;

        await Promise.all(
          Object.keys(req.files).map(async (key) => {
            await Promise.all(
              req.files[key].map(async (file) => {
                try {
                  const originalSize = fs.statSync(file.path).size;
                  totalOriginalSize += originalSize;

                  const outputFilePath = path.join('./upload/', 'resized-' + file.filename);

                  // Resize the image
                  await sharp(file.path)
                    .resize(800, 800, {
                      fit: sharp.fit.inside,
                      withoutEnlargement: true
                    })
                    .toFormat('png')
                    .png({ quality: 80 })
                    .toFile(outputFilePath);

                  const processedSize = fs.statSync(outputFilePath).size;
                  totalProcessedSize += processedSize;

                  // Log individual file size reduction
                  const reduction = originalSize - processedSize;
                  const percentReduction = ((reduction / originalSize) * 100).toFixed(2);
                  console.log(`File: ${file.filename}`);
                  console.log(`  Original size: ${formatBytes(originalSize)}`);
                  console.log(`  Processed size: ${formatBytes(processedSize)}`);
                  console.log(`  Reduction: ${formatBytes(reduction)} (${percentReduction}%)`);

                  // Store the original path before updating the file path to resized image
                  const originalFilePath = file.path;

                  // Update file path to point to the resized image
                  file.path = outputFilePath;
                  file.filename = 'resized-' + file.filename;

                  // Delete the original file
                  fs.unlinkSync(originalFilePath); // Use originalFilePath to delete original file

                } catch (error) {
                  console.error(`Error processing file ${file.filename}:`, error);
                }
              })
            );
          })
        );

        // Log total size reduction
        const totalReduction = totalOriginalSize - totalProcessedSize;
        const totalPercentReduction = ((totalReduction / totalOriginalSize) * 100).toFixed(2);
        console.log('\nTotal size reduction:');
        console.log(`  Original total: ${formatBytes(totalOriginalSize)}`);
        console.log(`  Processed total: ${formatBytes(totalProcessedSize)}`);
        console.log(`  Total reduction: ${formatBytes(totalReduction)} (${totalPercentReduction}%)`);

        // Add size reduction info to the request object
        req.sizeReduction = {
          originalSize: totalOriginalSize,
          processedSize: totalProcessedSize,
          reduction: totalReduction,
          percentReduction: totalPercentReduction
        };
      }

      next();
    });
  };
};

// Helper function to format bytes to a human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size exceeds the limit' });
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: `Unexpected field: ${err.field}` });
    } else {
      return res.status(500).json({ error: `Multer error: ${err.message}` });
    }
  } else if (err) {
    return res.status(500).json({ error: err.message });
  }
  next();
};

// Code for Resume
const resumeStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/resume/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0].replaceAll(" ", "_").slice(0, 10) + Date.now() + path.extname(file.originalname));
  }
});

const resumeUpload = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 1024 * 1024 * 5  // 5MB file size limit for resumes
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF and Word files are allowed.'), false);
    }
  }
});

// Code for Video
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload/videos/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.split(".")[0].replaceAll(" ", "_").slice(0, 10) + Date.now() + path.extname(file.originalname));
  }
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 1024 * 1024 * 100  // 100MB file size limit for videos
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'video/mp4',
      'video/mpeg',
      'video/quicktime',
      'video/avi',
      'video/webm'
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'), false);
    }
  }
});



module.exports = { upload, flexibleUpload, handleMulterErrors, resumeUpload, videoUpload };
