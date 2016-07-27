window.SiriNova = new function(){

	this.messageRef = firebase.database().ref('messages');
	this.roomRef = firebase.database().ref('rooms');

	this.sendMessage = function(userId,roomId,message,complete){
		console.log("send new message");
		var newMessage = this.messageRef.push({
			message: message,
			senderId: userId,
			timeStamp: new Date().getTime()
		});
		this.roomRef.child(roomId).child('messages').child(newMessage.key).set(true);
		complete(newMessage.key);
	};
};