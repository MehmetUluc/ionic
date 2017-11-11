ecommerce.controller('searchController', function ($scope, $rootScope, $ionicScrollDelegate, $http, showAlertService, ionicLoading, $state) {

    $scope.search = '';
    $scope.searchResult = [];
    $rootScope.searchPage = true;

    //============================================================================================  
    //resetting the search page
    $scope.resetSearch = function () {
        $scope.searchResult = [];
        page = 0;
    };
    $scope.onChangeKeyword = function (search) {
        // if (search != undefined) {
        if (search == undefined || search.length == 0 || search == null || search == '')
            $scope.searchResult = [];
        //  }
    }
    //============================================================================================  
    //getting list of procducts from the server
    $scope.getSubProducts = function (name, id) {
        ionicLoading("", 500);
        $state.go('menu.products', { 'name': name, 'catId': id });
    };
    //============================================================================================  
    //getting list of sub categories from the server
    $scope.getSubCategories = function (name, id) {
        ionicLoading("", 500);
        $state.go('menu.subcategories', { name: name, mainId: id });
    };

    //================================================================================
    //on view enter
    $scope.getSearchData = function (value) {
        var data = {};
        data.searchValue = value;
        if (data.searchValue != undefined) {
            if (data.searchValue == null || data.searchValue == ' ') {
                console.log("empty " + value);
                showAlertService("Please enter something ");
                return 0;
            }
        }
        else {
            showAlertService("Please enter something ");
            return 0;
        }

        ionicLoading('show');

        $http.post($rootScope.mainUrl + 'getSearchData', data).then(function (response) {
            if (response.data.success == 1) {
                $scope.searchResult = response.data.product_data;
                $scope.searchedWord = value;
                ionicLoading('hide');
                // showAlertService(response.data.message);
            }
            if (response.data.success == 0) {
                ionicLoading('hide');
                showAlertService(response.data.message);
            }
        }, function (response) {
            ionicLoading("hide");
            showAlertService("Server Error while loading Products");
            console.log(response);
        });
    };
    //============================================================================================  
    //scroll to top page
    var scrollLastPostion = 0;
    $scope.onScroll = function () {
        var pos = $ionicScrollDelegate.$getByHandle('search').getScrollPosition().top;
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
    //===============================================================================================
    //opening product detail page
    $scope.showProductDetail = function (data) {
        ionicLoading("", 1000);
        $state.go('menu.productDetail', { data: data });
    }
    //============================================================================================  
    //getting list of procducts from the server
    $scope.getProducts = function (name, id) {
        ionicLoading("", 500);
        $state.go('menu.products', { 'name': name, 'catId': id });
    };
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.footerTabsView = true;
    });
});