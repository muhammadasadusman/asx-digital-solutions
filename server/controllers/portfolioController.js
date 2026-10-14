const { v4: uuidv4 } = require('uuid');
const { readCollection, writeCollection } = require('../config/db');

exports.getPortfolio = (req, res) => {
  try {
    const { category, featured } = req.query;
    let portfolio = readCollection('portfolio');

    if (category && category !== 'All') {
      portfolio = portfolio.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (featured === 'true') {
      portfolio = portfolio.filter(p => p.featured === true);
    }

    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching portfolio' });
  }
};

exports.getProjectById = (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = readCollection('portfolio');
    const project = portfolio.find(p => p.id === id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching project' });
  }
};

exports.createProject = (req, res) => {
  try {
    const { title, category, client, year, image, description, tags, liveUrl, featured } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ message: 'Title, category, and description are required.' });
    }

    const portfolio = readCollection('portfolio');
    const newProject = {
      id: 'port_' + uuidv4().slice(0, 8),
      title,
      category,
      client: client || 'Confidential Client',
      year: year || new Date().getFullYear().toString(),
      image: image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
      description,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      liveUrl: liveUrl || '',
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    portfolio.unshift(newProject);
    writeCollection('portfolio', portfolio);
    res.status(201).json(newProject);
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ message: 'Error creating project' });
  }
};

exports.updateProject = (req, res) => {
  try {
    const { id } = req.params;
    const portfolio = readCollection('portfolio');
    const index = portfolio.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    portfolio[index] = {
      ...portfolio[index],
      ...req.body,
      tags: Array.isArray(req.body.tags) 
        ? req.body.tags 
        : (typeof req.body.tags === 'string' ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : portfolio[index].tags),
      updatedAt: new Date().toISOString(),
    };

    writeCollection('portfolio', portfolio);
    res.json(portfolio[index]);
  } catch (err) {
    res.status(500).json({ message: 'Error updating project' });
  }
};

exports.deleteProject = (req, res) => {
  try {
    const { id } = req.params;
    let portfolio = readCollection('portfolio');
    portfolio = portfolio.filter(p => p.id !== id);
    writeCollection('portfolio', portfolio);
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting project' });
  }
};
