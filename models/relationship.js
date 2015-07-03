var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var relationshipsSchema = Schema({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  created: { 
    type: Date, 
    default: Date.now 
  }
});

relationshipsSchema.statics.getFollowingIds = function(userId, cb) {
  this.find({ follower: userId })
}

relationshipsSchema.statics.getFollowerCount = function(userId, cb) {
  this.find({ follower: userId })
}

relationshipsSchema.statics.getFollowingCount = function(userId, cb) {
  this.find({ follower: userId })
}

module.exports = mongoose.model('Relationship', relationshipsSchema);
