app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
]);

app.factory("Profile", ["$firebaseObject",
  function($firebaseObject) {
    return function(uid) {
      // create a reference to the database node where we will store our data
      var ref = firebase.database().ref("peoples");
      var profileRef = ref.child(uid);
      // return it as a synchronized object
      return $firebaseObject(profileRef);
    }
  }
]);


