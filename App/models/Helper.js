var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    userId : {type : Schema.Types.ObjectId, required : true},
    description : {type :String, default:""},
    skills : {type : String, required : true},
    helpType : {type : String, required : true},
    actionRadius : {type : Number, default : 5}
});

exports.model = mongoose.model('Helper', schema, 'Helpers');