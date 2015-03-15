var mongoose = require('mongoose');

//create a new schema for our tweet data
var schema = new mongoose.Schema({
  twid        : String,
  active      : Boolean,
  author      : String,
  avatar      : String,
  body        : String,
  date        : Date,
  screenname  : String
});

//create a static getTweets method to return tweet data from the db
schema.statics.getTweets = function(page, skip, callback) {
  var tweets = [],
      start = (page * 10) + (skip * 1);

  //query the db, using skip and limit to achieve page chunks
  Tweet.find({},'twid active author avatar body date screenname', {skip: start, limit:10}).sort({date: 'desc'}).exec(function(err,docs){
    //if everything is cool...
    if(!err) {
      tweets = docs; //we got tweets yay!!
      tweets.forEach(function(tweet) {
        tweet.active = true; //set them to active
      });
    };

    //pass them back to specified callback
    callback(tweets);

  });

};

//return a Tweet model based upon the defined schema

module.exports = Tweet = mongoose.model('Tweet', schema);