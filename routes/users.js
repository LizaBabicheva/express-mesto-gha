const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, updateUser, updateAvatar, getUserInfo, createUser, login,
} = require('../controllers/users');

routerUsers.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .email({ minDomainSegments: 2, tlds: { allow: false } }),
    password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp(['^[a-zA-Z0-9]{3,30}$'])), // паттерн
  }),
}), createUser);

routerUsers.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30),
    password: Joi.string().required(), // email,паттерн,
  }),
}), login);

routerUsers.get('/users', auth, getUsers);

routerUsers.get('/users/:userId', auth, getUserById);

routerUsers.get('/users/me', auth, getUserInfo);

routerUsers.patch('/users/me', auth, updateUser);

routerUsers.patch('/users/me/avatar', auth, updateAvatar);

// routerUsers.get('/users', auth, getUsers);

// routerUsers.get('/users/:userId', auth, getUserById);

// routerUsers.get('/users/me', auth, getUserInfo);

// routerUsers.patch('/users/me', auth, updateUser);

// routerUsers.patch('/users/me/avatar', auth, updateAvatar);

module.exports = routerUsers;
