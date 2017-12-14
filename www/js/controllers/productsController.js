ecommerce.controller('productsController', function ($scope, addToCartService, $translate, $ionicActionSheet, $ionicScrollDelegate, $cordovaToast, $ionicSideMenuDelegate, $rootScope, $http, $stateParams, showAlertService, ionicLoading, $state) {

    $scope.products = [];//list of products
    $rootScope.productPage = true; //varible for apply filter button
    $scope.categoryId = $stateParams.catId;// category id of the selected category
    if ($scope.categoryId == null || $scope.categoryId == '')
    { $scope.sortOrder = ''; $scope.categoryId = ''; }
    $scope.categoryName = $stateParams.name;// category name of the selected category
    $scope.sortOrder = $stateParams.sort;
    if ($scope.sortOrder == null || $scope.sortOrder == '' || $scope.sortOrder == undefined)
        $scope.sortOrder = 'newest';
    $rootScope.getFilters($scope.categoryId);//getting filters from the server
    var page = 0;//page varible for products while getting from server
    $scope.falseInfinte = true; //variable to enable disable infinite Scroll
    $scope.tabs = [];
    $scope.hideSubheader = false;
    //this variable keep the old product loaded unless it get new products form server
    var emptyProductArray = false;
    $scope.hideScrollButton = true;
    var filterApplied = false;
    //============================================================================================
    //initializing sub categories sliding tabs  products for home-version-1,home-version-3
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        //initializing sub categories sliding tabs  products for home-version-1,home-version-3
        var swiper = new Swiper('.tabs-all-swiper', {
            slidesPerView: 'auto'
        });

        var ind = $('.selected').index();
        try {
            // swiper[0].slideTo(ind, 1000, true);
            // swiper[1].slideTo(ind, 1000, true);
            swiper[2].slideTo(ind, 1000, true);

        } catch (Error) {
            swiper.slideTo(ind, 1000, true);
        }



    });
    //============================================================================================
    //Loading selected category products
    $scope.getCategoryProducts = function (tab) {
        var id = '';
        if (tab != '') id = tab.id;

        if (id != $scope.categoryId) {// avoid reloading, loaded tab.
            filterApplied = false;
            ionicLoading("", 500);
            $rootScope.clearFilter();//clearing the filters selected funtion(filter controller)
            $rootScope.filter = 0;
            $scope.falseInfinte = true;
            // $scope.sortOrder = 'newest';
            $scope.scrollToTop();
            page = 0;
            $scope.categoryId = id;//setting category id selected
            //   $scope.categoryName = $scope.categoryName(tab);
            $rootScope.getFilters(id);//getting filters funtion(filter controller)
            emptyProductArray = true;//this variable keep the old product loaded unless it get new products form server
            $scope.loadMore();//loadding more products from server
            // filterApplied = false;
        }


    };


    //============================================================================================
    //getting products from server and saving it in products array
    $scope.getProducts = function (page) {
        //   ionicLoading('', 1000);
        if ($scope.falseInfinte == false) { return 0; }
        var data = {};//object to pass data for service called
        data.page_number = page;
        data.categories_id = $scope.categoryId;
        data.type = $scope.sortOrder;
        data.language_id = $rootScope.languageId;
        if (filterApplied == true) {
            data.filters = $rootScope.filterArray;
            data.price = $rootScope.filterPrice;
        }
        if ($rootScope.customerData != null)//in case user is logged in customer id will be send to the server to get user liked products
            data.customers_id = $rootScope.customerData.customers_id;

        $http.post($rootScope.mainUrl + 'getAllProducts', data).then(function (response) {
            if (response.data.success == 1) {
                if (emptyProductArray == true) { $scope.products = []; emptyProductArray = false; $scope.scrollToTop(); }//now removing previouc loaded products
                for (i = 0; i < response.data.product_data.length; i++) {
                    $scope.products.push(response.data.product_data[i]);//pushing products one by one
                }
                $scope.totalProducts = response.data.total_record;//getting number of total products available
                setTimeout(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');//stopping infinite scroll loader
                }, 1000);
                if (response.data.product_data.length == 0) {
                    if (page == 0) {
                        document.addEventListener("deviceready", function () {
                            $cordovaToast.show('No Product found!', 'short', 'bottom');//android toast
                        }, false);
                    }
                    $scope.falseInfinte = false;//disabling infinite scroll
                    $scope.$broadcast('scroll.infiniteScrollComplete');//stopping infinite scroll loader
                }
            }
            if (response.data.success == 0) {
                //   console.log("0 success" + page);
                // setTimeout(function () {
                $scope.falseInfinte = false;//disabling infinite scroll
                $scope.$broadcast('scroll.infiniteScrollComplete');//stopping infinite scroll loader
                //  }, 1000);
                if (page == 0) {
                    //  console.log("0 page");
                    if (emptyProductArray == true) { $scope.products = []; emptyProductArray = false; }
                    $scope.products = [];
                    document.addEventListener("deviceready", function () {
                        $cordovaToast.show('No Product found!', 'short', 'bottom');//android toast
                    }, false);
                    $scope.totalProducts = response.data.total_record;
                }
                else {
                    if ($scope.products.length != 0) {
                        document.addEventListener("deviceready", function () {
                            $cordovaToast.show('Tüm Ürünler Yüklendi', 'short', 'bottom');//android toast 
                        }, false);
                    }
                }
            }
            // if (response.data.product_data.length < 9) {// if we get less than 10 products then infinite scroll will de disabled
            //     $scope.falseInfinte = false;
            //     $scope.$broadcast('scroll.infiniteScrollComplete');//stopping infinite scroll loader
            //     document.addEventListener("deviceready", function () {
            //         $cordovaToast.show('All Products Loaded', 'long', 'bottom');//android toast
            //     }, false);
            // }
        }, function (response) {
            ionicLoading("hide");
            showAlertService("Server Error while loading Products");
            console.log(response);
        });
    };
    //============================================================================================
    //load more data form server
    $scope.loadMore = function () {
        $scope.getProducts(page);
        page++;// incrementing the page number
    };
    // $scope.loadMore();
    //============================================================================================
    //resetting the page
    $scope.reset = function () {
        $scope.products = [];
        page = 0;
    };
    //============================================================================================
    //reset filters
    $scope.resetFilter = function () {
        ionicLoading("", 500);
        filterApplied = false;
        $rootScope.clearFilter();//clearing the filters selected funtion(filter controller)
        $rootScope.getFilters($scope.categoryId);//getting filters funtion(filter controller)
        $scope.falseInfinte = true;//enabling infinite scroll
        page = 0;
        $scope.reset();
        $scope.loadMore();
        $scope.scrollToTop();
    }

    //============================================================================================
    //Using back button to rest the page
    $rootScope.applyFilterProductPage = function () {
        // if ($rootScope.filterArray.length == 0 && $rootScope.filterPrice.minPrice == 0 && $rootScope.filterPrice.maxPrice == 1000) {
        //     $ionicSideMenuDelegate.toggleRight();//closing filter menu
        //     return 0;
        // }
        ionicLoading('', 1000);
        $scope.reset();
        filterApplied = true;
        $scope.falseInfinte = true;//enabling infinite scroll
        setTimeout(function () {
            // ionicLoading("", 1000);
            $scope.scrollToTop();
            $ionicSideMenuDelegate.toggleRight();//closing filter menu
        }, 1000);
        $scope.loadMore();
    };

    //===============================================================================================
    //Disable reset button
    $scope.disableResetButton = function () {
        if (filterApplied == true)
            return true;
        else
            return false;
    };
    $translate([$scope.sortOrder]).then(function (translations) {
        $scope.sortOrderText = translations[$scope.sortOrder];
    });
    //============================================================================================
    //function for action sheet
    $scope.actionSheet = function () {
        var icon = '<i class="icon ion-ios-color-filter-outline balanced"></i>';
        var sortArray = ['Newest', 'A - Z', 'Z - A', 'Price : high - low', 'Price : low - high', 'Top Seller', 'Special Products', 'Most Liked'];
        var buttonsArray = [];
        var translationsArray = [];
        $translate(sortArray).then(function (translations) {
            sortArray.some(function (value, index) {
                buttonsArray.push({ text: icon + translations[value] });
            });
            translationsArray = translations;
        });
        var titleTxt = 'Sort Products';
        var cancelTxt = 'Cancel';

        $translate(['Sort Products', 'Cancel']).then(function (translations) {
            titleTxt = translations['Sort Products'];
            cancelTxt = translations['Cancel'];

            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: buttonsArray,

                titleText: titleTxt,
                cancelText: cancelTxt,
                cancel: function () {
                    // add cancel code..
                },
                buttonClicked: function (index) {
                    console.log(translationsArray);
                    var arr = [];
                    angular.forEach(translationsArray, function (value, key) {
                        arr.push(value);
                    });
                    $scope.sortOrderText = arr[index];
                    if (index == 0) $scope.getSortProducts('newest');
                    if (index == 1) $scope.getSortProducts('a to z');
                    if (index == 2) $scope.getSortProducts('z to a');
                    if (index == 3) $scope.getSortProducts('high to low');
                    if (index == 4) $scope.getSortProducts('low to high');
                    if (index == 5) $scope.getSortProducts('top seller');
                    if (index == 6) $scope.getSortProducts('special');
                    if (index == 7) $scope.getSortProducts('most liked');
                    //   showAlertService(index);
                    hideSheet();
                    return true;
                }
            });
        });


    };
    //============================================================================================
    //Loading selected category products
    $scope.getSortProducts = function (order) {
        if (order == $scope.sortOrder)
            return 0;
        ionicLoading("", 1000);
        $rootScope.clearFilter();//clearing the filters selected funtion(filter controller)
        $rootScope.filter = 0;
        $scope.falseInfinte = true;
        $scope.sortOrder = order;
        page = 0;
        $rootScope.getFilters($scope.categoryId);//getting filters funtion(filter controller)
        emptyProductArray = true;//this variable keep the old product loaded unless it get new products form server
        $scope.loadMore();//loadding more products from server
    };
    //============================================================================================
    //scroll to top page
    var scrollLastPostion = 0;
    $scope.onScroll = function () {

        var pos = $ionicScrollDelegate.$getByHandle('products').getScrollPosition().top;
        if (pos >= 1000 && $scope.hideScrollButton == true) $scope.hideScrollButton = false;
        if (pos <= 1000 && $scope.hideScrollButton == false) $scope.hideScrollButton = true;

        if (pos > scrollLastPostion) { $scope.hideFooter(); scrollLastPostion = pos; }
        if (pos < scrollLastPostion) { $scope.showFooter(); scrollLastPostion = pos; }
        $scope.safeApply();

    };
    //===============================================================================================
    //on swipe up
    $scope.hideFooter = function () {
        if ($scope.hideSubheader == false) {
            $scope.hideSubheader = true;
            $scope.safeApply();
            //   console.log($scope.hideSubheader);
        }
    }
    //===============================================================================================
    //on swipe up
    $scope.showFooter = function () {
        if ($scope.hideSubheader == true) {
            $scope.hideSubheader = false;
            $scope.safeApply();
            //   console.log($scope.hideSubheader);
        }
    }
    //===============================================================================================
    //opening product detail page
    $scope.showProductDetail = function (data) {
        ionicLoading("", 1000);
        $state.go('menu.productDetail', { data: data });
    }
    //===============================================================================================
    //change Layout
    $scope.changeLayout = function (a) {

        $rootScope.productsLayout = a;
        $scope.scrollToTop();
    };
    $scope.tabFilter = function (item) {
        if (item.parent_id != 0) {
            return true;
        }
    };
    //============================================================================================
    //scroll to top page
    $scope.scrollToTop = function () {
        $ionicScrollDelegate.$getByHandle('products').scrollTop(true);
    };
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.beforeLeave', function () {
        $rootScope.filterArray = [];//clearing the filters selected funtion(filter controller)
        $rootScope.clearFilter();//clearing the filters price(filter controller)
    });

    //================================================================================
    //on view enter
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.productPage = true;//varible for apply filter button
        $rootScope.getFilters($scope.categoryId);
        $rootScope.footerTabsView = false;
    });

    //============================================================================================
    //adding product to the cart
    $scope.addToCart = function (product) {
        addToCartService(product, []);
    };

});
