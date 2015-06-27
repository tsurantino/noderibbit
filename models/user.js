var mongoose = require('mongoose')

module.exports = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
  name: String,
  profile: String,

  ribbits: [{
    content: { type: String, maxlength: 140 },
    created: { type: Date, default: Date.now },
  }]
})