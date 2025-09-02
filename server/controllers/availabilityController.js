// controllers/availability.controller.js
const { Availability } = require('../model/booking');

exports.addAvailability = async (req, res) => {
  try {
    console.log(req.body);
    const { id, dates } = req.body;
    const serviceId = id;

    let availability = await Availability.findOne({ serviceId });
    if (availability) {
      // If exists, update the dates array
      const existingDates = availability.dates.map(d => d.date.toISOString().split('T')[0]);
      
      // Filter out dates that already exist
      const newDates = dates.filter(date =>
        !existingDates.includes(new Date(date.date).toISOString().split('T')[0])
      );

      if (newDates.length > 0) {
        // Add new dates to existing record
        availability.dates.push(...newDates);
        await availability.save();
      }
    } else {
      // Create new availability record
      availability = new Availability({
        serviceId,
        dates
      });
      await availability.save();
    }

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Error in addAvailability:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Modified to get all availability for a service
exports.getServiceAvailability = async (req, res) => {
  try {
    const serviceId = req.params.id;
    const availability = await Availability.findOne({ serviceId });
    
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'No availability found for this service'
      });
    }

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Keep existing getAvailability for specific date
exports.getAvailability = async (req, res) => {
  try {
    const { serviceId, date } = req.query;
    console.log("service ID ",serviceId);
    const availability = await Availability.findOne({ serviceId });

    if (!availability) {
      return res.json({ timeSlots: [] });
    }

    // Find the specific date's availability
    const dateAvailability = availability.dates.find(d => 
      d.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0]
    );

    res.json(dateAvailability || { timeSlots: [] });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching availability', 
      error: error.message 
    });
  }
};

// New method to update availability
exports.updateAvailability = async (req, res) => {
  try {
    const { id, dates } = req.body;
    const serviceId = id;

    const availability = await Availability.findOne({ serviceId });
    
    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'No availability found for this service'
      });
    }

    // Replace all dates with new dates array
    availability.dates = dates;
    await availability.save();

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    console.error('Error in updateAvailability:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};