const Class = require('../model/class');
const Event = require('../model/event');
const {createClassCapacityNotification,createClassEnrollmentNotification} = require('../middleware/notification')

const classController = {
  // Create a new class
  createClass: async (req, res) => {
    try {
      const { className, description, venue, venueDetails, isPaid, price, images,        startDate,    // Add these
        startTime,capacity      // new fields
         } = req.body;
      
      const newClass = new Class({
        className,
        description,
        venue,
        venueDetails, // Add this field
        startDate,    // Add these
        startTime,
        capacity,    // new fields
        isPaid,
        price: isPaid ? price : 0,
        images,
        participants: [],
        createdBy: req.user.id
      });

      await newClass.save();
      res.status(201).json({ 
        success: true,
        message: 'Class created successfully', 
        class: newClass 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  },

  // Update getAllClasses to include venueDetails in filtering if needed
  getAllClasses: async (req, res) => {
    try {
      const { venue, isPaid, search,startDate } = req.query;
      let query = {};

      // Add filters if they exist
      if (venue) query.venue = venue;
      if (isPaid !== undefined) query.isPaid = isPaid === 'true';
      if (startDate) {
        // Filter classes starting from the given date
        query.startDate = { $gte: new Date(startDate) };
      }
      if (search) {
        query.$or = [
          { className: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { venueDetails: { $regex: search, $options: 'i' } } // Add search in venueDetails
        ];
      }

      const classes = await Class.find(query)
        // .populate('createdBy', 'name email')
        .populate('participants', 'name email')
        .sort({ createdAt: -1 });

        console.log("get classes: ",classes)

      res.status(200).json({
        success: true,
        count: classes.length,
        classes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get a single class by ID
  getClassById: async (req, res) => {
    try {
      const classDoc = await Class.findById(req.params.classId)
        // .populate('createdBy', 'name email')
        .populate('participants', 'username email profileImage createdAt');

      if (!classDoc) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      res.status(200).json({
        success: true,
        class: classDoc
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Update updateClass to include venueDetails
  updateClass: async (req, res) => {
    try {
      const { className, description, venue, venueDetails, isPaid, price, images, startDate, startTime, capacity } = req.body;
      const classId = req.params.classId;

      // First, check if the class exists
      const classDoc = await Class.findById(classId);
      if (!classDoc) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Check if user exists in the request
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
      }

      // Check if user is the creator - using strict equality comparison
      if (classDoc.createdBy && classDoc.createdBy.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this class'
        });
      }

      // Prepare update data
      const updateData = {
        className,
        description,
        venue,
        venueDetails,
        startDate,
        startTime,
        capacity,
        isPaid,
        price: isPaid ? price : 0,
        images,
        updatedAt: Date.now()
      };

      // Update the class
      const updatedClass = await Class.findByIdAndUpdate(
        classId,
        updateData,
        { new: true, runValidators: true }
      ).populate('participants', 'name email');

      res.status(200).json({
        success: true,
        message: 'Class updated successfully',
        class: updatedClass
      });
    } catch (error) {
      console.error('Update class error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error updating class'
      });
    }
  },

  // Delete a class
  deleteClass: async (req, res) => {
    try {
      const classDoc = await Class.findById(req.params.classId);
      
      if (!classDoc) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Check if user is the creator
      if (classDoc.createdBy.toString() !== req.user.id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this class'
        });
      }

      await Class.findByIdAndDelete(req.params.classId);

      res.status(200).json({
        success: true,
        message: 'Class deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Join a class
  joinClass: async (req, res) => {
    try {
      const { classId } = req.params;
      const userId = req.user.id;

      const classDoc = await Class.findById(classId);
      if (!classDoc) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }
            // Check if class is full
            if (classDoc.participants.length >= classDoc.capacity) {
                return res.status(400).json({
                  success: false,
                  message: 'Class is already full'
                });
              }

      // Check if user is already a participant
      if (classDoc.participants.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Already joined this class'
        });
      }

      classDoc.participants.push(userId);
      await classDoc.save();

      // Create calendar event
      const endDateTime = new Date(classDoc.startDate);
      endDateTime.setHours(endDateTime.getHours() + 2); // Default 2-hour duration

      console.log("this is class information",{
        name: classDoc.className,
        description: classDoc.description,
        eventType: 'class',
        startDate: classDoc.startDate,
        endDate: endDateTime,
        createdBy: userId,
        source: 'class',
        sourceId: classId
      })
      const event = await Event.create({
        name: classDoc.className,
        description: classDoc.description,
        eventType: 'class',
        startDate: classDoc.startDate,
        endDate: endDateTime,
        createdBy: userId,
        // sourceId: classId
      });
      console.log("has event correct?",event)

      await createClassEnrollmentNotification(classDoc, req.user, false);
      // await createClassCapacityNotification(classDoc);


      const updatedClass = await Class.findById(classId)
        .populate('participants', 'name email');

      res.status(200).json({
        success: true,
        message: 'Successfully joined the class',
        class: updatedClass
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Leave a class
  leaveClass: async (req, res) => {
    try {
      const { classId } = req.params;
      const userId = req.user.id;

      const classDoc = await Class.findById(classId);
      if (!classDoc) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Check if user is a participant
      if (!classDoc.participants.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: 'Not enrolled in this class'
        });
      }

      classDoc.participants = classDoc.participants.filter(
        participant => participant.toString() !== userId.toString()
      );
      await classDoc.save();

      // Remove the associated calendar event
      await Event.findOneAndDelete({
        createdBy: userId,
        eventType: 'class',
        name:classDoc.className,
        description:classDoc.description
      });
      await createClassEnrollmentNotification(classDoc, req.user, true);
      res.status(200).json({
        success: true,
        message: 'Successfully left the class'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get classes created by the current user
  getMyCreatedClasses: async (req, res) => {
    try {
      const classes = await Class.find({ createdBy: req.user.id })
        .populate('createdBy', 'name email')
        .populate('participants', 'name email')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: classes.length,
        classes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  },

  // Get classes joined by the current user
  getMyJoinedClasses: async (req, res) => {
    try {
      console.log("id in classses joined",req.user.id)
      const classes = await Class.find({ participants: req.user.id })
        // .populate('createdBy', 'name email')
        .populate('participants', 'name email')
        .sort({ createdAt: -1 });

        console.log(classes);

      res.status(200).json({
        success: true,
        count: classes.length,
        classes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
};

module.exports = classController;