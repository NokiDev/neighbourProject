var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
	help_type: { type : String, required : true},
	skills: { type : String, required : true},
    description : { type : String, required : true},
    user :  {type: Schema.Types.ObjectId, ref: 'Profile'},
    lattitude : {type : Number, required : true},
    longitude : {type : Number, required : true},
    date : {type : Date, required : true},
    createdOn : {type : Date, default : Date.now},
    time : {type : Number, default : 1},
});


exports.model = mongoose.model('Request', schema, 'Requests');