const KeySkills = require('../model/skillModel');
const catchAsyncError = require('../middleware/catchAsyncError');

// Get all skills for logged in user
exports.getSkills = catchAsyncError(async (req, res) => {
  try {
    let userSkills = await KeySkills.findOne({ userId: req.user.id });

    if (!userSkills) {
      userSkills = await KeySkills.create({
        userId: req.user.id,
        skills: []
      });
    }

    res.status(200).json(userSkills.skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching skills', error: error.message });
  }
});

// Add a new skill
exports.addSkill = catchAsyncError(async (req, res) => {
  try {
    const { skillName } = req.body;

    if (!skillName) {
      return res.status(400).json({ message: 'Skill name is required' });
    }

    const result = await KeySkills.findOneAndUpdate(
      { userId: req.user.id },
      {
        $push: { skills: { name: skillName } },
        $set: { updatedAt: Date.now() }
      },
      { new: true, upsert: true }
    );

    res.status(200).json(result.skills);
  } catch (error) {
    res.status(500).json({ message: 'Error adding skill', error: error.message });
  }
});

// Remove a skill
exports.removeSkill = catchAsyncError(async (req, res) => {
  try {
    const { id } = req.params;

    const result = await KeySkills.findOneAndUpdate(
      { userId: req.user.id },
      {
        $pull: { skills: { _id: id } },
        $set: { updatedAt: Date.now() }
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.status(200).json(result.skills);
  } catch (error) {
    res.status(500).json({ message: 'Error removing skill', error: error.message });
  }
});


// Update all skills at once
exports.updateSkills = catchAsyncError(async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    const result = await KeySkills.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          skills: skills.map(skill => ({
            name: skill,
            addedAt: Date.now()
          })),
          updatedAt: Date.now()
        }
      },
      { new: true, upsert: true }
    );

    res.status(200).json(result.skills);
  } catch (error) {
    res.status(500).json({ message: 'Error updating skills', error: error.message });
  }
});
