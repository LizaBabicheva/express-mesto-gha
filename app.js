const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const routerUsers = require('./routes/users');

const routerCards = require('./routes/cards');

const { errorNotFound } = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6347f3ec6d38fe245bebe880',
  };

  next();
});

app.use(routerUsers);

app.use(routerCards);

app.use('*', (req, res) => {
  res.status(errorNotFound).send({ message: 'Запрашиваемый путь не найден' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
