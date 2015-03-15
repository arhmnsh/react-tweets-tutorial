var Tweet = require('../models/Tweet');

module.exports = function(stream, io) {
  stream.on('data', function(data) {

    //construct a new tweet object
    var tweet = {
      twid: data['id'],
      active: false,
      author: data['user']['name'],
      avatar: data['user']['profile_image_url'],
      body: data['text'],
      date: data['created_at'],
      screenname: data['user']['screen_name']
    };

    //create a new model instance with our object
    var tweetEntry = new Tweet(tweet);

    //save 'er to the database
    tweetEntry.save(function(err) {
      if(!err) {
        //if everything is cool, socket.io emits the tweet
        io.emit('tweet', tweet);
      }
    });

  });
  
};