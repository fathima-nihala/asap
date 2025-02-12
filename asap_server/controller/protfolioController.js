const Portfolio = require('../model/protfolioModel');
const ErrorHandler = require('../middleware/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');

exports.getPortfolio = catchAsyncError(async (req, res, next) => {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });
    
    if (!portfolio) {
        return next(new ErrorHandler('Portfolio not found', 404));
    }

    res.status(200).json({
        success: true,
        portfolio
    });
});

exports.updatePortfolio = catchAsyncError(async (req, res, next) => {
    const { github, behance, personalWebsite } = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
        { userId: req.user._id },
        { github, behance, personalWebsite },
        { 
            new: true, 
            runValidators: true, 
            upsert: true 
        }
    );

    res.status(200).json({
        success: true,
        portfolio
    });
});
