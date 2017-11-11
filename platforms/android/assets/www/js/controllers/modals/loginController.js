ecommerce.controller('loginController', function ($state, ngFB, $window, ionicLoading, $localStorage, $http, showAlertService, $scope, $rootScope) {

  $scope.errorMessage = '';
  //============================================================================================  
  //logout function (facebook and google plus login)
  $rootScope.logOut = function () {

    document.addEventListener("deviceready", function () {
      ngFB.logout();
      //logout facebook account
      // $cordovaFacebook.logout()
      //   .then(function (success) {
      //     // showAlertService('logout fb');
      //     //  showAlertService(JSON.stringify(success));
      //   }, function (error) {
      //     // error
      //   });
      //logout google account
      window.plugins.googleplus.logout(
        function (msg) {
          // showAlertService(msg); // do something useful instead of alerting 
        }
      );
    }, false);
    removeLiked($rootScope.topSellers);
    removeLiked($rootScope.mostLiked);
    removeLiked($rootScope.special);
    removeLiked($rootScope.recentViewedArray);
    removeLiked($rootScope.products);
    $localStorage.customer = null;
    $rootScope.customerData = null;
    $rootScope.orderDetails = {};
    $state.go('menu.home');
    // setTimeout(function () {
    //   $window.location.reload(true);
    // }, 100);

  };
  //===========================================================================================
  //updating data loaded on home page
  var updateArray = function (array, likedArray) {
    for (var i = 0; i < likedArray.length; i++) {
      for (var j = 0; j < array.length; j++) {
        if (likedArray[i].products_id == array[j].products_id) {
          array[j].isLiked = 1;
          break;
        }
      }
    }
  };
  //===========================================================================================
  //updating data loaded on home page
  var removeLiked = function (array) {
    for (var j = 0; j < array.length; j++) {
      array[j].isLiked = 0;
      break;
    }
  };
  //============================================================================================  
  //login function 
  $scope.loginData = {};
  $scope.doLogin = function (form) {
    if (form.$valid) {
      $scope.errorMessage = '';
      ionicLoading("", 1000);
      var data = $scope.loginData;
      $http.post($rootScope.mainUrl + 'processLogin', data).then(function (response) {

        if (response.data.success == 1) {

          $rootScope.customerData = response.data.data[0];
          $localStorage.customer = $rootScope.customerData;
          // showAlertService("Welcome : " +$rootScope.customerData.customers_firstname);
          //variable to chk the user is login or not
          //  $ionicSideMenuDelegate.toggleLeft();
          $scope.hideModal('login');
          $scope.registerDevice();
          var likedProducts = response.data.data[0].liked_products;

          updateArray($rootScope.topSellers, likedProducts);
          updateArray($rootScope.mostLiked, likedProducts);
          updateArray($rootScope.special, likedProducts);
          updateArray($rootScope.recentViewedArray, likedProducts);
          updateArray($rootScope.products, likedProducts);
          $scope.loginData = {};
          $scope.errorMessage = '';
        }
        if (response.data.success == 0) {
          $scope.errorMessage = response.data.message;
        }

        else {
         // showAlertService(response.data.message);
        }
      });
    }
    else {
      showAlertService("please fill all fields");
    }
  };
  //============================================================================================  
  //facebook login function 
  $scope.facebookLogin = function () {
    ionicLoading("", 900);
    ngFB.login({ scope: 'email,read_stream,publish_actions' }).then(
      function (response) {
        // console.log(response);
        if (response.status === 'connected') {
          createAccount(response.authResponse.accessToken, 'fb');
          //   console.log('Facebook login succeeded');
        } else {
          // alert('Facebook login failed');
          console.log('Facebook login failed');
        }
      });
  };
  //============================================================================================  
  //google login function 
  $scope.googleLogin = function () {
    ionicLoading("", 500);
    window.plugins.googleplus.login(
      {
        //3D:61:08:10:58:03:52:49:52:5F:80:02:E8:2B:7B:C7:F6:DD:F6:CC
        'scopes': 'profile email ', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
        'webClientId': '642486083734-5o8gtpc97t9rg85qnd4ms3mbi5bl3ffc.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
        'offline': true // optional, but requires the webClientId - if set to true the plugin will also return a serverAuthCode, which can be used to grant offline access to a non-Google server
      },
      function (obj) {
        //creating account using google information
        createAccount(obj, 'google');
        console.log(JSON.stringify(obj));
        //  alert(JSON.stringify(obj)); // do something useful instead of alerting
      },
      function (msg) {
        console.log('error: ' + msg);
      }
    );
  };
  //============================================================================================  
  //creating new account using function facebook or google details 
  var createAccount = function (info, type) {
    ionicLoading("show");
    var data = {};
    var url = '';
    if (type == 'fb') {
      url = 'facebookRegistration';
      data.access_token = info;
    }
    else {
      url = 'googleRegistration';
      data = info;
    }

    $http.post($rootScope.mainUrl + url, data).then(function (response) {
      ionicLoading("hide");
      if (response.data.success == 1) {

        $rootScope.customerData = response.data.data[0];
        $localStorage.customer = $rootScope.customerData;
        // alert("customer data " + JSON.stringify($rootScope.customerData));
        // showAlertService("<ul> <li>Your Account Is being Created! </li> <li> Your Email is: "
        //   + $rootScope.customerData.customers_email_address + "</li> <li>Your Password is : "
        //   + $rootScope.customerData.customers_password +
        //   " </li> <li>You can login using this Email and Password. </li> <li>You Can change your password in Menu -> My Account</li></ul>");
        showAlertService("<h3>Your Account has been created successfully !</h3><ul><li>Your Email: "
          + "<span>" + $rootScope.customerData.customers_email_address + "</span>" + "</li><li>Your Password: "
          + "<span>" + $rootScope.customerData.customers_password + "</span>" +
          " </li></ul><p>You can login using this Email and Password.<br>You can change your password in Menu -> My Account</p>", "Account Information");
        //  $ionicSideMenuDelegate.toggleLeft();
        $scope.hideModal('login');
      }
      else if (response.data.success == 2) {
        $rootScope.customerData = response.data.data[0];
        $localStorage.customer = $rootScope.customerData;
        $scope.hideModal('login');
      }
      $scope.registerDevice();

    }, function (error) {
      ionicLoading("hide");
      alert("error " + JSON.stringify(error));
      console.log("error " + JSON.stringify(error));
    });
  };
});

