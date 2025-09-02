const Feedback = require('../model/feedback');

// Create feedback
exports.createFeedback = async (req, res) => {
  try {
    const { message, imageUrl } = req.body;
    const userId = req.user.id; // From auth middleware
    console.log("message ",message);
    console.log("image Url: ",imageUrl);
    console.log(userId);

    const feedback = await Feedback.create({
      userId,
      message,
      imageUrl,
    });

    res.status(201).json({
      status: 'success',
      data: { feedback },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'email name')
      .sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: feedbacks.length,
      data: { feedbacks },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate(
      'userId',
      'email name'
    );

    if (!feedback) {
      return res.status(404).json({
        status: 'fail',
        message: 'No feedback found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { feedback },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Update feedback status
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({
        status: 'fail',
        message: 'No feedback found with that ID',
      });
    }

    res.status(200).json({
      status: 'success',
      data: { feedback },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        status: 'fail',
        message: 'No feedback found with that ID',
      });
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
