ecommerce.controller('updateShippingAddressController', function ($scope, $http, $ionicModal, ionicLoading, $rootScope, $state, showAlertService) {

	//getting countries from the server
	$scope.getCountries();
	$rootScope.shippingData = {};
	//============================================================================================  
	//adding shipping address of the user
	$scope.addShippingAddress = function (form) {

		if (form.$valid) {
			ionicLoading("show");
			$rootScope.shippingData.customers_id = $rootScope.customerData.customers_id;
			var data = $rootScope.shippingData;
			data.entry_state = data.delivery_zone;
			data.entry_zone = data.delivery_zone;
			$http.post($rootScope.mainUrl + 'addShippingAddress', data).then(function (response) {
				ionicLoading("hide");
				$scope.hideModal('updateShipping');
				showAlertService(response.data.message);
				//$state.go('menu.home');
				$state.reload();
			}, function (response) {
				ionicLoading("hide");
				console.log(response);
			});
		}
		else {
			showAlertService("please fill all fields");
		}
	};
	//============================================================================================  
	//updating shipping address of the user
	$scope.updateShippingAddress = function (form, id) {

		if (form.$valid) {
			ionicLoading("show");
			$rootScope.shippingData.customers_id = $rootScope.customerData.customers_id;
			var data = $rootScope.shippingData;
			data.entry_state = data.delivery_zone;
			data.entry_zone = data.delivery_zone;
			$http.post($rootScope.mainUrl + 'updateShippingAddress', data).then(function (response) {
				ionicLoading("hide");
				if (response.data.success == 1) {
					$scope.hideModal('updateShipping');
					showAlertService(response.data.message);
					$state.reload()
				}
			}, function (response) {
				ionicLoading("hide");
				console.log(response);
			});
			console.log($rootScope.orderDetails);
		}
		else {
			showAlertService("please fill all fields");
		}
	};
	$scope.showButton = false;
	//============================================================================================  
	//setting button for updating or adding the user
	$rootScope.showButton = function (value) {
		if (value == 1)
			$scope.showButton = true;//if true then update button will be visible
		else
			$scope.showButton = false;//if false then add new button will be visible
	};
	//============================================================================================ 
	// Execute action on hide modal
	$scope.$on('modal.hidden', function () {
		//$state.reload();//reloading the current view after modal is hide
	});

	//=======================================================================================
	//onchange
	$scope.countrySelect = function (c) {
		$rootScope.shippingData.entry_country_id = c.countries_id;
		$rootScope.shippingData.entry_country_name = c.countries_name;
		$rootScope.shippingData.delivery_zone = null;
		$scope.getZones(c.countries_id);
		$scope.closeModal();
	};

	//=======================================================================================
	//onchange
	$scope.zoneSelect = function (c) {
		if (c == 'other') {
			console.log(c);
			$rootScope.shippingData.delivery_zone = 'other';
			$rootScope.shippingData.entry_zone_id = 0;
		}

		else {
			$rootScope.shippingData.delivery_zone = c.zone_name;
			$rootScope.shippingData.entry_zone_id = c.zone_id;
		}
		$scope.closeModal();
	};

	$ionicModal.fromTemplateUrl('templates/modals/select-country.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;
	});
	$scope.enableCounties = true;
	$scope.openModal = function (m) {
		if (m == 'country')
			$scope.enableCounties = true;
		else
			$scope.enableCounties = false;
		$scope.modal.show();
	};
	$scope.closeModal = function () {
		$scope.modal.hide();
	};
	if ($rootScope.zones.length == 0)
		$scope.getZones($rootScope.shippingData.countries_id);
});