const { v4: uuidv4 } = require('uuid');
const { readCollection, writeCollection } = require('../config/db');

exports.getTeam = (req, res) => {
  try {
    const team = readCollection('team');
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching team members' });
  }
};

exports.getTeamMember = (req, res) => {
  try {
    const { id } = req.params;
    const team = readCollection('team');
    const member = team.find(m => m.id === id);
    if (!member) {
      return res.status(404).json({ message: 'Team member not found' });
    }
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching team member' });
  }
};

exports.createTeamMember = (req, res) => {
  try {
    const { name, role, department, avatar, bio, skills, email, portfolioItems } = req.body;
    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required.' });
    }

    const team = readCollection('team');
    const newMember = {
      id: 'team_' + uuidv4().slice(0, 8),
      name,
      role,
      department: department || 'General Tech',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      bio: bio || 'Professional digital expert at ASX DIGITAL SOLUTIONS.',
      skills: Array.isArray(skills) ? skills : (typeof skills === 'string' ? skills.split(',').map(s => s.trim()).filter(Boolean) : []),
      email: email || '',
      portfolioItems: Array.isArray(portfolioItems) ? portfolioItems : (typeof portfolioItems === 'string' ? portfolioItems.split(',').map(p => p.trim()).filter(Boolean) : []),
      verified: true,
      createdBy: req.user.email,
      createdAt: new Date().toISOString(),
    };

    team.push(newMember);
    writeCollection('team', team);
    res.status(201).json(newMember);
  } catch (err) {
    console.error('Create team error:', err);
    res.status(500).json({ message: 'Error creating team member' });
  }
};

exports.updateTeamMember = (req, res) => {
  try {
    const { id } = req.params;
    const team = readCollection('team');
    const index = team.findIndex(m => m.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    const updatedData = { ...req.body };
    if (updatedData.skills && !Array.isArray(updatedData.skills)) {
      updatedData.skills = typeof updatedData.skills === 'string' ? updatedData.skills.split(',').map(s => s.trim()).filter(Boolean) : team[index].skills;
    }
    if (updatedData.portfolioItems && !Array.isArray(updatedData.portfolioItems)) {
      updatedData.portfolioItems = typeof updatedData.portfolioItems === 'string' ? updatedData.portfolioItems.split(',').map(p => p.trim()).filter(Boolean) : team[index].portfolioItems;
    }

    team[index] = {
      ...team[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: req.user.email,
    };

    writeCollection('team', team);
    res.json(team[index]);
  } catch (err) {
    res.status(500).json({ message: 'Error updating team member' });
  }
};

exports.deleteTeamMember = (req, res) => {
  try {
    const { id } = req.params;
    let team = readCollection('team');
    team = team.filter(m => m.id !== id);
    writeCollection('team', team);
    res.json({ message: 'Team member deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting team member' });
  }
};
