ecommerce.controller('myOrdersController', function ($scope, $state, $http, $rootScope, ionicLoading, showAlertService) {
	$scope.orders = [];
	$scope.httpRunning = true;
	//getting all orders from server
	$scope.getOrders = function () {
		$scope.orders = [];
		$scope.httpRunning = true;
		ionicLoading("show");
		var data = {};
		data.customers_id = $rootScope.customerData.customers_id;
		data.language_id = $rootScope.languageId;
		$http.post($rootScope.mainUrl + 'getOrders', data).then(function (response) {
			ionicLoading("hide");
			$scope.httpRunning = false;
			//$rootScope.address=response.data.data;
			if (response.data.success == 1) {
				$scope.orders = [];
				$scope.orders = response.data.data;
			}
			$scope.$broadcast('scroll.refreshComplete');
		},
			function (response) {
				ionicLoading("hide");
				showAlertService("Server Error while Loading Orders");
				console.log(response);
			});
	};
	$scope.getOrders();

	$scope.showOrderDetail = function (order) {
		$state.go('menu.orderdetail', { 'order': order });
	}
	//================================================================================
	//on view enter
	$scope.$on('$ionicView.enter', function () {
		$rootScope.footerTabsView = true;
	});
});