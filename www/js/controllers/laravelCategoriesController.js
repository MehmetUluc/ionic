ecommerce.controller('laravelCategoriesController', function ($scope, $ionicScrollDelegate, $http, $cordovaToast, $rootScope, ionicLoading, $state) {


    $scope.featuredPosts = [];
    //fetching featured posts form the serve;
    var dat = {};
    dat.language_id = $rootScope.languageId;
    dat.is_feature = 1;
    $http.post(config.serverUrl + "getAllNews", dat)//setting form server
        .then(function (response) {
            $scope.featuredPosts = response.data.news_data;
        });


    //WordPress intergation
    $scope.categories = [];
    //variable to enable disable infinite Scroll
    $scope.falseInfinte = true;
    //page varible
    var page = 0;

    //============================================================================================  
    //getting list of posts from the wordpress
    $scope.getCategories = function (page) {
        if (page == 0) { $scope.categories = []; $scope.falseInfinte = true; }
        var data = {};
        data.language_id = $rootScope.languageId;
        data.page_number = page;
        $http.post($rootScope.mainUrl + 'allNewsCategories', data).then(function (response) {
            angular.forEach(response.data.data, function (child) {
                $scope.categories.push(child);
            });
            $scope.$broadcast('scroll.infiniteScrollComplete');
            if (response.data.data.length < 9) {// if we get less than 10 products then infinite scroll will de disabled
                setTimeout(function () {
                    $scope.falseInfinte = false;//disabling infinite scroll
                    $scope.$broadcast('scroll.infiniteScrollComplete');//stopping infinite scroll loader
                    if ($scope.categories.length != 0) {
                        document.addEventListener("deviceready", function () {
                            $cordovaToast.show('All Categories Loaded', 'long', 'bottom');//android toast 
                        }, false);
                    }

                }, 1000);
            }
        }, function (response) {
            console.log("Error while loading categories from the server");
            console.log(response);
        });
    };
    //============================================================================================  
    //load more data form server
    $scope.loadMore = function () {
        $scope.getCategories(page);
        page++;// incrementing the page number
    };
    $scope.loadMore();


    //========================================= tab newest categories ===============================================================================
    //WordPress intergation
    $scope.posts = [];
    //variable to enable disable infinite Scroll
    $scope.falseInfinte2 = true;
    //page varible
    var page2 = 0;
    //============================================================================================  
    //getting list of posts from the wordpress
    $scope.getPosts = function (page) {
        if (page == 0) { $scope.posts = []; $scope.falseInfinte2 = true; }
        var data = {};
        data.language_id = $rootScope.languageId;
        data.page_number = page;
        $http.post($rootScope.mainUrl + 'getAllNews', data).then(function (response) {
            if (response.data.success == 1) {
                angular.forEach(response.data.news_data, function (child, index) {
                    $scope.posts.push(child);
                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            if (response.data.news_data.length < 9) {// if we get less than 10 products then infinite scroll will de disabled
                //  setTimeout(function () {
                $scope.falseInfinte2 = false;//disabling infinite scroll
                $scope.$broadcast('scroll.infiniteScrollComplete');//stopping infinite scroll loader
                if ($scope.posts.length != 0) {
                    document.addEventListener("deviceready", function () {
                        $cordovaToast.show('All Posts Loaded', 'long', 'bottom');//android toast 
                    }, false);
                }

                //  }, 1000);
            }
        }, function (response) {
            console.log("Error while loading posts from the server");
            console.log(response);
        });
    };
    //============================================================================================  
    //load more data form server
    $scope.loadMore2 = function () {
        $scope.getPosts(page2);
        page2++;// incrementing the page number
    };
    $scope.loadMore2();

    //============================================================================================  
    //getting list of sub categories from the server
    $scope.showPostDetail = function (post) {
        ionicLoading("", 500);
        $state.go('menu.laravelPostDetail', { post: post });
    };
    //************************************************************************************************************************************************************************ */
    //============================================================================================  
    //getting list of sub categories from the server
    $scope.openPostsPage = function (name, id) {
        ionicLoading("", 500);
        $state.go('menu.laravelPosts', { name: name, id: id });
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
    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        var swiper = new Swiper('.banner-swiper', {
            pagination: '.pagination',
            autoplay: 5000,
            preventClicks: true,
            autoplayDisableOnInteraction: true
        });
    });
});