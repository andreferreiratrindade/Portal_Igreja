const modelService = require('../../config/modelService');
var relationship = modelService.relationship;
var autoIncrement = modelService.autoIncrement;
var uniqueValidator = modelService.uniqueValidator;
var Schema = modelService.Schema;
var mongoose = modelService.mongoose;
var ObjectId = mongoose.Schema.Types.ObjectId;
var MinisterioPessoa = new Schema({

    idIgreja: {
         type: Number,
         require: true,
     },
     idPessoa: {
         type: Number,
         require: true,
     },
     idIgrejaPessoa : {
        type: Number,
        require: true,
     },
     tipoMinisterio:{
        type: Number, // 1 - Louvor; 2 - Criança
        require: true
     },

     // Não utilizar
     tipoPessoa: {
        type: Number, // 1 - Adminsitrador; 2 - Pessoa; 3 - Solicitante
        require: true,
        default:0
    },

    tipoPessoaMinisterio: {
        type: Number, // 1 - Adminsitrador; 2 - Pessoa; 3 - Solicitante
        require: true
    },
    dthCadastro: {
        type: Date,
        require: true,
        default: Date.now
    }
});

MinisterioPessoa.plugin(autoIncrement.plugin, {
     model: 'MinisterioPessoa',
     field: '_id'
 });
MinisterioPessoa.plugin(uniqueValidator);

MinisterioPessoa.statics = {
    criar: function (requestData, callback) {

        this.create(requestData, callback);
    },
    findUpdate: function (query, obj, callback) {
        this.findOneAndUpdate(query, obj, callback);
    },

    findbyToken: function (token, callback) {
        this.findOne({ token: token }, callback);
    },
    
    findByQuery: function (query, callback) {
        
        this.find(query).exec(callback);
    },

    findByIgrejaAndPessoa: function (query, callback) {

        this.findOne(query, callback);
    },

    recuperaMinisterioPorPessoa: function (idPessoa, callback) {
        this.find({idPessoa:idPessoa})
        // .where('idPessoa').equals(idPessoa)          
            .exec(callback);
    },
    removeTodosFavoritos: function (idPessoa, callback) {
        this.where('idPessoa').equals(idPessoa)
            .update({ ehFavorito: false }, callback)
    },
    recuperaPessoasPendentes: function (obj, callback) {
        this.find(obj).exec(callback);
    }
}

module.exports = mongoose.model('MinisterioPessoa', MinisterioPessoa);
