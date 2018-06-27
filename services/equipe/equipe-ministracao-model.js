const modelService = require('../../config/modelService');

var autoIncrement = modelService.autoIncrement;
var uniqueValidator = modelService.uniqueValidator;
var Schema = modelService.Schema;
var mongoose = modelService.mongoose;

var EquipeMinistracao = new Schema({
    idMinistracao:{
        type: Number,
        required: true
    },
    idEquipe:{
        type: Number,
        required: true
    }
});

EquipeMinistracao.plugin(autoIncrement.plugin, {
    model: 'equipeMinistracao',
    field: '_id'
});
EquipeMinistracao.plugin(uniqueValidator);

EquipeMinistracao.statics = {
    criar: function (requestData, callback) {
        this.create(requestData, callback);
    },
    findUpdate: function (query, obj, callback) {
        this.findOneAndUpdate(query, obj, callback);
    },
   
    findOne: function (token, callback) {
        this.findOne({ 'token': token}, callback);
    },
    update: function (ministerio, callback) {
        ministerio.save(callback);
    },
}

var equipeMinistracao = mongoose.model('equipeMinistracao', EquipeMinistracao);

/** export schema */
module.exports = {
    EquipeMinistracao: equipeMinistracao
};