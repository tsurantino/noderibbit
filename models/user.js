var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = Schema({
  username: String,
  email: String,
  password: String,
  name: String,
  profile: String,
  ribbits: [{
    type: Schema.Types.ObjectId,
    ref: 'Ribbit',
  }],
});

userSchema.statics.register = function(data, cb) {

}

module.exports = mongoose.model('User', userSchema);