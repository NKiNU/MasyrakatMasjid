const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./model/user");
const ContentModel = require("./model/content")
const ClassInboxModel = require("./model/inbox")
const multer = require('multer');
const path = require('path');
const Flag = require('./model/flag');

const app = express();
app.use(express.json()); // Call express.json() as a function
app.use(cors());

mongoose.connect("mongodb://localhost:27017/MMasjid");

const fs = require('fs');
const Video = require("./model/Kuliyyah");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/src/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  }
});

const upload = multer({ storage: storage });
app.post("/uploadvideos", upload.single("video"), async (req, res) => {
  const image = req.file.filename;
  try {
    await Video.create({ filepath: image });
    res.json({ status: "Ok" });
  } catch (error) {
    res.json({ status: "error" });
  }
});




// const newLocal = app.post('/addactivity', upload.array('images'), async (req, res) => {
//   const { title, description, category, datetime, actdate } = req.body;
//   const images = req.files;

//   try {
//     const imageObjects = images.map(image => ({
//       data: image.buffer,
//       contentType: image.mimetype
//     }));


//     const newContent = new ContentModel({
//       title,
//       description,
//       category,
//       datetime,
//       actdate,
//       images: imageObjects
//     });

//     await newContent.save();

//     res.status(200).json({ message: 'Content added successfully' });
//   } catch (error) {
//     console.error('Error adding content:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

app.post('/addactivity', async (req, res) => {
  const { title, description, category, datetime, actdate, classType, onlineLink, classFee, classFeeAmount, media } = req.body;
  // const images = req.files.map(file => file.filename); // Array of filenames of uploaded images

  try {
    const newActivity = new ContentModel({
      title,
      description,
      category,
      datetime,
      actdate,
      classType,
      onlineLink,
      classFee,
      classFeeAmount,
      media // Assuming 'media' field in your schema is used to store image filenames
    });

    await newActivity.save(); // Save the new activity to the database

    console.log('Activity added successfully');

    res.status(200).json({ message: 'Activity added successfully' });
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'An error occurred while adding the activity' });
  }
});

app.put('/activity/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, category, datetime, actdate, classType, onlineLink, classFee, classFeeAmount, media } = req.body;

  try {
    const updatedActivity = await ContentModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        datetime,
        actdate,
        classType,
        onlineLink,
        classFee,
        classFeeAmount,
        media,
      },
      { new: true } // This option returns the modified document rather than the original
    );

    if (!updatedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    console.log('Activity updated successfully');
    res.status(200).json({ message: 'Activity updated successfully', activity: updatedActivity });
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({ error: 'An error occurred while updating the activity' });
  }
});


app.get('/activity', async (req, res) => {
  try {

    const content = await ContentModel.find();

    res.json(content)
  }
  catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/activitydetail/:id', async (req, res) => {

  try {
    // Find the content item by its ID
    const content = await ContentModel.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Send the content data as a JSON response
    res.json(content);
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/flag', async (req, res) => {
  const { contentId, message, status, unflagMessage } = req.body;

  if (!contentId || !message || !status) {
    return res.status(400).json({ error: 'ContentId, message, and status are required' });
  }

  try {
    if (status === 'flagged') {
      const newFlag = new Flag({
        contentId,
        message,
        status,
      });

      await newFlag.save();
      res.status(200).json({ success: true, message: 'Activity flagged successfully' });
    } else if (status === 'unflagged') {
      const flag = await Flag.findOne({ contentId, status: 'flagged' });
      if (!flag) {
        return res.status(404).json({ error: 'Flag not found' });
      }

      flag.status = 'unflagged';
      flag.unflagMessage = unflagMessage;
      await flag.save();
      res.status(200).json({ success: true, message: 'Activity unflagged successfully' });
    } else {
      res.status(400).json({ error: 'Invalid status' });
    }
  } catch (error) {
    console.error('Error flagging/unflagging activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/flagged', async (req, res) => {
  try {
    const flaggedItems = await Flag.find({ status: 'flagged' });
    res.status(200).json(flaggedItems);
  } catch (error) {
    console.error('Error fetching flagged items:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/kuliyyah', async (req, res) => {
  try {
    const content = await ContentModel.find({ category: 'kuliyyah' });

    res.json(content)
  }
  catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/class', async (req, res) => {
  try {
    const content = await ContentModel.find({ category: 'class' });

    res.json(content)
  }
  catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/classdetail/:id', async (req, res) => {

  try {
    // Find the content item by its ID
    const content = await ContentModel.findById(req.params.id);
    console.log(content);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Send the content data as a JSON response
    res.json(content);
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContent = await ContentModel.findByIdAndDelete(id);
    if (deletedContent) {
      res.status(200).json({ success: true, message: 'Content deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Content not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
});

app.post('/createEventInbox', async (req, res) => {
  try {
    // Extract data from the request body
    const { className } = req.body;

    // Create a new instance of the ClassInboxModel using the provided data
    const newEvent = new ClassInboxModel({
      title: `Subscription Confirmation: ${className}`, // Construct the title
      description: `Subject: Subscription Confirmation: ${className}`, // Construct the description
      className: className,
      userName: 'Harun',
      opened: false // Set the user's name
    });

    // Save the new event to the database
    const savedEvent = await newEvent.save();

    // Send a success response
    res.status(200).json(savedEvent);
  } catch (error) {
    // Handle errors
    console.error('Error creating event:', error);
    // Send an error response
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to get the count of unread messages
app.get('/unreadMessagesCount', async (req, res) => {
  try {
    const count = await ClassInboxModel.countDocuments({ opened: false });
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching unread messages count:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Endpoint to get inbox list
app.get('/inboxes', async (req, res) => {
  try {
    const inboxes = await ClassInboxModel.find().sort({ createdDatetime: -1 }); // Sorting in descending order
    res.json(inboxes);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});
app.put('/inboxes/:id', async (req, res) => {
  const { id } = req.params;
  const { opened } = req.body;

  try {
    // Assuming you have a database model named Inbox and you are using Mongoose
    const inbox = await ClassInboxModel.findByIdAndUpdate(id, { opened }, { new: true });

    if (!inbox) {
      return res.status(404).json({ message: 'Inbox item not found' });
    }

    res.status(200).json({ message: 'Inbox item updated successfully', inbox });
  } catch (error) {
    console.error('Error updating inbox:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE endpoint to delete an inbox item by ID
app.delete('/inboxes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInbox = await ClassInboxModel.findByIdAndDelete(id);

    if (!deletedInbox) {
      return res.status(404).json({ message: 'Inbox item not found' });
    }

    res.json({ message: 'Inbox item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inbox item:', error);
    res.status(500).send('Server Error');
  }
});

app.get('/inboxes/:id', async (req, res) => {

  try {
    // Find the content item by its ID
    const content = await ClassInboxModel.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Send the content data as a JSON response
    res.json(content);
  } catch (error) {
    console.error('Error fetching content by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

});


// app.use('/images', express.static(path.join(__dirname, '../client/src/images')));



app.post("/uploadvideos", upload.single("video"), async (req, res) => {
  const image = req.file.filename;
  try {
    await Video.create({ filepath: image });
    res.json({ status: "Ok" });
  } catch (error) {
    res.json({ status: "error" });
  }
});

app.get("/getvideos", async (req, res) => {
  try {
    const data = await Video.find();
    res.send({ status: "ok", data: data });
  } catch (error) {
    res.json({ status: "error" });
  }
});







// Login
app.post('/login', (req, res) => {

  const { email, password } = req.body;
  UserModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json("success")
        } else {
          res.json("incorrect")
        }
      }
      else {
        res.json("No record Existed")
      }
    })

})

// Register
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email is already registered.' });
  }


  UserModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err));
});

app.listen(3001, () => {
  console.log("Server connected on port 3001");
});
