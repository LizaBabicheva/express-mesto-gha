const routerUsers = require('express').Router();

const { getUsers, getUserById, createUser } = require('../controllers/users');

routerUsers.get('/users', getUsers);

routerUsers.get('/users/:userId', getUserById);

routerUsers.post('/users', createUser);

module.exports = routerUsers;
