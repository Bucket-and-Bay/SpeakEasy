var React = require('react');
var Main = require('../components/Main.js');
var Router = require('react-router');
var Route = Router.Route;
var Dashboard = require('../components/Dashboard.js')
var IndexRoute = Router.IndexRoute;

module.exports =  (
  <Route path='/' component={Main}> 
    <IndexRoute component={Dashboard} />
  </Route>

)