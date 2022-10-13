const express = require('express');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const routerUsers = require('./routes/users');

const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// mongoose.createConnection('mongodb://localhost:27017/mestodb').asPromise()
//   .then(() => console.log('connected to the server'))
//   .catch((err) => console.log('error: ', err.message));

mongoose.connect('mongodb://localhost:27017/mestodb');
// ,{
// directConnection: true,
// useNewUrlParser: true,
// useCreateIndex: true,
// useFindAndModify: false,
// });
// .catch((err) => console.log(err.reason));

app.use(routerUsers);

app.use(routerCards);

app.use((req, res, next) => {
  req.user = {
    _id: '6347f3ec6d38fe245bebe880',
  };

  next();
});

// app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
