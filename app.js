/** @jsx React.DOM */

var React = require('react');
var TweetsApp = require('./components/TweetsApp.react');

//snag the initial state that was passed from the server side
var initialState = JSON.parse(document.getElementById('initial-state').innerHTML);

//render the components, picking up where left off on the server
React.renderComponent(
  <TweetsApp tweets={initialState} />, document.getElementById('react-app')
);