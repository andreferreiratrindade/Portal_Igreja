const modelService = require('../../config/modelService');

var autoIncrement = modelService.autoIncrement;
var uniqueValidator = modelService.uniqueValidator;
var Schema = modelService.Schema;
var mongoose = modelService.mongoose;

var Ministracao = new Schema({
    idIgreja:{
        type: Number,
        required: true,
        unique: false
    },
    idEquipeMinistracao: {
        type: Number,
        required: true,
        unique: false
    },

    dthMinistracao:{
        type:Date,
        required:true
    },
    idMusicaMinistracao:{
        type: Number,
        required: true,
        unique: false
    },
});

Ministracao.plugin(autoIncrement.plugin, {
    model: 'Ministracao',
    field: '_id'
});
Ministracao.plugin(uniqueValidator);

Ministerio.statics = {
    criar: function (requestData, callback) {
        this.create(requestData, callback);
    },
    findMinisterioUpdate: function (query, obj, callback) {
        this.findOneAndUpdate(query, obj, callback);
    },
   
    findbyToken: function (token, callback) {
        this.findOne({ 'token': token}, callback);
    },
    update: function (ministerio, callback) {
        ministerio.save(callback);
    },
}

module.exports = mongoose.model('Ministracao', Ministracao);
