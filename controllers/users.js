const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const MONGO_DB_CODE = require('../utils/utils');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  User.find(req.user)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError(`Пользователь с id '${req.params.userId}' не найден`));
        return;
      }
      // else{}
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
        return;
      }
      // else {}
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  //
  // if (!email || !password) {
  //   next(new BadRequestError('Email или пароль не введен'));
  //   return;
  // }
  //
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.send(userWithoutPassword);
    })
    .catch((err) => {
      // console.log(err);
      if (err.code === MONGO_DB_CODE) {
        res.status(409).send({ message: 'Юзер уже создан' });
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
        // res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
        // return;
      }
      next(err);
    });
  // res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(errorBadRequest).send({ message:
        // 'Переданы некорректные данные пользователя' });
        // return;
        next(new BadRequestError('Переданы некорректные данные пользователя'));
        return;
      }
      // res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' });
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  //
  if (!email || !password) {
    return res.status(400).send({ message: 'Не заполнен пароль/мейл' });
  }
  //
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // res.send({ token });
      res.status(200)
        .cookie('authorization', token, { maxAge: 3600000 * 24 * 7, httpOnly: true })
        .send({ message: 'Успешная авторизация' });
    })
    // .catch((err) => {
    //   res.status(401).send({ message: err.message });
    // });
    .catch(next);
};

// return next(new MyError(''));
