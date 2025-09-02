const Message = require('../model/message');
const User = require('../model/user');

exports.getContacts = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.user.id } }).select('username profileImage role');
        console.log(users);
        res.json(users);
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
    };
    //   try {
//     console.log("getContacts");
//     const userId = req.user.id;

//     const messages = await Message.find({
//       $or: [{ sender: userId }, { receiver: userId }],
//     })
//       .sort({ createdAt: -1 })
//       .select('sender receiver');

//     const contacts = messages.reduce((acc, msg) => {
//       const contactId = msg.sender.toString() === userId ? msg.receiver : msg.sender;
//       if (!acc.includes(contactId)) {
//         acc.push(contactId);
//       }
//       return acc;
//     }, []);
//     console.log(contacts);

//     res.json(contacts);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.saveMessage = async (req, res) => {
  try {
    console.log("saveMessage");
    const { receiver, message } = req.body;
    const sender = req.user.id;

    const encryptedMessage = Message.encryptMessage(message);

    const newMessage = new Message({
      sender,
      receiver,
      encryptedMessage,
    });

    const savedMessage = await newMessage.save();

    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

exports.getChatHistory = async (req, res) => {
  
  try {
    console.log("getChatHistory");
    const { contactId } = req.params;
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId },
      ],
    })
      .sort({ createdAt: 1 })
      .select('sender receiver encryptedMessage createdAt');

    const decryptedMessages = messages.map((msg) => ({
      ...msg._doc,
      message: Message.decryptMessage(msg.encryptedMessage),
    }));

    res.json(decryptedMessages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
