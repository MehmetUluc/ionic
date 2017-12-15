ecommerce.controller('shippingAddressController', function (showAlertService, $ionicModal, $stateParams, ionicLoading, $scope, $http, $rootScope, $state) {

	var view = 'billingAddress';

	//getting countries from the server
	$scope.getCountries();
	$scope.addShipping = function (form) {
		if (form.$valid) {
			$state.go(view);
		}
		// else {
		// 	showAlertService("Please fill all fields correctly!");
		// }
	}

	$scope.allShippingAddress = [];
	//============================================================================================
	//getting addresss from server
	$scope.getAddress = function () {
		ionicLoading("show");
		var data = {};
		data.customers_id = $rootScope.customerData.customers_id;
		$http.post($rootScope.mainUrl + 'getAllAddress', data).then(function (response) {
			ionicLoading("hide");
			//$rootScope.address=response.data.data;
			if (response.data.success == 1) {
				$scope.allShippingAddress = response.data.data;
				$scope.allShippingAddress.some(function (value, index) {
					if (value.default_address != null || $scope.allShippingAddress.length == 1) {
						$rootScope.orderDetails.tax_zone_id = value.zone_id;
						$rootScope.orderDetails.delivery_firstname = value.firstname;
						$rootScope.orderDetails.delivery_lastname = value.lastname;

						$rootScope.orderDetails.delivery_country_id = value.countries_id;
						$rootScope.orderDetails.delivery_street_address = value.street;
						//$rootScope.orderDetails.delivery_telephone = $rootScope.customerData.customers_telephone;

					}
				});

			}
		},
			function (response) {
				ionicLoading("hide");
				showAlertService("Server Error while getting Address");
				console.log(response);
			});
	};
	$scope.getAddress();

	//=======================================================================================
	//onchange
	$scope.countrySelect = function (c) {
		//
	};

	//=======================================================================================
	//onchange
	$scope.zoneSelect = function (c) {
		if (c == 'other') {
			console.log(c);
			$rootScope.orderDetails.delivery_zone = 'other';
		}

		else {
			$rootScope.orderDetails.delivery_zone = c.zone_name;
			$rootScope.orderDetails.delivery_state = c.zone_name;
			$rootScope.orderDetails.tax_zone_id = c.zone_id;
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

});
