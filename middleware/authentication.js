const { validateUserToken } = require('../services/authentication');

function checkForAuthenticationCookie (cookieName){
  return (req, res, next) => {
    const tokenCookieValue = req.cookies[cookieName];
    
    if (!tokenCookieValue){
      return next();
    }

    try{

      const userPayload = validateUserToken(tokenCookieValue);      
      req.user = userPayload;

    }catch(error){}

    return next();
  }
}

function restrictTo (role){
  return (req, res, next) => {
    if(!req?.user){
      return res.render('signin');
    }
    else if(role.includes(req.user.role)){
      return next();
    }
    return res.redirect('/');
  }
}

module.exports = {
  checkForAuthenticationCookie,
  restrictTo
}