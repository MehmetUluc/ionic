ecommerce.controller('homeController', function ($http, $cordovaToast,$localStorage, $anchorScroll, $location, $ionicScrollDelegate, ionicLoading, addToCartService, $rootScope, $state, $scope, showAlertService, $ionicSideMenuDelegate) {

    //declaring variable for products
    $rootScope.products = [];
    //variable to enable disable infinite Scroll
    $scope.falseInfinte = true;
    //variable for category id
    $rootScope.catId = '';
    //page varible for products while getting from server
    var page = 0;
    //this variable keep the old product loaded unless it get new products form server
    var emptyProductArray = false;
    $scope.hideScrollButton = true;
    $scope.showHeaderTabs = false;
    $scope.slideClickedIndex = 0;
    $scope.hidefooter = false;
    //============================================================================================
    //function to change the top tabs
    //var count = 0;//variable to stop running ionic loading first time
    $scope.changeTab = function (value) {
        $scope.tab = value;
        // if (count == 0) { count++; return 0; }
        //  ionicLoading('', 500);
    }

    //diabling swiping open menu
    $ionicSideMenuDelegate.canDragContent(false);

    //============================================================================================
    //reset filters
    $scope.resetFilter = function () {
        ionicLoading("", 500);// ionic loading
        emptyProductArray = true;//this variable keep the old product loaded unless it get new products form server
        $rootScope.clearFilter();//clearing the filters selected funtion(filter controller)
        $scope.falseInfinte = true;//enabling infinite scroll
        page = 0;
        $rootScope.getFilters($rootScope.catId);//getting filters funtion(filter controller)
        $rootScope.filter = 0;
        $scope.loadMore();//loadding more products from server
    }
    //============================================================================================
    //calling function to apply filter on the products
    $rootScope.applyFilter = function () {
        ionicLoading("", 500);
        $scope.falseInfinte = true;//enabling infinite scroll
        page = 0;
        //$rootScope.products = [];
        emptyProductArray = true;//this variable keep the old product loaded unless it get new products form server
        $rootScope.filter = 1;
        $scope.loadMore();
        setTimeout(function () {
            ionicLoading("", 1000);
            $ionicSideMenuDelegate.toggleRight();//closing filter menu
        }, 1000);
    };
    //============================================================================================
    // function to set the id of the categories to filter the products also resetting the filter and proeducts
    $scope.setCategoryId = function (id) {
        ionicLoading("", 500);
        if (id != $rootScope.catId) {// avoid reloading, loaded tab.
            $rootScope.clearFilter();//clearing the filters selected funtion(filter controller)
            $rootScope.filter = 0;
            $scope.falseInfinte = true;
            page = 0;
            $rootScope.catId = id;//setting category id selected
            $rootScope.getFilters(id);//getting filters funtion(filter controller)
            emptyProductArray = true;//this variable keep the old product loaded unless it get new products form server
            $scope.loadMore();//loadding more products from server
        }
    };
    //============================================================================================
    //getting products from server and saving it in products array
    $rootScope.getAllProducts = function (page) {

        if ($scope.falseInfinte == false) { return 0; }

        var data = {};//object to pass data for service called
        if ($rootScope.customerData == null)
            data.customers_id = null;// if user are not logged in
        else//in case user is logged in customer id will be send to the server to get user liked products
            data.customers_id = $rootScope.customerData.customers_id;

        data.page_number = page;// sending page number to server
        data.categories_id = $rootScope.catId;//sending category id
        data.language_id = $rootScope.languageId;
        // data.filters = $rootScope.filterArray;//in case user apply filters
        // data.price = $rootScope.filterPrice;
        $scope.serviceRunning = true;// variable will be true untill we get response from the server
        $http.post($rootScope.mainUrl + 'getAllProducts', data).then(function (response) {
            var noOfProducts = response.data.product_data.length;
            $scope.serviceRunning = false;//telling application service received the result
            if (response.data.success == 1) {//if we get data successfully from the server
                if (emptyProductArray == true) { $rootScope.products = []; emptyProductArray = false; }//now removing previouc loaded products
                for (i = 0; i < noOfProducts; i++) {
                    $rootScope.products.push(response.data.product_data[i]);//pushing products one by one
                }
                $scope.totalProducts = response.data.total_record;//getting number of total products available
                setTimeout(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');//stopping infinite scroll loader
                }, 1000);

            }
            if (response.data.success == 0) {
                setTimeout(function () {
                    $scope.falseInfinte = false;//disabling infinite scroll
                    $scope.$broadcast('scroll.infiniteScrollComplete');//stopping infinite scroll loader
                }, 1000);
                if (page == 0) {
                    //   console.log("0 page");
                    if (emptyProductArray == true) { $rootScope.products = []; emptyProductArray = false; }
                    $rootScope.products = [];
                    document.addEventListener("deviceready", function () {
                        $cordovaToast.show('No Product found!', 'short', 'bottom');//android toast
                    }, false);
                    $scope.totalProducts = response.data.total_record;
                }
                else {
                    if ($rootScope.products.length != 0) {
                        document.addEventListener("deviceready", function () {
                            $cordovaToast.show('Tüm Ürünler Yüklendi', 'short', 'bottom');//android toast 
                        }, false);
                    }
                }
            }
        }, function (response) {
            $scope.serviceRunning = false;//telling application service is running
            ionicLoading("hide");
            //showAlertService("Error while loading Products from the server");
        });
    };

    //============================================================================================
    //load more data form server
    $scope.loadMore = function () {
        $rootScope.getAllProducts(page);
        page++;// incrementing the page number
    };
    $scope.loadMore();

    //===============================================================================================
    //change Layout
    $scope.changeLayout = function (a) {
        $rootScope.productsLayout = a;
    };
    //===========================================================================================
    //updating data after user like or dislike the product
    var updateArray = function (id, array, value) {
        var val = value;
        // if (value == 'like')
        //     val = 1;
        array.some(function (value, index) {
            if (value.products_id == id) {
                value.isLiked = val;
                return 0;
            }
        });
    }
    //============================================================================================
    //like dislike product
    $rootScope.likeProduct = function (product, array) {

        if ($rootScope.customerData == null) {//checking user is logged in or not
            $scope.showModal("login");
        }
        else {
            ionicLoading('show');
            var url = 'unlikeProduct';
            if (product.isLiked == '0') {
                url = 'likeProduct';
            }
            var data = {};
            data.liked_customers_id = $rootScope.customerData.customers_id;
            data.liked_products_id = product.products_id;
            $http.post($rootScope.mainUrl + url, data).then(function (response) {

                if (response.data.success == 1) {
                    if (product.isLiked == '1') { product.isLiked = 0; product.products_liked--; }
                    else { product.isLiked = 1; product.products_liked++; }
                    var value = product.isLiked;
                    //  console.log(value);
                    var id = product.products_id;
                    //updating the array that user has selected or deselected the heart icon
                    updateArray(id, $rootScope.topSellers, value);
                    updateArray(id, $rootScope.mostLiked, value);
                    updateArray(id, $rootScope.special, value);
                    updateArray(id, $rootScope.recentViewedArray, value);
                    updateArray(id, $rootScope.products, value);
                    if (array != null || array != undefined) {
                        updateArray(id, array, value);
                    }


                    ionicLoading('hide');
                }
                // showAlertService(response.data.message);
            },
                function (response) {
                    ionicLoading('hide');
                    showAlertService(response.data.message);
                });
        }
    };
    //============================================================================================
    //adding product to the cart
    $scope.addToCart = function (product) {
        addToCartService(product, []);
    };
    $scope.tabFilter = function (item) {
        if (item.parent_id != 0) {
            return true;
        }
    };
    //===============================================================================================
    //go to specific page and also storing item in recent Viewed
    $scope.showProductDetail = function (product) {
        ionicLoading("", 1000);
        $state.go('menu.productDetail', { 'data': product });
    };
    //===============================================================================================
    //Disable reset button
    $scope.disableResetButton = function () {
        if ($rootScope.filterArray.length != 0)
            return false;
        else if ($rootScope.filterPrice.minPrice != 0)
            return false;
        else if ($rootScope.filterPrice.maxPrice != 1000)
            return false;
        else
            return true;
    };
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.enter', function () {
        if ($scope.tempId != $rootScope.catId)
            $rootScope.getFilters($rootScope.catId);//getting filters funtion(filter controller)
    });
    //================================================================================
    //on view beforeEnter
    $scope.$on('$ionicView.beforeEnter', function () {
        $rootScope.productPage = false;//varible for apply filter button
        $rootScope.footerTabsView = true;
    });
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.leave', function () {
        $scope.tempId = $rootScope.catId;
    });
    //============================================================================================
    //getting list of procducts from the server
    $scope.getToSubCategoryProducts = function (name, id, temp) {
        if (temp == undefined) temp = 4;
        ionicLoading("", 500);
        $state.go('menu.subcategories', { name: name, mainId: id, tempName: temp });//opening sub categories page with template 4
    };
    //============================================================================================
    //scroll to top page
    var scrollLastPostion = 0;
    $scope.onScroll = function () {
        var top = $('.sticky-tabs').offset().top - 44;
        var pos = $ionicScrollDelegate.$getByHandle('home').getScrollPosition().top;
        // console.log(pos);
        if (top <= 0 && $scope.showHeaderTabs == false) { $scope.showHeaderTabs = true; moveTabs(); }
        if (top >= 0 && $scope.showHeaderTabs == true) { $scope.showHeaderTabs = false; moveTabs(); }

        if (pos >= 1000 && $scope.hideScrollButton == true) $scope.hideScrollButton = false;
        if (pos <= 1000 && $scope.hideScrollButton == false) $scope.hideScrollButton = true;

        if (pos > scrollLastPostion) { $scope.hideFooterr(); scrollLastPostion = pos; }
        if (pos < scrollLastPostion) { $scope.showFooter(); scrollLastPostion = pos; }
        $scope.safeApply();
    };
    //============================================================================================
    //scroll to top page
    $scope.scrollToTop = function () {
        if ($rootScope.products.length > 6) {
            $location.hash('scrollTo');
            $ionicScrollDelegate.anchorScroll(true);
            setTimeout(function () {
                //console.log("onscroll called");
                $scope.onScroll();
            }, 100);
        }
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
    //on click image banners
    $scope.imageClick = function (image) {
      //  console.log(image);
        if (image.type == 'category') {
            $state.go('menu.products', { 'catId': parseInt(image.url) });
        }
        else if (image.type == 'product') {
            $scope.getSingleProductDetail(parseInt(image.url));
        }
        else {
            $state.go('menu.products', { 'sort': image.type });
        }
    };
    //============================================================================================
    //getting single Product data from server
    $scope.getSingleProductDetail = function (id) {
        ionicLoading("show");
        var data = {};//object to pass data for service called
        if ($rootScope.customerData == null)
            data.customers_id = null;// if user are not logged in
        else//in case user is logged in customer id will be send to the server to get user liked products
            data.customers_id = $rootScope.customerData.customers_id;
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
            //showAlertService("Error server not reponding");
        });
    };
    //============================================================================================
    //functions called when array loaded in the html also initializing swiper variables
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        //initializing top banners
        var swiper = new Swiper('.home-swiper', {
            pagination: '.swiper-pagination',
            autoplay: 5000,
            preventClicks: true,
            autoplayDisableOnInteraction: true
        });
    });
    //no of slides per tab
    var slidesPerView = 2.2;
    // space between slides.
    var spaceBetweenSlide = 8;
    $scope.$on('ngRepeatFinished2', function (ngRepeatFinishedEvent) {
        //initializing top seller mostLiked , special deals products for home-version-1
        var swiper2 = new Swiper('.product-swiper', {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetweenSlide,
            observer: false,
        });
    });
    $scope.$on('ngRepeatFinishedTopSeller', function (ngRepeatFinishedEvent) {
        //initializing top seller products for home-version-2
        var swiper2 = new Swiper('.topSellers', {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetweenSlide,
            observer: false,
        });
    });
    $scope.$on('ngRepeatFinishedDeals', function (ngRepeatFinishedEvent) {
        //initializing special deals products for home-version-2
        var swiper2 = new Swiper('.deals', {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetweenSlide,
            observer: false,
        });
    });
    $scope.$on('ngRepeatFinishedMostLiked', function (ngRepeatFinishedEvent) {
        //initializing most Liked products for home-version-2
        var swiper2 = new Swiper('.mostLiked', {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetweenSlide,
            observer: false,
        });
    });
    $scope.$on('ngRepeatFinished3', function (ngRepeatFinishedEvent) {
        //initializing recent viewed products for home-version-1,home-version-4
        var swiper3 = new Swiper('.recent-swiper', {
            slidesPerView: slidesPerView,
            spaceBetween: spaceBetweenSlide,
            observer: true,
        });
    });
    var swiper4;
    $scope.$on('ngRepeatFinished4', function (ngRepeatFinishedEvent) {
        //initializing sub categories sliding tabs  products for home-version-1,home-version-3
        swiper4 = new Swiper('.tabs-all-swiper', {
            slidesPerView: 'auto',
            spaceBetween: 12,

        });
    });
    //================================================================================
    //funciton to keeps the selected tab on front
    var moveTabs = function () {
        try {
            var i = $('.tabs-swiper-slide-active').index();
            swiper4[0].slideTo(i, 0, true);
            swiper4[1].slideTo(i, 0, true);
            swiper4[2].slideTo(i, 0, true);
            swiper4[3].slideTo(i, 0, true);
        } catch (Error) { }
    };


});
