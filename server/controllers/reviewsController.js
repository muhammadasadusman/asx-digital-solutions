const { v4: uuidv4 } = require('uuid');
const { readCollection, writeCollection } = require('../config/db');

exports.getReviews = (req, res) => {
  try {
    const reviews = readCollection('reviews');
    // Public endpoint returns only approved reviews
    const approvedReviews = reviews.filter(r => r.status === 'approved');
    res.json(approvedReviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching client reviews' });
  }
};

exports.getAllReviewsAdmin = (req, res) => {
  try {
    const reviews = readCollection('reviews');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews for moderation' });
  }
};

exports.createReview = (req, res) => {
  try {
    const { clientName, clientRole, rating, review, serviceUsed, avatar } = req.body;
    if (!clientName || !review || !rating) {
      return res.status(400).json({ message: 'Name, review feedback, and rating are required.' });
    }

    const reviews = readCollection('reviews');
    const newReview = {
      id: 'rev_' + uuidv4().slice(0, 8),
      clientName,
      clientRole: clientRole || 'Client Partner',
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      review,
      serviceUsed: serviceUsed || 'Digital Solutions',
      avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(clientName)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending', // Requires admin approval for security
      featured: false,
      createdAt: new Date().toISOString(),
    };

    reviews.unshift(newReview);
    writeCollection('reviews', reviews);

    res.status(201).json({
      message: 'Thank you for your rating and feedback! It has been submitted for review.',
      review: newReview,
    });
  } catch (err) {
    console.error('Submit review error:', err);
    res.status(500).json({ message: 'Error submitting client feedback' });
  }
};

exports.updateReviewStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, featured, rating, review, clientName, clientRole } = req.body;

    const reviews = readCollection('reviews');
    const index = reviews.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (status) reviews[index].status = status;
    if (featured !== undefined) reviews[index].featured = Boolean(featured);
    if (rating !== undefined) reviews[index].rating = Number(rating);
    if (review) reviews[index].review = review;
    if (clientName) reviews[index].clientName = clientName;
    if (clientRole) reviews[index].clientRole = clientRole;

    reviews[index].moderatedAt = new Date().toISOString();
    reviews[index].moderatedBy = req.user.email;

    writeCollection('reviews', reviews);
    res.json({ message: 'Review updated successfully', review: reviews[index] });
  } catch (err) {
    res.status(500).json({ message: 'Error moderating review' });
  }
};

exports.deleteReview = (req, res) => {
  try {
    const { id } = req.params;
    let reviews = readCollection('reviews');
    reviews = reviews.filter(r => r.id !== id);
    writeCollection('reviews', reviews);
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review' });
  }
};
