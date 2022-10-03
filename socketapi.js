var cookie = require("cookie")
var express = require('express');
var session = require('express-session')


const io = require( "socket.io" )();
const socketapi = {
    io: io
};


io.on("connection", function (socket) {

	socket.emit("Connection received", session.history); //envoyer info comme quoi qqun s'est connecté
    
	socket.on("sendMessage", function (message) { //recevoir/écouter
        console.log(session.history)
        if (session.history !== undefined) {
            session.history = [...session.history, message]
        } else {
            session.history = [message]
        }
        
		io.emit("sendMessageToAll", session.history); //envoyer un message à tout le monde dont soi-même
        
		/* socket.broadcast.emit('sendMessageToAll', "New user connected"); */ //envoi à tout le monde sauf celui qui a envoyé
	});

    socket.on("askforhistory", function (usersData) { //recevoir/écouter
        if (session.history == undefined) {
            session.history = []
        }
        let locD = usersData
        if (locD == undefined) {
            locD = []
        }
        
       
            let merge = [...session.history, ...locD]
            let alreadyUsed = []
            let final = []
            merge.forEach(x=> {
                if (!alreadyUsed.includes(x.id)) {final.push(x)}
                alreadyUsed.push(x.id)
            })
            final.sort((a,b)=> new Date(a.date)-new Date(b.date))
            session.history = final
        
		
	});

  socket.on("sendWizz", function (message) { //recevoir/écouter
		io.emit("sendWizzToAll", message); //envoyer un message à tout le monde dont soi-même
		/* socket.broadcast.emit('sendMessageToAll', "New user connected"); */ //envoi à tout le monde sauf celui qui a envoyé
	});
});


module.exports = socketapi;