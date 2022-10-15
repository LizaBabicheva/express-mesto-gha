const Card = require('../models/card');

const { errorBadRequest, errorNotFound, errorInternal } = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(errorBadRequest).send({ message: 'Переданы некорректные данные карточки' });
        return;
      }
      res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(errorNotFound).send({ message: 'Карточка не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch(() => res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' }));
};

module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' }));

module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => res.send({ data: card }))
  .catch(() => res.status(errorInternal).send({ message: 'Ошибка по-умолчанию' }));
