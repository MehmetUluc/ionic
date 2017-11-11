ecommerce.controller('filterController', function ($http, $scope, showAlertService, $rootScope, ionicLoading) {
    //filter array
    $rootScope.filterArray = [];
    var max = 500;
    var min = 0;
    //array for service data
    $rootScope.filterPrice = { 'minPrice': min, 'maxPrice': max };
    //============================================================================================  
    //function updating the price on change
    var onPriceChange = function (data) {
        $rootScope.filterPrice.minPrice = data.from;
        $rootScope.filterPrice.maxPrice = data.to;
        $scope.safeApply();
    };
    //============================================================================================  
    //initializing the price range slider
    $(document).ready(function () {
        $("#priceBar").ionRangeSlider({
            type: "double",
            min: min,
            max: max,
            grid: true,
            prefix: $rootScope.currencySymbol + " ",
            onChange: onPriceChange,
        });

    });
    //============================================================================================  
    //function updating the price when changed from the input
    $scope.priceUpdate = function (max) {
        console
        $("#priceBar").data("ionRangeSlider").update({
            prefix: $rootScope.currencySymbol + " ",
            min: 0,
            max: max,
            to: max,
            from: 0
        });
    };
    //============================================================================================  
    // filling filter array for keyword search 
    $scope.fillFilterArray = function (fValue, fName, keyword) {
        if (fValue == true) {
            $scope.filterArray.push({ 'name': fName, 'value': keyword });
        }
        else {
            $scope.filterArray.some(function (value, index) {
                if (value.value == keyword) {
                    $scope.filterArray.splice(index, 1);
                    return true;
                }
            });
        } //console.log($scope.filterArray);
    };

    //============================================================================================  
    // removing or reseting filter if applied any
    $rootScope.clearFilter = function (value) {
        if (value != undefined && value == 1) {
            ionicLoading('', 1000);
            $rootScope.getFilters($scope.categoryID);
        }
        $rootScope.filterPrice = { 'minPrice': min, 'maxPrice': max };
        $("#priceBar").data("ionRangeSlider").reset();
    };

    //============================================================================================  
    //getting countries from server
    $rootScope.getFilters = function (id) {
        $scope.filters = [];
        $rootScope.filterArray = [];
        $scope.categoryID = id;
        var data = {};
        data.categories_id = id;
        data.language_id = $rootScope.languageId;
        $http.post($rootScope.mainUrl + 'getFilters', data).then(function (response) {
            if (response.data.success == 1) {
                $scope.filters = response.data.filters;
            }
            $scope.priceUpdate(response.data.maxPrice);
        },
            function (response) {
                console.log(response);
                // showAlertService("Error unable to get filter from server");
            });
    };
});