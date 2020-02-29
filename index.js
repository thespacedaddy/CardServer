//Stuff to Create the Server
var express = require('express');
var app = express();
var http = require('http').createServer(app);

//Socket IO Stuff
var io = require('socket.io')(http)

//Chance and Random Number Generation
const cnc = require('chance')
const chance = new cnc();
const shortid = require('shortid')
const jlog = require('./jlog')

//Maps
playersList = new Map();
activeRooms = new Map();
socketList = new Map();

//Other Variables


/**
 * TODO:
 *  1. Add Logging Process
 *    - When Players join
 *    - When Players leave
 *    - When Rooms are created/ended
 *    - When Games Start
 */



/**
 * ------------------------
 *   Socket IO Management
 * ------------------------
 */
io.on('connection', (socket) => {
  //When the player joins the game.
  socket.on('playerJoin', (choices, fn) => {
    //generate a GUID
    let playerID = chance.guid()
    //generate the player JSON file
    let playerJSON = {
      playerID: playerID,
      playerType: choices.playerType,
      playerNickname: choices.playerNickname,
    }
    socketList.set(socket.id,playerID);

    playersList.set(playerID, playerJSON);
    
    jlog.join(playersList.get(playerID).playerNickname);

    //Lets Create a Room For the Host
    if (playerJSON.playerType == 'host') {
      let roomID = shortid.generate();
      socket.join(roomID);
      fn(playerID, roomID);

      let roomJSON = {
        roomID: roomID,
        players: new Map().set(playerID, playerJSON),
        host: playerID
      }

      activeRooms.set(roomID, roomJSON)
    } else {
      fn(playerID, 0)
    }

  })

  socket.on('sendGameMsg', (id, msg)=>{
    socket.to(playersList.get(id).socket).emit('gameMSG',msg)
  }) 

  socket.on('disconnect', () => {
    //If the player has a name and id.
    if(socketList.has(socket.id)) {
      var id = socketList.get(socket.id);
      var room = 'notSet';

      activeRooms.forEach((v,k)=> {
        if (v.players.has(id)) {
          room = k;
        }
      })

      //If the player is a host in a room.
      if (activeRooms.has(room) && playersList.get(id).playerType == 'host') {
        //Disconnect all players in room.
        socket.broadcast.to(room).emit('roomDeleted');
        //Delete the room.
        activeRooms.delete(room)

        //Logging
        console.log(`Host ${playersList.get(id).playerNickname} disconnected. And room ${room} was removed.`)

        //Players
        playersList.delete(id);
        

        

        //If the room exists but person is not host.
      } else if (activeRooms.has(room)) {
        //Fetch the JSON
        let updatedJSON = activeRooms.get(room)

        //Remove the player who disconnected.
        updatedJSON.players.delete(id)
        //Place new JSON in the active room
        activeRooms.set(room, updatedJSON);

        //Emit to the host.
        socket.to(room).emit('playerLeave',id);

        //logging
        console.log(`${playersList.get(id).playerNickname} disconnected from ${room}`)

        //remove player
        playersList.delete(id);

      //If they player isnt a room.
      } else {
        console.log(`${playersList.get(id).playerNickname} Disconnected`)
        playersList.delete(id);
      }
    } else {
      console.log('Unjoined Player Disconnected')
    }
  })

  //When the player tries to join a room.
  socket.on('attemptJoinRoom', (code, playerID, fn) => {
      if (activeRooms.has(code)) {
        socket.join(code)
        let roomPlayerJSON = activeRooms.get(code).players;
        roomPlayerJSON.set(playerID, playersList.get(playerID));
        activeRooms.get(code).players.set(code, roomPlayerJSON);
        fn('success');
        socket.to(code).emit('joinedRoom', (playersList.get(playerID)));
      } else {
      fn('invalid')
      }
  })
});


// Start HTTP server
http.listen(3000, function() {
  console.log('Server is now Online');
});