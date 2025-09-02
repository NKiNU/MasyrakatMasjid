const Event = require('../model/event');

exports.createEvent = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    // Parse and validate dates
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid startDate or endDate. Ensure they are valid ISO date strings.'
      });
    }

    // Create the event
    const event = await Event.create({
      ...req.body,
      startDate,
      endDate,
      createdBy: req.user.id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        event,
      },
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    console.log("hello in get all events", req.user)
    const events = await Event.find({
      createdBy: req.user.id,
    }).sort({ startDate: 'asc' });

    console.log("hello in get all events", events)
    
const formattedEvents = events.map(event => ({
  id: event._id,
  title: event.name,
  start: event.startDate,
  end: event.endDate,
  description: event.description,
  eventType: event.eventType,
  source: event.source,
  googleEventId: event.googleEventId
}));

res.json(formattedEvents);
} catch (error) {
res.status(500).json({ message: error.message });
}
};


exports.getEventsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide start and end dates.',
      });
    }

    const events = await Event.find({
      createdBy: req.user._id,
      startDate: { $gte: new Date(startDate) },
      endDate: { $lte: new Date(endDate) },
    }).sort({ startDate: 'asc' });

    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        event,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'eventType', 'description', 'startDate', 'endDate', 'status'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid updates!',
      });
    }

    const event = await Event.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID.',
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        event,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    console.log(req.params.id)
    console.log(req.user.id)
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!event) {
      return res.status(404).json({
        status: 'fail',
        message: 'No event found with that ID.',
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
