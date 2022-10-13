const routerCards = require('express').Router();

const { getCards, createCard, deleteCard } = require('../controllers/cards');

routerCards.get('/cards', getCards);

routerCards.post('/cards', createCard);

routerCards.delete('/cards/:cardId', deleteCard);

module.exports = routerCards;
