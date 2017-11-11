ecommerce.controller('laravelPostsController', function ($scope, $ionicScrollDelegate, $stateParams, $cordovaToast, $rootScope, $http, ionicLoading, $state) {

    //WordPress intergation
    $scope.posts = [];

    $scope.name = $stateParams.name;
    $scope.id = $stateParams.id;

    //variable to enable disable infinite Scroll
    $scope.falseInfinte = true;
    //page varible
    var page = 0;
    //============================================================================================  
    //getting list of posts from the wordpress
    $scope.getPosts = function (page) {
        if (page == 0) {$scope.posts = [];$scope.falseInfinte = true;}
        var data = {};
        data.language_id = $rootScope.languageId;
        data.page_number = page;
        data.categories_id = $scope.id;
        $http.post($rootScope.mainUrl + 'getAllNews', data).then(function (response) {
            if (response.data.success == 1) {
                angular.forEach(response.data.news_data, function (child, index) {
                    $scope.posts.push(child);

                });
                $scope.$broadcast('scroll.infiniteScrollComplete');
            }
            if (response.data.news_data.length < 9 || response.data.success == 0) {// if we get less than 10 products then infinite scroll will de disabled
                console.log("end");
                //  setTimeout(function () {
                $scope.falseInfinte = false;//disabling infinite scroll
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
    $scope.loadMore = function (p) {
        if (p == 0) page = 0;
        $scope.getPosts(page);
        page++;// incrementing the page number
    };
    $scope.loadMore();
    //============================================================================================  
    //refresh posts
    // $scope.refreshPage = function () {
    //     ionicLoading("", 500);
    //     page = 1;
    //     $scope.falseInfinte = true;
    //     $scope.loadMore();
    //     $scope.posts = [];
    // };
    //============================================================================================  
    //getting list of sub categories from the server
    $scope.showPostDetail = function (post) {
        ionicLoading("", 500);
        $state.go('menu.laravelPostDetail', { post: post });
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
        var pos = $ionicScrollDelegate.$getByHandle('posts').getScrollPosition().top;
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