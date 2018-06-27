const pessoaController = require('./pessoa-controller')
var express = require('express')
	, router = express.Router()

router.post('/create', pessoaController.create);
router.post('/login', pessoaController.login);
router.post('/forgot', pessoaController.forgotPassword);
router.post('/reset', pessoaController.newPassword);
router.post('/verifyLink', pessoaController.verifyEmail);
router.get('/lst', pessoaController.listPessoa);

module.exports = router
