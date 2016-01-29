var React = require('react');
var Main = require('../components/Main.js');
var Router = require('react-router');
var Route = Router.Route;
var Dashboard = require('../components/Dashboard.js')
var IndexRoute = Router.IndexRoute;
var IndexRedirect = Router.IndexRedirect;
var Analysis = require('../components/Analysis.js');
var Signup = require('../components/Signup.js');
var Signin = require('../components/Signin.js');
var IndexRedirect = Router.IndexRedirect;
var auth = require('./Auth.js');
var Record = require('../components/Record.js');
var Home = require('../components/Home.js');

module.exports =  (
  <Route path ='/'component={Main}>
    <Route path='dashboard' component={Dashboard} onEnter={auth.requireAuth}/>
    <Route path='analysis/:videoID' component={Analysis} onEnter={auth.requireAuth}/> 
    <Route path='signup' component={Signup} onEnter={auth.loggedIn}/>
    <Route path='signin' component={Signin} onEnter={auth.loggedIn} />
    <Route path ='record' component={Record} onEnter={auth.requireAuth}/>
    <IndexRoute component={Home} />
  </Route>
)