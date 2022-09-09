EXPRESS : INSTALLATION DU MODULE  
npm install socket.io --save


INITIALISATION DE SOCKET.IO (BIN/WWW)
var io = require('socket.io')(server);

MISE EN ÉCOUTE DE L'ÉVÉNEMENT “CONNECTION”
io.on('connection', function(socket){console.log('a user connected');});

REACT/REACT NATIVE : INSTALLATION DU MODULE
npm install --save socket.io-client

IMPORT DU MODULE CLIENT
import socketIOClient from "socket.io-client";

INITIALISATION D’UN WEB SOCKET
var socket = socketIOClient("http://urlBackend");

ENVOYER UN MESSAGE DU FRONTEND VERS LE BACKEND : ARG1: NOM, ARG2: CONTENU
<Button title="Send Message"
       onPress={()=> socket.emit("sendMessage", "Hello John !") } />

RECEVOIR UN MESSAGE DEPUIS LE BACKEND
var server = http.createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
 socket.on('sendMessage', function(message){ console.log(message); });
});

ENVOYER UN MESSAGE DU BACKEND VERS LE FRONTEND
io.on('connection', function(socket){
 socket.emit('sendMessageFromBack', "New user connected");
});

RÉ-EXPÉDIER UN MESSAGE REÇU VERS LE FRONTEND
socket.on('sendMessage', function(message) {  
 socket.emit('sendMessageFromBack', message);  
});

MULTIDIFFUSION : BROADCASTING (IO.EMIT) : ENVOI DIFFUSÉ À TOUS LES FRONTENDS
io.on('connection', function(socket){
 io.emit('sendMessageFromBack', "New user connected");
});

MULTIDIFFUSION
Tous les Frontends sauf celui qui vient d'initialiser le web socket


io.on('connection', function(socket){
 socket.broadcast.emit('sendMessageFromBack', "New user connected");
});

FRONTEND : ENREGISTRER L’INFORMATION REÇUE DANS UN ÉTAT
import React, {useState, useEffect} from 'react';
import socketIOClient from "socket.io-client";
var socket = socketIOClient("http://...");


export default function App() {
 const [message, setMessage] = useState("");


 useEffect(() => {
   socket.on('sendMessageFromBack', (newMessage)=> {
     setMessage(newMessage);
   });  
 }, [message]);

 
 return (...);
}


1 - CONTEXTE
En utilisant les requêtes HTTP et notamment la fonction fetch avec React ou React Native, le Frontend peut initier un échange avec le Backend qui peut lui répondre.

Le Frontend peut déclencher des échanges suite à l’initialisation d’un composant, à la modification d’un état ou suite à une action de l’utilisateur par exemple (clic sur un bouton, ..)

Imaginons que nous souhaitions mettre en place un chat entre utilisateurs. On voudrait faire en sorte qu’un utilisateur puisse envoyer un message au Backend et que le Backend puisse renvoyer ce message à tous les utilisateurs concernés.

Grâce aux requêtes HTTP, l’utilisateur John va pouvoir envoyer le contenu de son message au Backend.. On souhaiterait que cette information soit ensuite envoyée automatiquement par le Backend aux autres utilisateurs (Fronted). Malheureusement, jusqu’à présent, le Backend ne peut pas être à l’initiative des échanges avec le Frontend.

Avec les mécaniques connues, nous n’aurions pas d’autre choix que de proposer un bouton côté Frontend pour demander au Backend de nous fournir les nouveaux messages.



1.1 ÉCHANGE EN TEMPS RÉEL ?
La réception des messages dépend d’une action de l’utilisateur. On est loin d’une mécanique “temps réel”.

Il existe une mécanique pour pouvoir mettre en place des échanges en  “temps réel” et rendre possible ces échanges d’information  initiés soit par le Frontend soit par le Backend : les Web Sockets.

1.2 COMMENT FONCTIONNENT LES WEB SOCKETS ?
Les websockets permettent de créer un tunnel persistant entre le Frontend et le Backend. Ce tunnel va permettre des échanges dans les deux sens.



Pour proposer un chat, nous allons initier des tunnels entre les Frontend de nos utilisateurs et notre Backend. Chaque Frontend aura ainsi un échange privilégié et optimisé (plus rapide) avec le Backend.

Le message envoyé par John transitera par ce tunnel. Le Backend pourra alors recevoir cette information et la transmettre aux autres Frontend via leur tunnel d’échange.

Les autres utilisateurs recevront alors ce message en temps réel.




1.3 METTRE EN PLACE LES WEB SOCKETS ?
Pour mettre en place les web sockets, nous utiliserons socket.io.

Socket.io est un module qui permet de se brancher à Express (serveur) et React/React Native (client) :

Coté Backend, socket.io va initialiser un accès à son serveur
Chaque Frontend va pouvoir se connecter au Backend et créer le tunnel d’échange
Le tunnel entre le Frontend et le Backend désormais créé, chacun peut désormais initier des échanges d’information.

1.4 PEUT-ON DIFFUSER À TOUS LES FRONTEND ?
Autre avantage des web sockets : la possibilité pour le Backend de diffuser un message à un ensemble d’utilisateurs. On appelle cela le Broadcasting (multi-diffusion).



Reprenons notre exemple de chat : lorsqu’un utilisateur envoie un message, celui-ci est réceptionné par le Backend qui pourra l’envoyer à tous les autres utilisateurs du chat.


J'ai lu cette partie
2 - STEP BY STEP
2.1 EXPRESS : INSTALLATION DU MODULE
npm install socket.io --save

Côté Backend, nous devons installer le module socket.io.

Express : Mise en place dans le framework (/bin/www)
var server = http.createServer(app);


var io = require('socket.io')(server);


io.on('connection', function(socket){
 console.log('a user connected');
});

Nous allons brancher Socket.io à notre serveur HTTP. La création du serveur HTTP se fait dans le fichier /bin/www, il faudra donc plugguer Socket.io après la création du serveur.

Initialisation de socket.io
var io = require('socket.io')(server);

On importe socket.io et on l’associe au serveur HTTP créé juste auparavant.

Mise en écoute de l'événement “connection”
io.on('connection', function(socket){
 console.log('a user connected');
});

Notre Backend est en attente d’une connexion d’un Frontend. Quand un des Frontend va se connecter, notre Backend va créer un tunnel d’échanges (web socket) pour échanger de l’information

2.2 REACT/REACT NATIVE : INSTALLATION DU MODULE
npm install --save socket.io-client

Côté Frontend, nous devons également installer un module : socket.io-client

Mise en place dans un composant
import React from 'react';
import {Button} from "react-native";

import socketIOClient from "socket.io-client";


var socket = socketIOClient("http://...");


export default function App() {

 return (
   <Button title="Send Message"/>
 )
 
}

Nous allons mettre en place la connexion au Backend afin de créer le tunnel d’échanges.

Import du module client
import socketIOClient from "socket.io-client";

On importe la fonction socketIOClient proposée par le module.

Initialisation d’un web socket
var socket = socketIOClient("http://...");

On utilise la fonction socketIOClient en fournissant l’url du Backend. Cette fonction va permettre au Frontend de se connecter au Backend et d’initialiser ainsi le tunnel (web socket)

Le tunnel est désormais actif, l’envoi de messages est désormais possible dans les deux sens.

Attention, si vous êtes en local, votre url commencera par http et non https.

2.3 ENVOYER UN MESSAGE DU FRONTEND VERS LE BACKEND
import React from 'react';
import {Button} from "react-native";

import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://...");

export default function App() {

 
 return (
   <Button title="Send Message"
      onPress={()=> socket.emit("sendMessage", "Hello John !") }
   />
 )
 
}

Nous allons pouvoir désormais envoyer un message du Frontend vers le Backend.

Instruction pour envoyer un message
socket.emit("sendMessage", "Hello John !")

Pour envoyer un message, nous allons utiliser la méthode emit :

En premier argument, nous allons donner un nom au message que nous souhaitons envoyer : sendMessage, par exemple
En deuxième argument, nous allons envoyer le contenu du message.
2.4 RECEVOIR UN MESSAGE DEPUIS LE BACKEND
var server = http.createServer(app);

var io = require('socket.io')(server);

io.on('connection', function(socket){
 
 socket.on('sendMessage', function(message) {
   console.log(message);
 });

});

Le message va être envoyé par le Frontend via le tunnel. Pour être exploité par le Backend, il va falloir indiquer au Backend ce qu’il doit effectuer comme traitement à la réception du message

Mise en écoute de l'événement sendMessage
socket.on('sendMessage', function(message) {
   console.log(message);
 });

socket.on permet de mettre une écoute en place pour indiquer au Backend quel traitement il doit effectuer à la réception du message nommé “sendMessage”.

À la réception du message, socket.on() va exécuter la fonction de callback fournie. Ici, la fonction de callback affiche le message reçu dans la console.

Attention, socket.on doit être dans la fonction de callback de la “connection” (io.on).

On peut mettre une écoute en place sur les messages envoyés uniquement si la connexion entre le Backend et le Frontend s’est bien effectuée.

2.5 ENVOYER UN MESSAGE DU BACKEND VERS LE FRONTEND
var server = http.createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
 
 socket.emit('sendMessageFromBack', "New user connected");

});

Le Backend peut également être à l'initiative d’un échange. Ici, notre Backend va envoyer un message nommé sendMessageFromBack au Frontend.

Envoi du message au Frontend
socket.emit('sendMessageFromBack', "New user connected");

Le Backend peut envoyer des messages via la méthode emit() également.

Là encore, le socket.emit doit se faire uniquement si la connexion est effective entre le Backend et le Frontend.

Dans cet exemple, dès qu’un Frontend se connecte au Backend, le Backend lui envoie un message.

2.6 RÉ-EXPÉDIER UN MESSAGE REÇU VERS LE FRONTEND
var server = http.createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
   
 socket.on('sendMessage', function(message) {
   
   socket.emit('sendMessageFromBack', message);
 
 });
 
});

Le Backend peut également renvoyer un message reçu.

Ici, si la connexion est effective, le Backend est à l’écoute d’un message nommé SendMessage. A la réception,, il va réexpédier ce message au Frontend en le nommant sendMessageFromBack

2.7 MULTIDIFFUSION : BROADCASTING (IO.EMIT)
var server = http.createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
 
 io.emit('sendMessageFromBack', "New user connected");

});

Jusqu’à présent les échanges se faisaient toujours avec le même Frontend. Mais l'intérêt des websockets est également de pouvoir diffuser des informations à l’ensemble des Frontend connectés.

Envoi diffusé à tous les Frontends (via io.emit)
 io.emit('sendMessageFromBack', "New user connected");

Pour envoyer un message à l’ensemble des utilisateurs connectés, nous n’utilisons plus socket.emit mais io.emit.

La logique est la même, on va fournir à la méthode io.emit() le nom du message et son contenu.

Tous les Frontend connectés au Backend vont alors recevoir le message.

Dans cet exemple, dès qu’un utilisateur se connecte, tous les autres utilisateurs reçoivent un message.

2.8 MULTIDIFFUSION : BROADCASTING (SOCKET.BROADCAST.EMIT)
var server = http.createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
 
 socket.broadcast.emit('sendMessageFromBack', "New user connected");

});


Envoi diffusé à tous les Frontends sauf celui vient d'initialiser le web socket (via socket.broadcast.emit)
 socket.broadcast.emit('sendMessageFromBack', "New user connected");

socket.broadcast.emit est presque identique à io.emit :

socket.broadcast.emit va envoyer le message à tous les Frontend sauf celui qui vient d’initialiser le web socket
io.emit va envoyer le message à tous les Frontend sans exception
2.9 RECEVOIR UN MESSAGE DEPUIS LE FRONTEND
import React, {useEffect} from 'react';
import {Button} from "react-native";

import socketIOClient from "socket.io-client";

var socket = socketIOClient("https://...");

export default function App() {

 useEffect(() => {
   
   socket.on('sendMessageFromBack', (newMessage)=> {
     console.log(newMessage);
   });
   
 }, []);
 
 return (
   <Button title="Send Message"
      onPress={()=> socket.emit("sendMessage", "Hello John !") }
   />
 )
 
}

Pour recevoir un message, le Frontend va devoir être à l’écoute. Pour que notre composant soit en attente de la réception d’un message, il faudra mettre cette écoute à l’initialisation de notre composant (useEffect).

Mise à l’écoute
socket.on('sendMessageFromBack', (newMessage)=> {
     console.log(newMessage);
   });

socket.on permet de mettre une écoute en place pour indiquer au Frontend quel traitement il doit effectuer à la réception du message nommé “sendMessageFromBack”.

A la réception du message, socket.on va exécuter la fonction de callback fournie. Ici, la fonction de callback affiche le message reçu dans la console.

2.10 FRONTEND : ENREGISTRER L’INFORMATION REÇUE DANS UN ÉTAT
import React, {useState, useEffect} from 'react';
import {Button} from "react-native";

import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://...");

export default function App() {

 const [message, setMessage] = useState("");
 
 useEffect(() => {
   socket.on('sendMessageFromBack', (newMessage)=> {
      setMessage(newMessage);
   });
   
 }, [message]);
 
 return (
   <Button title="Send Message"
      onPress={()=> socket.emit("sendMessage", "Hello John !") }
   />
 )
 
}

Nous souhaitons pouvoir stocker l’information envoyée par notre Backend pour pouvoir ensuite l’exploiter dans notre composant (pour l’afficher par exemple).

Initialisation de l’état
const [message, setMessage] = useState("");

On initialise une variable d’état “message” dans laquelle on stockera les informations reçues.

Capter les modifications de l’état
useEffect(() => {
   ...
   
 }, [message]);

À l’initialisation et pour chaque modification de notre état “message”, nous allons exécuter la fonction de callback fournie au useEffect afin de récupérer une éventuelle mise à jour de l’état “message” (notamment dans le cas où il peut s’agir d’un tableau dans lequel nous devons push)

Mise en place d’une nouvelle écoute
socket.on('sendMessageFromBack', (newMessage)=> {
      setMessage(newMessage);
   });

Nous mettons en place une nouvelle écoute qui permettra, à la réception du message, de mettre à jour la variable d’état “message” avec le message envoyé par le Backend.

Dans notre exemple:

À l’initialisation du composant, la fonction de callback est appelée, une écoute sur le message sendMessageFromBack est mise en place
Lorsque le Backend envoie ce message, l’écoute est déclenchée, la variable d’état “message” est mise à jour
Comme l’état “message” a été modifié, le useEffect se déclenche, il annule l’écoute et met en place une nouvelle écoute

J'ai lu cette partie
