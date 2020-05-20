const express = require('express');
const routes  = express.Router();

// IMPORTAÇÃO DOS CONTROLLERS
const UserController = require('./controllers/UserController');

// USERS ROUTES
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

module.exports = routes;