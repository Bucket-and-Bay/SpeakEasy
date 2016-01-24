var React = require('react');
var Main = require('../components/Main.js');
var Router = require('react-router');
var Route = Router.Route;
var Dashboard = require('../components/Dashboard.js')
var IndexRoute = Router.IndexRoute;
var Analysis = require('../components/Analysis.js');

module.exports =  (
  <Route path ='/'component={Main}>
    <Route path='analysis' component={Analysis} /> 
    <IndexRoute component={Dashboard} />
  </Route>

)