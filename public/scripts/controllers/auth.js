'use strict';

/**
 * @ngdoc function
 * @name uidemoApp.controller:MailCtrl
 * @description
 * # MailCtrl
 * Controller of the uidemoApp
 */
angular.module('uidemoApp')
  .controller('AuthCtrl',
  	function($scope,currentAuth,Auth,$state,$timeout,Profile,$firebaseArray)
  {

    $scope.$state = $state;
  	if(currentAuth != null){
  		if($state.is('login')){
  			$location.path('/app/main');
  		}
      // $scope.avatars = {};
  		$scope.currentAuth = currentAuth;
      Profile($scope.currentAuth.uid).$bindTo($scope, "profile").then(function(){
        $scope.profile.online = true;
      });
      var friendRef = firebase.database().ref('peoples').child($scope.currentAuth.uid).child('friends');
      var roomsRef = firebase.database().ref('rooms');
      $scope.friendProfiles = {};
      $scope.friends = $firebaseArray(friendRef);
      $scope.friends.$loaded().then(function(){
        angular.forEach($scope.friends, function(value, key) {
          Profile(value.$id).$bindTo($scope,'friendProfiles.'+value.$id);
        });
      });
      
      $scope.rooms = $firebaseArray(roomsRef);
  	}


  	$scope.logout = function(){
      $scope.profile.online = false;
  		Auth.$signOut();
  		location.reload();
    };

    $scope.logging = null;
    $scope.login = function(){
    	$scope.logging = true;
    	$scope.loggingBtn = 'btn-warning';
    	$scope.loggingStatus = 'Logging...';
    	try {
    		Auth.$signInWithEmailAndPassword($scope.user.email, $scope.user.password)
			.then(function(data){
				$scope.loggingBtn = 'btn-success';
				$scope.loggingStatus = 'Success!';
				$timeout(function(){
          $state.go('app.folder');
				},1000);
				
			})
			.catch(function(error) {
				$scope.logging = null;
			  // Handle Errors here.
			  	$scope.error = error.message;
			});
    	}catch(err){
    		$scope.error = err.message;
    		$scope.logging = null;
    	}
		
    };

    // Chat boxs
    $scope.chatBoxs = {};
    $scope.chatBoxs.numberActive = 3;
    $scope.chatBoxs.src = [];
    $scope.chatBoxs.push = function(chatbox) {
      if($scope.chatBoxs.src.lenght != 0){
        if($scope.chatBoxs.src[$scope.chatBoxs.numberActive-1]){
          $scope.chatBoxs.src[$scope.chatBoxs.numberActive-1].hide();
        }
        $scope.chatBoxs.src.forEach(function(val,key){
          val.goLeft();
        })
        $scope.chatBoxs.src.unshift(chatbox);
      }else{
        $scope.chatBoxs.src.unshift(chatbox);
      }
    }

    // Upload file
    $scope.uploadFile = {};
    $scope.$watch('uploadFile.src', function(val) {
      var array = $.map(val, function(value, index) {
          return [value];
      });
      try {
        $scope.uploadFile.array = $scope.uploadFile.array.concat(array);
      }catch(err){
        $scope.uploadFile.array = array;
      }
      
    });

    var count = 0
    $scope.startUpload = function(key){
      var file = $scope.uploadFile.array[key];
      var fileType = $scope.uploadFile.array[key].type;
      var fileName = $scope.uploadFile.array[key].name;
      var timeStamp = (new Date()).getTime();
      switch(fileType){
        case 'application/dicom':
          DCMParser.initWithFile(file,function(parser){
            var metaData = {
              contentType: 'application/dicom',
              customMetadata: {
                name: fileName,
                patientName: parser.patientName(),
                studyDescription: parser.studyDescription()
              }
            }
            $scope.uploadFile.array[key].uploadTask = firebase.storage().ref('DCMFiles/' +currentAuth.uid+'/'+timeStamp+'-'+fileName).put(file,metaData);
            $scope.uploadFile.array[key].uploadTask.on('state_changed', function(snapshot){
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  $scope.uploadFile.array[key].processing = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  $scope.$apply();
                  break;
              }
            }, function(error) {
              // Handle unsuccessful uploads
            }, function() {
              $timeout(1000);
              var metadata = $scope.uploadFile.array[key].uploadTask.snapshot.metadata;
              firebase.database().ref('files/').push({
                name: fileName,
                owner: currentAuth.uid,
                timeCreated: metadata.timeCreated,
                generation: metadata.generation,
                shareState: 'public',
                private: null ,             
                storagePath: metadata.fullPath,
                patientName: metadata.customMetadata.patientName,
                studyDescription: metadata.customMetadata.studyDescription
              });
              $scope.uploadFile.array[key].processing = null
              $scope.removeUploadFile(key);
            });
          });
          break;
      };
      
    }

    $scope.removeUploadFile = function(key){
      $scope.uploadFile.array.splice(key,1);
    }

  });
