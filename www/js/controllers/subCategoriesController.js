ecommerce.controller('subCategoriesController', function ($scope,$ionicScrollDelegate, $rootScope, $http, $stateParams, showAlertService, ionicLoading, $state) {

    $scope.mainId = $stateParams.mainId;
    $scope.name = $stateParams.name;

    //============================================================================================  
    //getting list of procducts from the server
    $scope.getProducts = function (name, id) {
        ionicLoading("", 500);
        $state.go('menu.products', { 'name': name, 'catId': id });
    };
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.enter', function () {
        $rootScope.footerTabsView = true;
    });
    //============================================================================================  
    //scroll to top page
    var scrollLastPostion = 0;
    $scope.onScroll = function () {
        var pos = $ionicScrollDelegate.$getByHandle('subCategory').getScrollPosition().top;
        if (pos > scrollLastPostion) { $scope.hideFooterr(); scrollLastPostion = pos; }
        if (pos < scrollLastPostion) { $scope.showFooter(); scrollLastPostion = pos; }
        $scope.safeApply();
    };
    //===============================================================================================
    //on swipe up 
    $scope.hideFooterr = function () {
        if ($rootScope.footerTabsView == true) {
            $rootScope.footerTabsView = false;
            $scope.safeApply();
            //   console.log($scope.hideSubheader);
        }
    };
    //===============================================================================================
    //on swipe up 
    $scope.showFooter = function () {
        if ($rootScope.footerTabsView == false) {
            $rootScope.footerTabsView = true;
            $scope.safeApply();
            //   console.log($scope.hideSubheader);
        }
    };
});