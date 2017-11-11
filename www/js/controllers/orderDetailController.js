ecommerce.controller('orderDetailController', function ($scope, $stateParams, $http, $state, showAlertService, ionicLoading, $rootScope) {
    $scope.order = $stateParams.order;
    //============================================================================================  
    //getting single Product data from server
    $scope.getSingleProductDetail = function (id) {
        ionicLoading("show");
        var data = {};
        data.products_id = id;
        data.language_id = $rootScope.languageId;
        $http.post($rootScope.mainUrl + 'getAllProducts', data).then(function (response) {
            ionicLoading("hide");
            if (response.data.success == 1) {
                $state.go('menu.productDetail', { data: response.data.product_data[0] });
            }
            if (response.data.success == 0) {
                showAlertService("Product not Available!")
            }
        }, function (response) {
            ionicLoading("hide");
            showAlertService("Server Error while loading Product");
            console.log(response);
        });
    };
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.enter', function () {
        $rootScope.footerTabsView = true;
    });
});