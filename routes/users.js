const routerUsers = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, updateUser, updateAvatar, getUserInfo, createUser, login,
} = require('../controllers/users');

routerUsers.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }).pattern(/^[a-zA-Z0-9_.]+[@]{1}[a-z0-9]+\.[a-z]+$/),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), createUser);

routerUsers.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: false } }).pattern(/^[a-zA-Z0-9_.]+[@]{1}[a-z0-9]+\.[a-z]+$/),
    password: Joi.string().required(),
  }),
}), login);

routerUsers.get('/users', auth, getUsers);

routerUsers.get('/users/me', auth, getUserInfo);

routerUsers.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), auth, getUserById);

routerUsers.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), auth, updateUser);

routerUsers.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), auth, updateAvatar);

module.exports = routerUsers;
