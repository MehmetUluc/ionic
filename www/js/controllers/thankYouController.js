ecommerce.controller('thankYouController', function( $scope, $ionicHistory) {
	//================================================================================
    //on view enter
    $scope.$on('$ionicView.enter', function () {
        $ionicHistory.clearHistory();
    });
});