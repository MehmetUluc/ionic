ecommerce.controller('settingsController', function ($scope, $localStorage,$http, $rootScope, $cordovaLocalNotification) {

    document.addEventListener("deviceready", function () {
        $scope.turnOnOffNotification = function (value) {
            if (value == true) {
                //  alert("enable notificaiton");
                $localStorage.settings.localNotification = true;
                $cordovaLocalNotification.update({
                    id: 1,
                    every: config.notifDuration
                    // every: config.notifDuration
                });
            }
            else {
                //   alert("disabling notification");
                $localStorage.settings.localNotification = false;
                $cordovaLocalNotification.update({
                    id: 1,
                    every: 'year'
                });

            }
        }
    }, false);

    $scope.hideShowFooterTabs = function (value) {
        if (value == true) {
            $rootScope.showFooterTabs = $localStorage.config.showFooterTabs = true;
        }
        else {
            $rootScope.showFooterTabs = $localStorage.config.showFooterTabs = false;
        }
    }
    $scope.hideShowCartButton = function (value) {
        //  console.log(value);
        if (value == true) {
            // $rootScope.settings=  
            $rootScope.settings.cartButton = $localStorage.config.showCartButton = true;
        }
        else {
            $rootScope.settings.cartButton = $localStorage.config.showCartButton = false;
        }
    }
    //================================================================================
    //turn push notification on or off
    $scope.turnOnOffPushNotification = function (value) {
        var data = value;
        $http.post($rootScope.mainUrl + 'pushOnOff', data).then(function (response) {
        }, function (response) {
            console.log(response);
        });
    };
    
    	//setting push notification for the first time
	if ($localStorage.pushNotification == undefined)
		$localStorage.pushNotification = true;
	$scope.togglePushNotification = $localStorage.pushNotification;
	//============================================================================================
	//turning on off local  notification
	$scope.onOffPushNotification = function (value) {
		var data = {};
		data.device_id = $localStorage.registrationId;
        if (value == false) data.is_notify = 0;
        else data.is_notify = 1;
       // alert(JSON.stringify(data));
		$http.post($rootScope.mainUrl + 'notify_me', data).then(function (response) {
			if (response.data.success == 1) {
				if ($localStorage.pushNotification == true)
					$localStorage.pushNotification = false;
				else
                    $localStorage.pushNotification = true;
                
            //    alert(JSON.stringify(response.data.message));
			}
		}, function (response) {
           
			//	showAlertService("Error while loading zones from the server");
			console.log(response);
		});


	};
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.cartButton = $localStorage.config.showCartButton;
        $scope.menuFooter = $localStorage.config.showFooterTabs;
        document.addEventListener("deviceready", function () {
            $scope.local_noti_is_on = $localStorage.settings.localNotification;
        });

    });



});

