const routerUsers = require('express').Router();

const {
  getUsers, getUserById, updateUser, updateAvatar,
} = require('../controllers/users');

routerUsers.get('/users', getUsers);

routerUsers.get('/users/:userId', getUserById);

routerUsers.patch('/users/me', updateUser);

routerUsers.patch('/users/me/avatar', updateAvatar);

module.exports = routerUsers;
