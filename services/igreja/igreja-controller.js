const igrejaModel = require('./igreja-model')
const igrejaPessoaModel = require('./igreja-pessoa-model')
const pessoaModel = require('./../pessoa/pessoa-model')
const ministerioPessoaModel = require('./../ministerio/ministerio-pessoa-model')
const constants = require('./../utils/constants');
const async = require('async')

exports.criar = (req, res) => {
    var result = {};
    var error = {};

    igrejaModel.criar(req.body, (err, igreja) => {

        error.err = err;

        if (!err) {
            var igrPessoa = {
                idIgreja: igreja._id,
                idPessoa: req.body.idPessoa,
                tipoPessoa: constants.tipoPessoaIgreja.Admin,
            };
            igrejaPessoaModel.criar(igrPessoa,
                (err, igrejaPessoa) => {
                    if (!err) {
                        igreja.token = "#" + igreja._id + igrejaPessoa._id;
                        igrejaModel.update(igreja,
                            (err, igrejaUp) => {
                                if (!err) {

                                    var minObj = {
                                        idIgrejaPessoa: igrejaPessoa._id,
                                        idIgreja: igrejaPessoa.idIgreja,
                                        idPessoa: igrejaPessoa.idPessoa,
                                        tipoPessoa: igrejaPessoa.tipoPessoa,
                                        dthCadastro: igrejaPessoa.dthCadastro,
                                        token: igreja.token
                                    };

                                    retorno = {
                                        obj: minObj,
                                        ok: !err,
                                        error: err
                                    }
                                    return res.json(retorno);
                                } else {
                                    retorno = {
                                        obj: igrejaPessoa,
                                        ok: !err,
                                        error: err
                                    }
                                    return res.json(retorno);
                                }
                            });
                    } else {

                        retorno = {
                            obj: igrejaPessoa,
                            ok: !err,
                            error: err
                        }
                        return res.json(retorno);
                    }

                });
        }
        else {

            retorno = {
                obj: igreja,
                ok: !err,
                error: err
            }

            return res.json(retorno);
        }
    })

}

exports.buscarIgrejaPorToken = (req, res) => {
    var tokenIgreja = req.body.token;
    var idPessoa = req.body.idPessoa;
    igrejaModel.findbyToken(tokenIgreja, (err, results) => {


        igrejaPessoaModel.findByIgrejaAndPessoa({ idIgreja: results._id, idPessoa: idPessoa },
            (err, igrejaPessoa) => {

                var tipoPessoa = igrejaPessoa == null
                    ? constants.tipoPessoaIgreja.NaoSolicitado : igrejaPessoa.tipoPessoa

                var obj = {
                    idIgreja: results._id,
                    nome: results.nome,
                    token: results.token,
                    tipoPessoa: tipoPessoa,
                    cidade: results.cidade,
                    uf: results.uf

                }

                var retorno = {
                    obj: obj,
                    ok: !err,
                    error: err
                }

                return res.json(retorno);

            });
    });
}

exports.solicitarEntrada = (req, res) => {

    var igrPessoa = {
        idIgreja: req.body.idIgreja,
        idPessoa: req.body.idPessoa,
        tipoPessoa: constants.tipoPessoaIgreja.Pendente,
        dthCadastro: new Date()
    };
    igrejaPessoaModel.criar(igrPessoa,
        (err, igrejaPessoa) => {

            retorno = {
                obj: igrejaPessoa,
                ok: !err,
                error: err
            }
            return res.json(retorno);

        });

}




exports.recuperaIgrejaPorPessoa = (req, res) => {
    var retorno = {};
    igrejaPessoaModel.findBy({ idPessoa: req.body.idPessoa },
        (err, lstIgrejaPessoa) => {

            var igrejas = [];

            async.each(lstIgrejaPessoa, function (igrPessoa, callback2) {
                igrejaModel.findById(igrPessoa.idIgreja, (err1, igreja) => {
                    var obj = {
                        idIgrejaPessoa: igrPessoa._id,
                        idIgreja: igrPessoa.idIgreja,
                        idPessoa: igrPessoa.idPessoa,
                        cidade: igreja.cidade,
                        uf: igreja.uf,
                        nome: igreja.nome,
                        token: igreja.token,
                        tipoPessoa: igrPessoa.tipoPessoa,
                        ehFavorito: igrPessoa.ehFavorito,
                    };
                    igrejas.push(obj);
                    if (igrejas.length == lstIgrejaPessoa.length) {
                        callback2('t');
                    }
                });
            }, function (obj) {

                retorno = {
                    obj: igrejas,
                    ok: !err,
                    error: err
                }
                return res.json(retorno);
            });
        });
}

exports.atualizaIgrejaFavorito = (req, res) => {
    var retorno = {};

    igrejaPessoaModel.removeTodosFavoritos(req.body.idPessoa,
        (err, igreja) => {

            igrejaPessoaModel.update({ _id: req.body.idIgrejaPessoa },
                { ehFavorito: req.body.ehFavorito },
                (err, igrejatt) => {

                    igrejaPessoaModel.findById(req.body.idIgrejaPessoa, (err, igrejatt) => {

                        retorno = {
                            ok: !err,
                            error: err
                        }
                        return res.json(retorno);
                    })
                }
            )
        })
}

exports.buscarSolicitacoesPendentes = (req, res) => {

    var retorno = {};
    var obj = { idIgreja: req.body.idIgreja, tipoPessoa: constants.tipoPessoaIgreja.Pendente };
    console.log(obj);

    igrejaPessoaModel.findBy(obj, (err, lstIgrejaPessoa) => {


        var pessoas = [];

        async.each(lstIgrejaPessoa, function (igrPessoa, callback2) {
            pessoaModel.findById(igrPessoa.idPessoa, (err1, pessoa) => {
                var obj = {
                    idIgrejaPessoa: igrPessoa._id,
                    idIgreja: igrPessoa.idIgreja,
                    idPessoa: igrPessoa.idPessoa,
                    nome: pessoa.name,
                    tipoPessoa:igrPessoa.tipoPessoa,
                    email: pessoa.login
                };
                pessoas.push(obj);
                if (pessoas.length == lstIgrejaPessoa.length) {
                    callback2('t');
                }
            });
        }, function (obj) {

            retorno = {
                obj: pessoas,
                ok: !err,
                error: err
            }
            return res.json(retorno);
        });
    });
}

exports.permitirAcesso = (req, res) => {
    var retorno = {};

    var obj = {
        tipoPessoa: req.body.permitir
            ? constants.tipoPessoaIgreja.Participante : constants.tipoPessoaIgreja.NaoAceito,
    };
    console.log(obj);

    igrejaPessoaModel.findByIdAndUpdate(req.body.idIgrejaPessoa, obj,
        (err, result) => {

            retorno = {
                ok: !err,
                error: err
            }
            return res.json(retorno);

        });

}

exports.recuperaPessoasPorIgreja = (req, res) => {
    var retorno = {};
    igrejaPessoaModel.findBy({ idIgreja: req.body.idIgreja },
        (err, lstIgrejaPessoa) => {

            var pessoas = [];

            async.each(lstIgrejaPessoa, function (igrPessoa, callback2) {
                pessoaModel.findById(igrPessoa.idPessoa, (err1, pessoa) => {
                    ministerioPessoaModel.findByQuery({ idIgrejaPessoa: igrPessoa._id }, (err2, lstMinPessoa) => {
                       
                        var ministerios = [];
                        for (var index = 0; index < lstMinPessoa.length; index++) {
                            var element = lstMinPessoa[index];
                            ministerios.push({
                                idMinisterioPessoa: element._id,
                                tipoMinisterio: element.tipoMinisterio,
                                tipoPessoaMinisterio: element.tipoPessoaMinisterio
                            });
                        }
                        var obj = {
                            idIgrejaPessoa: igrPessoa._id,
                            idIgreja: igrPessoa.idIgreja,
                            idPessoa: igrPessoa.idPessoa,
                            nome: pessoa.name,
                            email: pessoa.login,
                            ministerios: ministerios
                        };
                        pessoas.push(obj);
                        if (pessoas.length == lstIgrejaPessoa.length) {
                            callback2('t');
                        }
                    }
                    )
                });
            }, function (obj) {

                retorno = {
                    obj: pessoas,
                    ok: !err,
                    error: err
                }
                return res.json(retorno);
            });
        });
}

exports.alterar = (req, res) => {
    var retorno = {};
    var obj = req.body;
    igrejaModel.findByIdAndUpdate(obj.idIgreja, obj, (err, result) => {

        retorno = {
            obj: result,
            ok: !err,
            error: err
        }
        return res.json(retorno);
    });
}    


exports.encontrarIgrejaPorId = (req, res) => {
    var retorno = {};
    igrejaModel.findById(req.body.idIgreja, (err, result) => {

        retorno = {
            obj: result,
            ok: !err,
            error: err
        }
        return res.json(retorno);
    });
}    


