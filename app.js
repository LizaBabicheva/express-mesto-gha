const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { errorNotFound, errorInternal } = require('./utils/utils');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', createUser);
app.post('/signin', login);

app.use(auth);

app.use(routerUsers);
app.use(routerCards);

app.use('*', (req, res) => {
  res.status(errorNotFound).send({ message: 'Запрашиваемый путь не найден' });
});

// app.use((err, req, res, next) => {
//   res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' });
// });

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
