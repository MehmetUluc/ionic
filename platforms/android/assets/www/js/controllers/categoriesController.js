ecommerce.controller('categoriesController', function ($scope, $rootScope, $http, ionicLoading, $state, $stateParams,$ionicScrollDelegate) {

    //============================================================================================  
    //getting list of sub categories from the server
    $scope.getSubcategories = function (name, id) {
        ionicLoading("", 500);
        // window.location="index.html#/menu/subcategories";
        $state.go('menu.subcategories', { name: name, mainId: id, tempName: $stateParams.tempName });
    };
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
        var pos = $ionicScrollDelegate.$getByHandle('category').getScrollPosition().top;
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