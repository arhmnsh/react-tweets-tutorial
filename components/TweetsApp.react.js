module.exports = TweetsApp = React.createClass({

  //method to add a tweet to our timeline
  addTweet: function(tweet) {
    //get current application state
    var updated = this.state.tweets;

    //increment the unread count
    var count = this.state.count + 1;

    //increment the skip count
    var skip = this.state.skip + 1;

    //add tweet to the beginning of the tweets array
    updated.unshift(tweet);

    //set application state
    this.setState({tweets: updated, count: count, skip: skip});
  },

  //method to show the unread tweets
  showNewTweets: function() {
    //get current application state
    var updated = this.state.tweets;

    //mark our tweets active
    updated.forEach(function(tweet) {
      tweet.active = true;
    });

    //set application state (active tweets + reset unread count)
    this.setState({tweets: updated, count: 0});
  },

  //method to check if more tweets should be laoded, by scroll position
  checkWindowScroll: function() {
    //get scroll pos & window data
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var s = document.body.scrollTop;
    var scrolled = (h + s) > document.body.offsetHeight;

    //if scrolled enough, not currently paging and not complete...
    if(scrolled && !this.state.paging && !this.state.done) {
      //set application state (paging, increment page)
      this.setState({paging: true, page: this.state.page + 1});

      //get the next page of tweets from the server
      this.getPage(this.state.page);
    }
  }

  //set the initial component state
  getInitialState: function(props) {
    props = props || this.props;

    //set initial application state using props
    return {
      tweets: props.tweets,
      count: 0,
      page: 0,
      paging, false,
      skip: 0,
      done: false
    };
  },

  componentWillReceiveProps: function(newProps, oldProps) {
    console.log("TEST newProps: \n", newProps);
    this.setState(this.getInitialState(newProps))
  },

  componentDidMount: function() {

    //preserve self reference
    var self = this;

    //initialize socket.io
    var socket = io.connect();

    //on tweet event emission...
    socket.on('tweet', function(data) {
      //add a tweet to our queue
      self.addTweet(data);
    });

    window.addEventListener('scroll', this.checkWindowScroll);
  },

  //render the component
  render: function() {
    return (
      <div className="tweets-app">
        <Tweets tweets={this.state.tweets} />
        <Loader paging={this.state.paging} />
        <NotificationBar count={this.state.count} onShowNewTweets={this.showNewTweets} />
      </div>
    )

  }
});
