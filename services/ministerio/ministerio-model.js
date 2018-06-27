const modelService = require('../../config/modelService');

var autoIncrement = modelService.autoIncrement;
var uniqueValidator = modelService.uniqueValidator;
var Schema = modelService.Schema;
var mongoose = modelService.mongoose;

var Ministerio = new Schema({
   // Nome da igreja
    igreja: {
        type: String,
        required: true,
        unique: false
    },
    token: {
        type: String,

    },
    
});

Ministerio.plugin(autoIncrement.plugin, {
    model: 'Ministerio',
    field: '_id'
});
Ministerio.plugin(uniqueValidator);

Ministerio.statics = {
    criarMinisterio: function (requestData, callback) {
       
        requestData.token = requestData.idIntegrante.toString();
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
module.exports = mongoose.model('Ministerio', Ministerio);
 