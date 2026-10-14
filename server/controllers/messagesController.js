const { v4: uuidv4 } = require('uuid');
const { readCollection, writeCollection } = require('../config/db');

exports.submitMessage = (req, res) => {
  try {
    const { name, email, phone, service, budget, timeline, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required.' });
    }

    const messages = readCollection('messages');
    const newMessage = {
      id: 'msg_' + uuidv4().slice(0, 8),
      name,
      email,
      phone: phone || '',
      service: service || 'General Inquiry',
      budget: budget || 'Flexible',
      timeline: timeline || 'Standard',
      subject: subject || 'New Project Consultation',
      message,
      status: 'New',
      replies: [],
      createdAt: new Date().toISOString(),
    };

    messages.unshift(newMessage);
    writeCollection('messages', messages);

    res.status(201).json({
      message: 'Thank you! Your message has been received by ASX DIGITAL SOLUTIONS. Our team will get back to you shortly.',
      messageId: newMessage.id,
    });
  } catch (err) {
    console.error('Submit message error:', err);
    res.status(500).json({ message: 'Failed to submit inquiry' });
  }
};

exports.getMessages = (req, res) => {
  try {
    const { status } = req.query;
    let messages = readCollection('messages');

    if (status && status !== 'All') {
      messages = messages.filter(m => m.status.toLowerCase() === status.toLowerCase());
    }

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

exports.updateMessageStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, replyNote } = req.body;

    const messages = readCollection('messages');
    const index = messages.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (status) {
      messages[index].status = status;
    }

    if (replyNote) {
      if (!messages[index].replies) messages[index].replies = [];
      messages[index].replies.push({
        id: 'rep_' + uuidv4().slice(0, 6),
        author: req.user.name,
        email: req.user.email,
        text: replyNote,
        date: new Date().toISOString(),
      });
    }

    messages[index].updatedAt = new Date().toISOString();
    writeCollection('messages', messages);

    res.json({ message: 'Message updated successfully', messageData: messages[index] });
  } catch (err) {
    res.status(500).json({ message: 'Error updating message' });
  }
};

exports.deleteMessage = (req, res) => {
  try {
    const { id } = req.params;
    let messages = readCollection('messages');
    messages = messages.filter(m => m.id !== id);
    writeCollection('messages', messages);
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting message' });
  }
};
