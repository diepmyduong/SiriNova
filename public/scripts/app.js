'use strict';

/**
 * @ngdoc overview
 * @name uidemoApp
 * @description
 * # uidemoApp
 *
 * Main module of the application.
 */
var app = angular
  .module('uidemoApp', [
    'firebase',
    'ui.router',
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch'
  ])
  .run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireSignIn promise is rejected
      // and redirect the user back to the home page
      if (error === "AUTH_REQUIRED") {
        $state.go('login');
      }
    });
  }])
  .config(function($stateProvider,$urlRouterProvider,$provide){
    $urlRouterProvider.otherwise('/app/folder');

    $stateProvider
       .state('app', {    // Định ngĩa 1 state home
            url: '/app',  // khai báo Url hiển thị
            templateUrl: 'views/layout/app.html',
            controller: 'AuthCtrl',
            resolve: {
              // controller will not be loaded until $requireSignIn resolves
              // Auth refers to our $firebaseAuth wrapper in the example above
              "currentAuth": ["Auth", function(Auth) {

                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$requireSignIn();
              }]
            }

        })
        .state('app.main', {    // Định ngĩa 1 state home
            url: '/main',  // khai báo Url hiển thị
            templateUrl: 'views/main.html',  // đường dẫn view
            controller: 'MainCtrl'

        })
        .state('app.about', {    // Định ngĩa 1 state home
            url: '/about',  // khai báo Url hiển thị
            templateUrl: 'views/about.html',  // đường dẫn view
            controller: 'AboutCtrl'
        })
        .state('app.messages', {    // Định ngĩa 1 state home
            url: '/messages',  // khai báo Url hiển thị
            templateUrl: 'views/messages.html',  // đường dẫn view
            params: {
              room: null
            },
            controller: 'MessagesCtrl'
        })
        .state('app.mail', {    // Định ngĩa 1 state home
            url: '/mail',  // khai báo Url hiển thị
            templateUrl: 'views/mail.html',  // đường dẫn view
            controller: 'MailCtrl'
        })
        .state('app.folder', {    // Định ngĩa 1 state home
            url: '/folder',  // khai báo Url hiển thị
            templateUrl: 'views/folder.html',  // đường dẫn view
            controller: 'FolderCtrl'
        })
        .state('app.viewer', {    // Định ngĩa 1 state home
            url: '/viewer',  // khai báo Url hiển thị
            templateUrl: 'views/viewer.html',  // đường dẫn view
            params: {
              file: null
            },
            controller: 'ViewerCtrl'
        })
        .state('login', {    // Định ngĩa 1 state home
            url: '/login',  // khai báo Url hiển thị
            templateUrl: 'views/login.html',
            controller: 'AuthCtrl',
            resolve: {
              // controller will not be loaded until $requireSignIn resolves
              // Auth refers to our $firebaseAuth wrapper in the example above
              "currentAuth": ["Auth", function(Auth) {
                // $requireSignIn returns a promise so the resolve waits for it to complete
                // If the promise is rejected, it will throw a $stateChangeError (see above)
                return Auth.$waitForSignIn();
              }]
            }
        });
  });

