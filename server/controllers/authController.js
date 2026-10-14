const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readCollection, writeCollection } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const users = readCollection('users');
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;
    res.json({
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

exports.getMe = (req, res) => {
  res.json({ user: req.user });
};

exports.getUsers = (req, res) => {
  try {
    const users = readCollection('users');
    const safeUsers = users.map(({ password, ...u }) => u);
    res.json(safeUsers);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users.' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, title, avatar, permissions } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const users = readCollection('users');
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'usr_' + uuidv4().slice(0, 8),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'employee',
      title: title || 'Team Specialist',
      avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      permissions: permissions || {
        can_manage_services: false,
        can_manage_portfolio: false,
        can_manage_team: false,
        can_manage_reviews: false,
        can_manage_messages: false,
        can_manage_billing: false,
        can_manage_users: false,
      },
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeCollection('users', users);

    const { password: _, ...safeUser } = newUser;
    res.status(201).json({
      message: 'Staff user created successfully with designated permissions.',
      user: safeUser,
    });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Failed to create user.' });
  }
};

exports.updatePermissions = (req, res) => {
  try {
    const { id } = req.params;
    const { permissions, role, title } = req.body;

    const users = readCollection('users');
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (users[index].role === 'superadmin' && req.user.id !== users[index].id) {
      return res.status(403).json({ message: 'Cannot modify Super Admin permissions.' });
    }

    if (permissions) {
      users[index].permissions = {
        ...users[index].permissions,
        ...permissions,
      };
    }

    if (role && req.user.role === 'superadmin') {
      users[index].role = role;
    }

    if (title) {
      users[index].title = title;
    }

    writeCollection('users', users);

    const { password: _, ...safeUser } = users[index];
    res.json({
      message: `Permissions updated successfully for ${safeUser.name}.`,
      user: safeUser,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user permissions.' });
  }
};

exports.deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    let users = readCollection('users');
    const userToDelete = users.find(u => u.id === id);

    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (userToDelete.role === 'superadmin') {
      return res.status(403).json({ message: 'Super Admin account cannot be deleted.' });
    }

    users = users.filter(u => u.id !== id);
    writeCollection('users', users);

    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user.' });
  }
};
