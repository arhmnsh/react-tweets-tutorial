var JSX = require('node-jsx').install(),
    React = require('react'),
    TweetsApp = require('./components/TweetsApp.react'),
    Tweet = require('./models/Tweet');

module.exports = {
  index: function(req, res) {
    //call static model method to get tweets in the db
    Tweet.getTweets(0,0, function(tweets, pages) {
      //render React to a string, passing in our fetched tweets
      var markup = React.renderComponentToString(
        TweetsApp({
          tweets: tweets
        })
      );

      //render our 'home' template
      res.render('home', {
        markup: markup, //pass rendered react markup
        state: JSON.stringify(tweets) //pass current state to client side
      });

    });
  },

  page: function(req, res) {
    //fetch tweets by page via param
    Tweet.getTweets(req.params.page, req.params.skip, function(tweets) {
      //render as JSON
      res.send(tweets);
    });
  }
  
}