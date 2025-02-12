const CareerObjective = require('../model/careerModel');
const catchAsyncError = require("../middleware/catchAsyncError");

//get
exports.getCareerObjective = catchAsyncError(async (req, res) => {
    try {
        const careerObj = await CareerObjective.findOne({ userId: req.user.id });
        
        if (!careerObj) {
          const newCareerObj = await CareerObjective.create({
            userId: req.user.id
          });
          return res.status(200).json(newCareerObj);
        }
        
        res.status(200).json(careerObj);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching career objective', error: error.message });
      }
  });


//update
exports.updateCareerObjective = catchAsyncError(async (req, res) => {
    try {
        const { mainHeading, subHeading, description } = req.body;
        
        const updatedObj = await CareerObjective.findOneAndUpdate(
          { userId: req.user.id },
          {
            $set: {
              mainHeading,
              subHeading,
              description,
              updatedAt: Date.now()
            }
          },
          { new: true, upsert: true }
        );
  
        res.status(200).json(updatedObj);
      } catch (error) {
        res.status(500).json({ message: 'Error updating career objective', error: error.message });
      }
  });