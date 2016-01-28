function isLoggedIn(){
  return !!localStorage.token;
}

module.exports = {
  requireAuth: function(nextState, replace){
    if(!isLoggedIn()){
      replace(null, '/signin');
    }
  },

  loggedIn:function(nextState, replace){
 
    if(isLoggedIn()){
      replace(null, '/dashboard');
    }
  }

}