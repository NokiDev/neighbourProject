var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    description : { type : String, required : true},
    user :  {type: Schema.Types.ObjectId, ref: 'Profile'},
    lattitude : {type : Number, required : true},
    longitude : {type : Number, required : true},
    date : {type : Date, required : true},
    createdOn : {type : Date, default : Date.now},
    nbPeople : {type : Number, default : 1},
    urgent : {type : Boolean, default: false, required : false}
});


exports.model = mongoose.model('Request', schema, 'Requests');