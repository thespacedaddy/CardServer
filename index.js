//Stuff to Create the Server
var express = require('express');
var app = express();
var http = require('http').createServer(app);
const port = 3000

//Socket IO Stuff
var io = require('socket.io')(http)

//Other Dependencies
const cnc = require('chance')
const chance = new cnc();
const idPool =  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()[]'



//Other Variables



/**
 * Socket IO Management:
 *  
 * 
 * 
 */
io.on('connection', (socket) => {
  //When the player joins the game.
  socket.on('playerJoin', (choices) => {
    //generate a GUID
    let playerID = chance.guid()
    //generate the player JSON file
    let playerJSON = {
      playerID: playerID,
      playerType: choices.playerType,
      playerNickname: choices.playerNickname,
    }

    console.log(playerJSON)
  })
});





// Start HTTP server
http.listen(3000, function() {
  console.log('Server is now Online');
});