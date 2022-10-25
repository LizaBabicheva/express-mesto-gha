const routerUsers = require('express').Router();

// const auth = require('./middlewares/auth');

const {
  getUsers, getUserById, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');

routerUsers.get('/users', getUsers);

routerUsers.get('/users/:userId', getUserById);

routerUsers.get('/users/me', getUserInfo);

routerUsers.patch('/users/me', updateUser);

routerUsers.patch('/users/me/avatar', updateAvatar);

// routerUsers.get('/users', auth, getUsers);

// routerUsers.get('/users/:userId', auth, getUserById);

// routerUsers.get('/users/me', auth, getUserInfo);

// routerUsers.patch('/users/me', auth, updateUser);

// routerUsers.patch('/users/me/avatar', auth, updateAvatar);

module.exports = routerUsers;
