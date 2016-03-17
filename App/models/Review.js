var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
    description: {type: String, required: true},
    note: {type: Number, required: true},
    forUser: {type: Schema.Types.ObjectId, ref: 'Profile'},
    fromUser: {type: Schema.Types.ObjectId, ref: 'Profile'},
    createdOn: {type: Date, default: Date.now}
});


exports.model = mongoose.model('Review', schema, 'Reviews');