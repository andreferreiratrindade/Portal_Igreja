'use strict';
const Common = require('../../config/common')
const Config = require('../../config/config')
const Jwt = require('jsonwebtoken')
const Pessoa = require('./pessoa-model')
const privateKey = Config.key.privateKey
const async = require('async')
const igrejaPessoaModel = require('../igreja/igreja-pessoa-model')

exports.create = (req, res, next) => {
    req.body.password = Common.encrypt(req.body.password);
    var result = {};
    var error = {};

    Pessoa.savePessoa(req.body, (err, pessoa) => {

        error.err = err;
        if (!err) {
            let tokenData = {
                pessoaname: pessoa.login,
                id: pessoa._id,
            };

            result = { token: Jwt.sign(tokenData, privateKey), pessoa: pessoa }
        } else {
            if (err.name == 'ValidationError') {
                error.message = "Existe usuário cadastrado com este e-mail. Favor inserir outro e-mail."
                res.status(409);
            }
            else {
                error.message = "Erro: " + err;
                res.status(500);
            }
        }
        nextResponse(result, error, res);
    });
}

exports.login = (req, res, nex) => {

    var result = {};
    var error = {};
    console.log('Ministérios: ');
    
    Pessoa.findPessoa({ login: req.body.login }, (err, pessoa) => {
        error.err = err;
        if (err) {
            error.message = 'Erro ao realizar login';
            res.status(421);
            nextResponse(result, error, res);

        }
        else if (pessoa == null) {
            error.message = 'E-mail ou senha inválidos.';
            res.status(421);
            nextResponse(result, error, res);
        }
        else {
            if (req.body.password === Common.decrypt(pessoa.password)) {


                igrejaPessoaModel.findByQuery(
                    {
                        idPessoa: pessoa._id
                    }, (err, minPessoa) => {

                        var tokenData = {
                            pessoaname: pessoa.login,
                            id: pessoa._id,
                            
                        };

                       var igrejas =  minPessoa.filter(function(item){
                            return item.ehFavorito;
                        });

                        result = {
                            pessoa: pessoa,
                            token: Jwt.sign(tokenData, privateKey),
                            igrejaPessoa:  igrejas.length == 1 ? igrejas[0]: null
                        };

                        nextResponse(result, error, res);

                    })
            } else {
                error.message = 'E-mail ou senha inválidos.';
                res.status(421);
                nextResponse(result, error, res);

            }
        }

    });
}

exports.forgotPassword = (req, res) => {
    async.waterfall([
        function (callback) {
            Pessoa.findPessoa({ pessoaname: req.body.pessoaname }, (err, pessoa) => {
                if (!err) {
                    if (pessoa === null) {
                        let error = {}
                        error.statusCode = 422
                        error.message = `please provide another pessoa email`
                        callback(error, null);
                    }
                    else {
                        callback(null, pessoa)
                    }
                }
                else {
                    let error = {}
                    error.statusCode = 500
                    error.message = `Oh uh, something went wrong`
                    callback(error, null)
                }
            })
        },
        function (pessoa, callback) {
            let tokenData = {
                pessoaname: pessoa.login,
                id: pessoa._id
            }
            Common.sentMailForgotPassword(pessoa, Jwt.sign(tokenData, privateKey), (error, result) => {
                if (!error) callback(null, 'success')
                else {
                    let error = {}
                    error.statusCode = 500
                    error.message = `Oh uh, something went wrong`
                    callback(error, null)
                }
            });
        },
    ],
        // optional callback
        function (err, results) {
            if (err) {
                if (err.statusCode) return res.status(err.statusCode).send(err.message);
                else return res.status(500).send(`Oh uh, something went wrong`);
            }
            else return res.json({ message: `reset password link sent to your mail.` });
        });
}

exports.newPassword = (req, res) => {
    Jwt.verify(req.body.token, privateKey, (err, decoded) => {
        if (err) return res.status(500).send(`Oh uh, something went wrong`);
        else {
            Pessoa.findPessoaByIdAndPessoaName(decoded.id, decoded.pessoaname, (err, pessoa) => {
                if (err) {
                    return res.status(500).send(`Oh uh, something went wrong`);
                }
                else if (pessoa == null) {
                    return res.status(422).send(`Email not recognised`);
                }
                else if (req.body.newPassword !== req.body.confirmNew) {
                    return res.status(400).send(`Password Mismatch`);
                }
                else {
                    pessoa.password = Common.encrypt(req.body.newPassword);
                    Pessoa.updatePessoa(pessoa, (err, pessoa) => {
                        if (!err) {
                            return res.json({ message: `password changed successfully` });
                        }
                        else { return res.status(500).send(`Oh uh, something went wrong`); }
                    })
                }
            })
        }
    })
}

exports.verifyEmail = (req, res) => {
    Jwt.verify(req.body.token, privateKey, (err, decoded) => {
        if (err) return res.status(500).send(`Oh uh, something went wrong`);
        else {
            Pessoa.findPessoaByIdAndPessoaName(decoded.id, decoded.pessoaname, (err, pessoa) => {
                if (err) {
                    return res.status(500).send(`Oh uh, something went wrong`);
                }
                else if (pessoa == null) {
                    return res.status(422).send(`Email not recognised`);
                }
                else if (pessoa.isVerified === true) {
                    return res.json({ message: `account is already verified` });
                }
                else {
                    pessoa.isVerified = true;
                    Pessoa.updatePessoa(pessoa, (err, pessoa) => {
                        if (!err) {
                            return res.json({ message: `account sucessfully verified` });
                        }
                        else { return res.status(500).send(`Oh uh, something went wrong`); }
                    })
                }
            })
        }
    })
}

function nextResponse(result, error, res) {

    var retorno = {
        obj: result,
        ok: res.statusCode == 200,
        error: error
    }

    //res.status(200);

    return res.json(retorno);
}
exports.listPessoa = (req, res) => {
    console.log('Teste' + req.body);

    return res.json({ message: `account sucessfully verified` });
    return res.json({ nome: 'Andre' });
}

