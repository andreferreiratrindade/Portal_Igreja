const modelService = require('../../config/modelService');

var autoIncrement = modelService.autoIncrement;
var uniqueValidator = modelService.uniqueValidator;
var Schema = modelService.Schema;
var mongoose = modelService.mongoose;

var Equipe = new Schema({
    idMinIntegrante:{
        type: Number,
        required: true,
        unique: false
    },
    dscEquipe:{
        type:String, 
    },
    tipoInstrumento:{
        type:Number
    }
});

Equipe.plugin(autoIncrement.plugin, {
    model: 'equipe',
    field: '_id'
});
Equipe.plugin(uniqueValidator);

Equipe.statics = {
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

var equipe = mongoose.model('equipe', Equipe);

/** export schema */
module.exports = {
    Equipe: equipe
};