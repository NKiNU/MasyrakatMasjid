const organisation = require('../model/organisation');

const organisationController = {
  // Get all images
  getAllImages: async (req, res) => {
    try {
      const images = await organisation.find()
        .sort({ uploadedAt: -1 })
        .populate('uploadedBy', 'name email'); // If you want to include user details

        console.log("images for organization")
      res.status(200).json(images);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching images',
        error: error.message
      });
    }
  },

  // Get single image
  getImage: async (req, res) => {
    try {
      const image = await organisation.findById(req.params.id)
        .populate('uploadedBy', 'name email');

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      res.status(200).json({
        success: true,
        data: image
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching image',
        error: error.message
      });
    }
  },

  // Upload new image
  uploadImage: async (req, res) => {
    try {

      const newImage = new organisation({
        imageUrl: req.body.imageUrl,
        uploadedBy: req.user.id,
        uploadedAt: req.body.uploadedAt
      });

      const savedImage = await newImage.save();
      console.log("image saved: ", savedImage);

      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        data: savedImage
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error uploading image',
        error: error.message
      });
    }
  },

  // Update image details
  updateImage: async (req, res) => {
    try {
      // Check if user is admin or superadmin
      if (req.user.role !== 'admin' && req.user.role !== 'super admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update images'
        });
      }

      const image = await organisation.findById(req.params.id);

      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Image not found'
        });
      }

      const updatedImage = await organisation.findByIdAndUpdate(
        req.params.id,
        {
        //   title: req.body.title || image.title,
        //   description: req.body.description || image.description,
          imageUrl: req.body.imageUrl || image.imageUrl
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Image updated successfully',
        data: updatedImage
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error updating image',
        error: error.message
      });
    }
  },

  // Delete image
  deleteImage: async (req, res) => {
    try {
      // Check if user is admin or superadmin
      if (req.user.role !== 'admin' && req.user.role !== 'super admin') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete images'
        });
      }

      const image = await organisation.findByIdAndDelete(req.params.id);
      console.log(image)

      res.status(200).json({
        success: true,
        message: 'Image deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting image',
        error: error.message
      });
    }
  }
};

module.exports = organisationController;