'use strict';

/**
 * @ngdoc function
 * @name uidemoApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the uidemoApp
 */
angular.module('uidemoApp')
  .controller('MessagesCtrl', function ($scope,$state,$stateParams,$firebaseObject,$compile) {
    $scope.room = $stateParams.room;

    if($scope.room){
    	//Close slidebar;
    	$.slidebars.close();
    	var config = { 
    		label: $scope.room.caption,
    		pacing:10 // Khoang cach giua cac box,
    	};
	    // Init
	    
		var chat = chatta(config).init(function(chat){});
		chat.setUser({
			name:$scope.currentAuth.displayName,
			email: $scope.currentAuth.email
		});
		chat.hideUserFields(true);
		chat.showTab(true);
		chat.toggleBox();
		
		chat.on('anySubmission',function(e){
			SiriNova.sendMessage($scope.currentAuth.uid,$scope.room.$id,chat.$chattaMessageBox.val(),function(key){
				chat.$chattaMessageBox.val('');
			})
		});
		chat.on('mssgKeyup',function(e){
			// console.log('mssgKeyup');
		});
		$scope.chatBoxs.push(chat);

		var roomMessageRef = firebase.database().ref('rooms/'+$scope.room.$id+'/messages');
    	var messageRef = firebase.database().ref('messages');
    	$scope.messages = [];
    	roomMessageRef.on('child_added',function(snapshot,prevChildKey){
    		var message = $firebaseObject(messageRef.child(snapshot.key));
    		message.$loaded().then(function(){
    			if(message.senderId == $scope.currentAuth.uid){
	    			chat.addMessage({
				        from: $scope.currentAuth.displayName,
				        content: message.message,
				        date: new Date(),
				        isRight: true,
				        avatarSrc: $scope.currentAuth.photoURL,
				        compile: $compile,
				        scope:$scope
				     });
	    		}else{
	    			chat.addMessage({
				        from: $scope.friendProfiles[message.senderId].username,
				        content: message.message,
				        date: new Date(),
				        isRight: false,
				        avatarSrc: $scope.friendProfiles[message.senderId].profileImage,
				        compile: $compile,
				        scope:$scope
				     });
	    		}
    		});
    		
    	});


    }
    // Optional config object
    
    
  });
