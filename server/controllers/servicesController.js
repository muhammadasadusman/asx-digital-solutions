const { v4: uuidv4 } = require('uuid');
const { readCollection, writeCollection } = require('../config/db');

exports.getServices = (req, res) => {
  try {
    const services = readCollection('services');
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching services' });
  }
};

exports.createService = (req, res) => {
  try {
    const { title, slug, icon, description, features, technologies, popular } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required.' });
    }

    const services = readCollection('services');
    const newService = {
      id: 'srv_' + uuidv4().slice(0, 8),
      title,
      slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
      icon: icon || 'Code2',
      description,
      features: features || [],
      technologies: technologies || [],
      popular: Boolean(popular),
      createdAt: new Date().toISOString(),
    };

    services.push(newService);
    writeCollection('services', services);
    res.status(201).json(newService);
  } catch (err) {
    res.status(500).json({ message: 'Error creating service' });
  }
};

exports.updateService = (req, res) => {
  try {
    const { id } = req.params;
    const services = readCollection('services');
    const index = services.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    services[index] = {
      ...services[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    writeCollection('services', services);
    res.json(services[index]);
  } catch (err) {
    res.status(500).json({ message: 'Error updating service' });
  }
};

exports.deleteService = (req, res) => {
  try {
    const { id } = req.params;
    let services = readCollection('services');
    services = services.filter(s => s.id !== id);
    writeCollection('services', services);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting service' });
  }
};
