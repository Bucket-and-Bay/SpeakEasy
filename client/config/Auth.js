function isLoggedIn(){
  return !!localStorage.token;
}

function requireAuth (nextState, replace){
  if(!isLoggedIn()){
    replace(null, '/signin');
  }
}

function loggedIn (nextState, replace){

  if(isLoggedIn()){
    replace(null, '/dashboard');
  }
}
module.exports = {
  isLoggedIn: isLoggedIn,
  requireAuth: requireAuth,
  loggedIn: loggedIn

}