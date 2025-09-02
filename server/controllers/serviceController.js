const Service = require('../model/service');
const { sendFlagNotification} = require('../utils/emails');
const User = require('../model/user');
const message = require('../model/inbox');

// const { validateService } = require('../middleware/validation');

exports.createService = async (req, res) => {
  try {
    console.log('Incoming Request:', req.body);
    console.log('User:', req.user);
    console.log('User ID:', req.user?.id);


    // Prepare the service object
    const service = new Service({
      ...req.body,
      createdBy: req.user?.id || null, // Ensure req.user exists
    });

    console.log('Service to Save:', service);

    // Save to the database
    await service.save();
    console.log('Service Created Successfully:', service);

    res.status(201).json({ message: 'Service created successfully', service });
  } catch (error) {
    console.error('Error Creating Service:', error);
    res.status(500).json({ message: 'Error creating service', error: error.message });
  }
};


exports.getAllServices = async (req, res) => {
  try {
    // If user is not admin/superadmin, only return non-flagged services
    const filter = (!req.user || (req.user.role === 'user')) ? { isFlagged: false } : {};
    const services = await Service.find(filter);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    
    // If service is flagged and user is not admin/superadmin, return 404
    if (service.isFlagged && (!req.user || req.user.role === 'user')) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    // const { error } = validateService(req.body);
    // if (error) return res.status(400).json({ message: error.details[0].message });

    console.log('Incoming Request:', req.body);
    console.log('User:', req.params.id);
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};


exports.flagService = async (req, res) => {
  try {
    const { message } = req.body;

    // Fetch the service to check its current flagged status
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Check if the service is already flagged
    if (service.isFlagged) {
      // Unflag the service
      service.isFlagged = false;
      service.flagDetails = null; // Clear flag details
      await service.save();

      res.json({
        service,
        message: 'Service unflagged successfully',
      });
    } else {
      // Validate flag message for flagging
      if (!message || message.trim() === '') {
        return res.status(400).json({ message: 'Flag message is required.' });
      }

      // Flag the service with details
      service.isFlagged = true;
      service.flagDetails = {
        message,
        flaggedBy: req.user._id,
        flaggedAt: new Date(),
      };
      await service.save();

      // Find committee members (admins with email notifications enabled)
      const committeeMembers = await User.find({
        role: 'admin',
        emailNotifications: true,
      });

      if (committeeMembers.length > 0) {
        // Send email notifications only to users with email notifications enabled
        await sendFlagNotification(committeeMembers, service, message);
      }

      // Create inbox message for all admins (email preference doesn't apply here)
      const inboxMessage = new Message({
        type: 'flag',
        title: `Service Flagged: ${service.name}`,
        content: message,
        relatedService: service._id,
        sender: req.user._id,
        recipients: committeeMembers.map((member) => ({
          userId: member._id,
          read: false,
        })),
      });

      await inboxMessage.save();

      res.json({
        service,
        message: 'Service flagged successfully',
      });
    }
  } catch (error) {
    console.error('Error updating service flag status:', error);
    res.status(500).json({ message: 'Error updating service flag status', error: error.message });
  }
};
