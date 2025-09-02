const Schedule = require('../model/event');
// const { sendNotification } = require('../utils/sendNotification');
const Notification = require('../model/notification')
const User = require("../model/user")

// Get all schedules for a user
exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.status(200).json(schedules);
    console.log(schedules)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedules' });
  }
};

// Create a new schedule
exports.createSchedule = async (req, res) => {
  try {

        // Fetch all users from the database
        const users = await User.find();


    console.log("in")

    const { title, description, date, time,images} = req.body;

    const scheduletest = new Schedule({ 
      title, 
      description, 
      date, 
      time,
      images });
      console.log(scheduletest)

    await scheduletest.save();

    const notifications = users.map((user)=>({
      userId:  user._id,
      title: "New event",
      message: title+" "+description,
    }));

        // Save notifications to the database
    const savedNotifications = await Notification.insertMany(notifications);

    // Emit notifications to all users via Socket.IO
    users.forEach((user) => {
      req.io.emit(`notification-${user._id}`, {
        title: 'New event',
        message: title+" "+description,
      });
    });

    // sendNotification(req.user.email, `New schedule created: ${title}`);
    res.status(201).json(scheduletest+"noty send");
    console.log("success save data")
  } catch (error) {
    res.status(500).json({ message: 'Error creating schedule' });
  }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule' });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!schedule) {
      return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(200).json({ message: 'Schedule deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting schedule' });
  }
};
