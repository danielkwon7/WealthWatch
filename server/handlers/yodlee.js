var yTrans = require('yodlee-transactions');
var yodlee = require("./index");
var cobrandUser = ""; //example format in sbCobxxxxx
var cobrandPassword = ""; //format is xxxx-xxx-xxx-xxx-xxxx the number of x is not accurate
var userName = ""; //example formats are sbMemxxxxx
var userPassword = ""; //example formate are in sbMemxxxxx
var cobSessionToken = "";
var userSessionToken = "";
var accounts = [];


function generateCobToken(cobrandUser, cobrandPassword){
  return yodlee.getCobSession(cobrandUser, cobrandPassword)
    .then(function(data){
      var dataObj = JSON.parse(data);
      cobSessionToken = dataObj.session.cobSession;
      return cobSessionToken;
    });
}

function generateUserToken(userName, userPassword){
  return function(cobSessionToken){
    return yodlee.getUserSession(cobSessionToken, userName, userPassword)
      .then(function(user){
        var userObj = JSON.parse(user);
        userSessionToken = userObj.session.userSession;
        return userSessionToken;
      });
  }
}

