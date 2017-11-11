var ecommerce = angular.module('ecommerce.controllers', []);

ecommerce.controller('menuController', function ($scope,$rootScope, $state) {

    $scope.selected = null;
    $scope.showShopList = false;
    //collapsable menu groups
    $scope.groups = [
        { name: 'Home', url: 'menu.home', icon: 'ion-android-home', items: ['1', '2', '3', '4', '5'], show: false },
        { name: 'Categories', url: 'menu.categories', icon: 'ion-grid', items: ['1', '2', '3', '4', '5','6'], show: false }
    ];

    $scope.shopPages = { name: 'Shop', url: 'menu.products', show: false };
    /*
     * if given group is the selected group, deselect it
     * else, select the given group
     */
    $scope.toggleGroup = function (group) {
        group.show = !group.show;
    };
    $scope.isGroupShown = function (group) {
        return group.show;
    };
    //opening the template touched
    $scope.openTemplate = function (url, value) {
        $scope.selected = url + value;
        $state.go(url, { tempName: value });
    };
    //opening product page
    $scope.openProducts = function (name, order) {
        $state.go('menu.products', { name: name, catId: null, sort: order });
    };

    $scope.showShopListFunc = function () {
        if ($scope.showShopList == true) $scope.showShopList = false;
        else if ($scope.showShopList == false) $scope.showShopList = true;
    }
});