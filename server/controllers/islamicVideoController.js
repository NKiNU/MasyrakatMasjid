const IslamicVideo = require('../model/islamicvideo');
const mongoose = require('mongoose');

// Validation helper functions
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const validateVideoInput = (data) => {
  const errors = [];
  
  // Required field validation
  const requiredFields = ['title', 'description', 'category', 'speaker', 'videoUrl', 'thumbnailUrl'];
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && !data[field].trim())) {
      errors.push(`${field} is required`);
    }
  });

  // Category validation
  const validCategories = ['lecture', 'quran', 'nasheed', 'documentary', 'tutorial'];
  if (data.category && !validCategories.includes(data.category)) {
    errors.push(`category must be one of: ${validCategories.join(', ')}`);
  }

  // URL validation
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  if (data.videoUrl && !urlRegex.test(data.videoUrl)) {
    errors.push('videoUrl must be a valid URL');
  }
  if (data.thumbnailUrl && !urlRegex.test(data.thumbnailUrl)) {
    errors.push('thumbnailUrl must be a valid URL');
  }

  // String length validation
  if (data.title && data.title.length > 200) {
    errors.push('title must not exceed 200 characters');
  }
  if (data.description && data.description.length > 2000) {
    errors.push('description must not exceed 2000 characters');
  }
  if (data.speaker && data.speaker.length > 100) {
    errors.push('speaker name must not exceed 100 characters');
  }

  return errors;
};

const islamicVideoController = {
  createVideo: async (req, res) => {
    try {
        const { title, description, category, speaker, videoUrl, thumbnailUrl,
             } = req.body;

             const newVideo = new IslamicVideo({
                title, description, category, speaker, videoUrl, thumbnailUrl,
             })

    //   const video = new IslamicVideo(req.body);
      console.log(newVideo)
      await newVideo.save();
      res.status(201).json(newVideo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getAllVideos: async (req, res) => {
    try {
      const videos = await IslamicVideo.find()
        .sort({ uploadDate: -1 });
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getVideo: async (req, res) => {
    try {
      if (!validateObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid video ID format' });
      }

      const video = await IslamicVideo.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      video.views += 1;
      await video.save();
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateVideo: async (req, res) => {
    try {
      if (!validateObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid video ID format' });
      }

      // Validate update fields
      const updateFields = Object.keys(req.body);
      const allowedUpdates = ['title', 'description', 'category', 'speaker'];
      const isValidUpdate = updateFields.every(field => allowedUpdates.includes(field));

      if (!isValidUpdate) {
        return res.status(400).json({ 
          message: 'Invalid updates', 
          allowedFields: allowedUpdates 
        });
      }

      const validationErrors = validateVideoInput(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({ 
          message: 'Validation failed', 
          errors: validationErrors 
        });
      }

      const video = await IslamicVideo.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      allowedUpdates.forEach(update => {
        if (req.body[update] !== undefined) {
          video[update] = req.body[update];
        }
      });

      await video.save();
      res.json(video);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteVideo: async (req, res) => {
    try {
      if (!validateObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid video ID format' });
      }

      const video = await IslamicVideo.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      await video.deleteOne();
      res.json({ message: 'Video deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getVideosByCategory: async (req, res) => {
    try {
      const validCategories = ['lecture', 'quran', 'nasheed', 'documentary', 'tutorial'];
      if (!validCategories.includes(req.params.category)) {
        return res.status(400).json({ 
          message: 'Invalid category', 
          validCategories 
        });
      }

      const videos = await IslamicVideo.find({ 
        category: req.params.category 
      }).sort({ uploadDate: -1 });
      
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  searchVideos: async (req, res) => {
    try {
      const searchQuery = req.query.q;
      if (!searchQuery || searchQuery.trim().length < 2) {
        return res.status(400).json({ 
          message: 'Search query must be at least 2 characters long' 
        });
      }

      const videos = await IslamicVideo.find({
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { speaker: { $regex: searchQuery, $options: 'i' } },
          { tags: { $regex: searchQuery, $options: 'i' } }
        ]
      }).sort({ uploadDate: -1 });

      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  toggleLike: async (req, res) => {
    try {
      if (!validateObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid video ID format' });
      }

      const video = await IslamicVideo.findById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }

      video.likes += 1;
      await video.save();
      res.json({ likes: video.likes });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getMostPopularVideos: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      if (limit < 1 || limit > 50) {
        return res.status(400).json({ 
          message: 'Limit must be between 1 and 50' 
        });
      }

      const videos = await IslamicVideo.find()
        .sort({ views: -1, likes: -1 })
        .limit(limit);
      
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

getRecentVideos: async (req, res) => {
  try {
    console.log("query ",req.query)
    const limit = parseInt(req.query.limit) || 10;
    if (isNaN(limit) || limit < 1 || limit > 50) {
      return res.status(400).json({ 
        message: 'Limit must be a valid number between 1 and 50' 
      });
    }

    const videos = await IslamicVideo.find()
      .sort({ uploadDate: -1 })
      .limit(limit);
    
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
},

};

module.exports = islamicVideoController;