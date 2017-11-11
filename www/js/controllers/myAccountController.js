ecommerce.controller('myAccountController', function ($http, $scope, ionicLoading, $ionicActionSheet, $rootScope, $cordovaCamera, $localStorage, showAlertService) {
    $scope.myAccountData = {};
    $scope.profilePicture = '';

    //============================================================================================  
    //function updating user information
    $scope.updateInfo = function (form) {
        if (!form.$valid) {
            showAlertService("Please fill all fields");
            return 0;
        }
        if ($rootScope.customerData == null) {
            showAlertService("You have to login first");
            // $window.location.reload(true);
            $scope.showModal('login');
        }
        else {
            ionicLoading("show");
            $scope.myAccountData.customers_id = $rootScope.customerData.customers_id;

            if ($scope.profilePicture == $rootScope.mainUrl + $rootScope.customerData.customers_picture) { //console.log("old picture");
                // $scope.myAccountData.customers_picture=$rootScope.customerData.customers_picture;
                $scope.myAccountData.customers_old_picture = $rootScope.customerData.customers_picture;
            }
            else if ($scope.profilePicture == '')
                $scope.myAccountData.customers_picture = null;
            else
                $scope.myAccountData.customers_picture = $scope.profilePicture;

            var data = $scope.myAccountData;
            //  console.log("post data  "+JSON.stringify(data));
            $http.post($rootScope.mainUrl + 'updateCustomerInfo', data).then(function (response) {
                ionicLoading("hide");
                if (response.data.success == 1) {
                    //   document.getElementById("updateForm").reset();
                    showAlertService(response.data.message);
                    $rootScope.customerData.customers_firstname = $scope.myAccountData.customers_firstname;
                    $rootScope.customerData.customers_lastname = $scope.myAccountData.customers_lastname;
                    $rootScope.customerData.customers_telephone = $scope.myAccountData.customers_telephone;
                    $rootScope.customerData.customers_picture = response.data.data[0].customers_picture;
                    $rootScope.customerData.customers_dob = $scope.myAccountData.customers_dob;
                    $localStorage.customer = $rootScope.customerData;
                }
            }, function (response) {
                ionicLoading("hide");
                showAlertService("Error while Updating!");
            });

        }
    };
    //============================================================================================  
    //function updating user password
    $scope.passwordData = {};
    $scope.updatePassword = function (form) {
        if (!form.$valid) {
            showAlertService("Please fill all fields");
            return 0;
        }
        if ($rootScope.customerData == null) {
            showAlertService("You have to login first");
            $scope.showModal('login');
        }
        else {
            if ($scope.passwordData.currentPassword != $rootScope.customerData.customers_password) {
                showAlertService("Please enter Correct Password");
            }
            else {
                ionicLoading("show");
                $scope.passwordData.customers_id = $rootScope.customerData.customers_id;
                var data = $scope.passwordData;
                $http.post($rootScope.mainUrl + 'updateCustomerPassword', data).then(function (response) {
                    ionicLoading("hide");
                    if (response.data.success == 1) {
                        $rootScope.customerData.customers_password = $scope.passwordData.customers_password;
                        $localStorage.customer = $rootScope.customerData;
                        showAlertService(response.data.message);
                        document.getElementById("passwordUpdateForm").reset();
                    }
                    else {
                    }
                }, function (response) {
                    ionicLoading("hide");
                    showAlertService("Server Error while changing password");
                });
            }
        }
    };
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.enter', function () {
        if ($rootScope.customerData != null) {
            $scope.myAccountData.customers_firstname = $rootScope.customerData.customers_firstname;
            $scope.myAccountData.customers_lastname = $rootScope.customerData.customers_lastname;

            $scope.profilePicture = $rootScope.mainUrl + $rootScope.customerData.customers_picture;
            $scope.myAccountData.customers_old_picture = $rootScope.customerData.customers_picture;
            $scope.myAccountData.customers_telephone = $rootScope.customerData.customers_telephone;
            $scope.myAccountData.customers_dob = new Date($rootScope.customerData.customers_dob);
        }
    });


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
                $scope.profilePicture = 'data:image/jpeg;base64,' + imageData;
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
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.enter', function () {
        $rootScope.footerTabsView = true;
    });
});