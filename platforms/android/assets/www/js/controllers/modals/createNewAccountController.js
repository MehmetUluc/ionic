ecommerce.controller('createNewAccountController', function ($http, $ionicActionSheet, $localStorage, $ionicSideMenuDelegate, $rootScope, ionicLoading, $scope, showAlertService, $cordovaCamera) {

      //variable for account data and profile image
      $scope.newAccountData = {};
      $scope.profileImage = null;
      $scope.errorMessage = '';
      //============================================================================================  
      //function creating new account 
      $scope.createNewAccount = function (form) {
            if (form.$valid) {
                  $scope.errorMessage = '';
                  if ($scope.profileImage == 'img/default_user.svg') { $scope.profileImage = ''; }
                  ionicLoading("", 1000);
                  var data = $scope.newAccountData;
                  data.customers_picture = $scope.profileImage;
                  $http.post($rootScope.mainUrl + 'processRegistration', data).then(function (response) {
                        if (response.data.success == 1) {
                              $scope.hideModal('createNewAccount');
                              $scope.hideModal('login');
                              // showAlertService(response.data.message);
                              $scope.profileImage = $scope.defaultImage;
                              $rootScope.customerData = response.data.data[0];
                              $localStorage.customer = $rootScope.customerData;
                              $scope.registerDevice();
                              $scope.newAccountData = {};
                              $scope.profileImage = null;
                              $scope.errorMessage = '';
                        }

                        if (response.data.success == 0) {
                              $scope.errorMessage = response.data.message;
                        }
                        else {
                              showAlertService(response.data.message);
                        }
                  }, function (response) {
                        // console.log(JSON.stringify(response));
                  });
            }
            else {
                  // showAlertService("please fill all fields");
            }
      };
      //============================================================================================  
      //function getting image from gallery (cordova camera plugin used)
      $scope.gettingImage = function (type) {

            ionicLoading("", 1000);
            var source = Camera.PictureSourceType.CAMERA;
            if (type == 'gallery')
                  source = Camera.PictureSourceType.PHOTOLIBRARY;

            document.addEventListener("deviceready", function () {
                  var options = {
                        quality: 50,
                        destinationType: Camera.DestinationType.DATA_URL,
                        sourceType: source,
                        allowEdit: true,
                        encodingType: Camera.EncodingType.JPEG,
                        targetWidth: 100,
                        targetHeight: 100,
                        popoverOptions: CameraPopoverOptions,
                        saveToPhotoAlbum: false,
                        correctOrientation: true
                  };

                  $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.profileImage = 'data:image/jpeg;base64,' + imageData;
                  }, function (err) {
                  });

            }, false);
      };

      //============================================================================================  
      //function for action sheet 
      $scope.actionSheet = function () {
            // Show the action sheet
            var showSheet = $ionicActionSheet.show({
                  buttons: [
                        { text: '<i class="icon ion-camera balanced"></i> From Camera' },
                        { text: '<i class="icon ion-images balanced"></i> From Gallery' }
                  ],

                  titleText: 'Select Option',
                  cancelText: 'Cancel',
                  cancel: function () {
                        // add cancel code..
                  },
                  buttonClicked: function (index) {
                        if (index == 0) {
                              $scope.gettingImage('camera');
                        }
                        else {
                              $scope.gettingImage("gallery");
                        }
                        return true;
                  }
            });

      }

});

