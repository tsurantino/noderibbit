var mongoose = require('mongoose'),
    moment = require('moment'),
    Schema = mongoose.Schema,
    User = require('./user');

var ribbitSchema = Schema({
  content:  { type: String, maxlength: 140 },
  created:  { type: Date, default: Date.now() },
  owner:    { type: Schema.Types.ObjectId, ref: 'User' },
});

ribbitSchema.statics.getRibbits = function(userIds, limit, skip, cb) {
  userIdQuery = {}
  if (userIds)
    userIdQuery = { owner: { $in: userIds } }

  this.find(userIdQuery)
    .limit(limit)
    .skip(skip)
    .populate('owner')
    .sort('-created')
    .exec(function(err, ribbits) {
      ribbits = ribbits.map(parseRibbitData);
      return cb(err, ribbits);
    });
}

var parseRibbitData = function (ribbit) {
  return {
    content: ribbit.content,
    created: moment(ribbit.created).fromNow(),//.format('MMM D, YYYY'),
    owner: {
      username: ribbit.owner.username,
      email: ribbit.owner.email,
      name: ribbit.owner.name,
      profile: ribbit.owner.profile,
    }
  }
}

module.exports = mongoose.model('Ribbit', ribbitSchema);