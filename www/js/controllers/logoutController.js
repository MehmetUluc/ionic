ecommerce.controller('logoutController', function ($http, $state, ngFB, $window, ionicLoading, $localStorage, $http, showAlertService, $scope, $rootScope) {
	
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
		// removeLiked($rootScope.topSellers);
		// removeLiked($rootScope.mostLiked);
		// removeLiked($rootScope.special);
		// removeLiked($rootScope.recentViewedArray);
		// removeLiked($rootScope.products);
		$localStorage.customer = null;
		$rootScope.customerData = null;
		$rootScope.orderDetails = {};
		//$state.go('menu.home');
		// setTimeout(function () {
		//   $window.location.reload(true);
		// }, 100);

	};

    //================================================================================
    //on view enter
    $scope.$on('$ionicView.enter', function () {
        $rootScope.footerTabsView = true;
    });
});
