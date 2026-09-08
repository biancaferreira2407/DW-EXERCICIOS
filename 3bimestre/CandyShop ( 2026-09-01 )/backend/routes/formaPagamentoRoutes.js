const express = require('express');
const router = express.Router();
const formaPagamentoController = require('../controllers/formaPagamentoController');

// Rotas do CRUD de Unidades de Medida
router.get('/listar', formaPagamentoController.listarformaPagamento);
router.get('/:id', formaPagamentoController.obterformaPagamento);
router.post('/', formaPagamentoController.criarformaPagamento);
router.put('/:id', formaPagamentoController.atualizarformaPagamento);
router.delete('/:id', formaPagamentoController.deletarformaPagamento);

module.exports = router;