ecommerce.controller('wishListController', function ($scope, $cordovaToast, $rootScope, $http, showAlertService, ionicLoading, $state) {

    //variable for  array of wish List products
    $rootScope.wishList = [];
    //page varible for products while getting from server
    var page = 0;
    //variable to enable disable infinite Scroll
    $scope.falseInfinte = true;

    //============================================================================================
    //getting products from server and saving it in products array
    $scope.getWishList = function () {
        var data = {};
        data.page_number = page;
        data.type = 'wishlist';

        data.language_id = $rootScope.languageId;
        if ($rootScope.customerData == null)
            data.customers_id = null;
        else
            data.customers_id = $rootScope.customerData.customers_id;

        if ($scope.falseInfinte == false) { return 0; }
        $http.post($rootScope.mainUrl + 'getAllProducts', data).then(function (response) {
            if (response.data.success == 1) {
                for (i = 0; i < response.data.product_data.length; i++) {
                    $rootScope.wishList.push(response.data.product_data[i]);
                }
                setTimeout(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    page++;
                }, 1000);

            }
            if (response.data.success == 0) {
                setTimeout(function () {
                    $scope.falseInfinte = false;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    document.addEventListener("deviceready", function () {
                        $cordovaToast.show('Tüm Ürünler Yüklendi', 'short', 'bottom');
                    }, false);
                }, 1000);
            }
        }, function (response) {
            //showAlertService("Server Error while getting data");
            console.log(response);
        });
    };
    //============================================================================================
    //load more data form server
    $scope.loadMore = function () {
        $scope.getWishList();
    };
    // $scope.loadMore();
    //===============================================================================================
    //go to specific page and also storing item in recent Viewed
    $scope.showProductDetail = function (data) {
        ionicLoading("", 1000);
        $state.go('menu.productDetail', { data: data });
    };
    //===============================================================================================
    //go to specific page and also storing item in recent Viewed
    $scope.removeProductFromList = function (product, array) {
        $rootScope.likeProduct( product, array);

        $rootScope.wishList.some(function (value, index) {
            if (value.products_id == product.products_id) {
                $rootScope.wishList.splice(index, 1);
                return true;
            }
        });
    };
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.enter', function () {
        $rootScope.footerTabsView = true;
    });
});
