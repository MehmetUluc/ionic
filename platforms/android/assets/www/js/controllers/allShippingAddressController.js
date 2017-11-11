ecommerce.controller('allShippingAddressController', function ($http, $scope, $rootScope, ionicLoading, showAlertService) {
	//variable to store the addresses of the user
	$scope.allShippingAddress = [];
	//============================================================================================    
	//getting addresss from server
	$scope.getAddress = function () {
		ionicLoading("show");
		var data = {};
		data.customers_id = $rootScope.customerData.customers_id;
		$http.post($rootScope.mainUrl + 'getAllAddress', data).then(function (response) {
			ionicLoading("hide");
			if (response.data.success == 1) {
				$scope.allShippingAddress = [];//reinitializing array
				$scope.allShippingAddress = response.data.data;
			}
		}, function (response) {
			ionicLoading("hide");
			showAlertService("Error server not reponding");
		});
	};
	$scope.getAddress();
	//============================================================================================  
	// delete shipping address
	$scope.deleteAddress = function (id) {
		ionicLoading("show");
		var data = {};
		data.customers_id = $rootScope.customerData.customers_id;
		data.address_book_id = id;

		$http.post($rootScope.mainUrl + 'deleteShippingAddress', data).then(function (response) {
			ionicLoading("hide");
			if (response.data.success == 1) {
				$scope.getAddress();
			}
		}, function (response) {
			ionicLoading("hide");
			showAlertService("Error server not reponding");
		});
	};
	//============================================================================================  
	// default shipping address
	$scope.defaultAddress = function (id) {
		ionicLoading("show");
		var data = {};
		data.customers_id = $rootScope.customerData.customers_id;
		data.address_book_id = id;

		$http.post($rootScope.mainUrl + 'updateDefaultAddress', data).then(function (response) {
			ionicLoading("hide");
			if (response.data.success == 1) {
				$scope.getAddress();
			}
		}, function (response) {
			ionicLoading("hide");
			showAlertService("Error server not reponding");
		});
	};
	//============================================================================================  
	//function to update the address of the user
	$scope.updateAddress = function (address) {
		$rootScope.shippingData.address_id = address.address_id;
		$rootScope.shippingData.entry_firstname = address.firstname;
		$rootScope.shippingData.entry_lastname = address.lastname;
		$rootScope.shippingData.entry_street_address = address.street;
		$rootScope.shippingData.entry_state = address.state;
		$rootScope.shippingData.entry_city = address.city;
		$rootScope.shippingData.entry_postcode = address.postcode;
		//$rootScope.orderDetails.delivery_telephone=address.;
		$rootScope.shippingData.entry_country_name = address.country_name;
		$rootScope.shippingData.entry_country_id = address.countries_id;
		//$rootScope.shippingData.countryId=address.countries_id;
		$rootScope.shippingData.delivery_zone = address.zone_name;
		$rootScope.shippingData.entry_zone_id = address.zone_id
		$rootScope.shippingData.suburb = address.suburb;
		$scope.showModal('updateShipping');
		$rootScope.showButton(1);
	};
	//================================================================================
	//on view enter
	$scope.$on('$ionicView.enter', function () {
		$rootScope.footerTabsView = true;
	});
});