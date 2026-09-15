const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.listarPedidos);
router.get('/:id', pedidoController.obterPedido);
router.post('/', pedidoController.criarPedido);

module.exports = router;
