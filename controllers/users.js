const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { errorBadRequest, errorNotFound, errorInternal } = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(errorNotFound).send({ message: `Пользователь с id '${req.params.userId}' не найден` });
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(errorBadRequest).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      }
      res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorBadRequest).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      }
      res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorBadRequest).send({ message: 'Переданы некорректные данные пользователя' });
        return;
      }
      res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorBadRequest).send({ message: 'Переданы некорректные данные пользователя' });
      } else {
        res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      // res.send({ token });
      res.status(200).cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).send({ message: 'Успешная авторизация' });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};
