ecommerce.controller('contactUsController', function ($http,ionicLoading, $scope, showAlertService, $rootScope) {

	//============================================================================================
	//submitting the contact us  info
	$scope.contact = {};
	$scope.address = config.address;
	$scope.email = config.email;
	$scope.phone = config.phoneNo;
	$scope.submit = function (form) {
		if (form.$valid) {
			ionicLoading("show");
			var data = {};
			data = $scope.contact;
			$http.post($rootScope.mainUrl + 'contactUs', data).then(function (response) {
				ionicLoading("hide");
				if (response.data.success == 1) {
					$scope.contact = {};
					showAlertService(response.data.message);
				}
			}, function (response) {
				ionicLoading("hide");
				showAlertService("Error server not reponding");
			});
		}
		else {
			showAlertService("please fill all fields");
		}
	};
	var mapOptions = {
		center: new google.maps.LatLng(config.latitude, config.longitude),
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	//Wait until the map is loaded
	google.maps.event.addListenerOnce(map, 'idle', function () {

		var marker = new google.maps.Marker({
			map: map,
			animation: google.maps.Animation.DROP,
			position: new google.maps.LatLng(config.latitude, config.longitude)
		});

		var infoWindow = new google.maps.InfoWindow({
			content: config.address
		});

		google.maps.event.addListener(marker, 'click', function () {
			infoWindow.open(map, marker);
		});

	});

	//================================================================================
	//on view enter
	$scope.$on('$ionicView.enter', function () {
		$rootScope.footerTabsView = true;
	});
});
