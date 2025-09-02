const mongoose = require('mongoose');
const crypto = require('crypto');

const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  encryptedMessage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Encryption utility functions
const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY;
const iv = crypto.randomBytes(16);

MessageSchema.statics.encryptMessage = function (message) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey), iv);
  let encrypted = cipher.update(message);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

MessageSchema.statics.decryptMessage = function (encryptedMessage) {
  const [ivHex, encryptedText] = encryptedMessage.split(':');
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey),
    Buffer.from(ivHex, 'hex')
  );
  let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

module.exports = mongoose.model('Message', MessageSchema);
