'use strict';

/**
 * @ngdoc function
 * @name uidemoApp.controller:MailCtrl
 * @description
 * # MailCtrl
 * Controller of the uidemoApp
 */
angular.module('uidemoApp')
  .controller('ViewerCtrl',function ($scope,$state,$stateParams) {
    
    if($stateParams.file != null){
      $scope.file = $stateParams.file;
    }

  });
