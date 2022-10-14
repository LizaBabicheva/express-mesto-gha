const routerUsers = require('express').Router();

const {
  getUsers, getUserById, createUser, updateUser, updateAvatar,
} = require('../controllers/users');

routerUsers.get('/users', getUsers);

routerUsers.get('/users/:userId', getUserById);

routerUsers.post('/users', createUser);

routerUsers.patch('/users/me', updateUser);

routerUsers.patch('/users/me/avatar', updateAvatar);

module.exports = routerUsers;
