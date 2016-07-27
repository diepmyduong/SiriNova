'use strict';

/**
 * @ngdoc function
 * @name uidemoApp.controller:MailCtrl
 * @description
 * # MailCtrl
 * Controller of the uidemoApp
 */
angular.module('uidemoApp')
  .controller('FolderCtrl',function ($scope,$state,$firebaseObject) {
    
    $scope.loading = true;
    var fileRef = firebase.database().ref("files").orderByChild('owner').equalTo($scope.currentAuth.uid);
    $firebaseObject(fileRef).$bindTo($scope,'files').then(function(){
      $scope.loading = null;
    });

  	$scope.rowClick = function(file){
  		$state.go('app.viewer',{file:file});
  	}

    function getFileMetaData(path,complete){
      var fileRef = firebase.storage().ref(path);
      forestRef.getMetadata().then(function(metadata) {
        // Metadata now contains the metadata for 'images/forest.jpg'
        complete(metadata);
      }).catch(function(error) {
        // Uh-oh, an error occurred!
        console.log(error);
        complete(null);
      });
    }

  });
