ecommerce.controller('shippingMethodController', function ($scope, $http, $stateParams, ionicLoading, $rootScope, $state, showAlertService) {

    var view = 'order';
    $scope.shippingMethod = [];
    //============================================================================================
    //funtion validaing the address and going to next page

    $scope.addShippingMethod = function (form) {
        if (checkUserSelect() == true) {
            $state.go(view);
        }
        else {
            showAlertService("Please select Shipping method!");
        }
    };
    //================================================================================
    //calcualting products total weight
    var calculateWeight = function () {
        var pWeight = 0;
        var totalWeight = 0;
        $rootScope.cartArray.some(function (value, index) {
            pWeight = parseFloat(value.weight);
            if (value.unit == 'kg') {
                pWeight = parseFloat(value.weight) * 1000;
            }
            //  else {
            totalWeight = totalWeight + pWeight
            //   }
            //  console.log(totalWeight);
        });
        return totalWeight;
    };
    //================================================================================
    //opeing view
    $scope.getShippingMethods = function () {
        ionicLoading("show");
        var data = {};
        data.tax_zone_id = $rootScope.orderDetails.tax_zone_id;
        // data.shipping_method = $rootScope.orderDetails.shipping_method;
        // data.shipping_method = 'upsShipping';
        // data.shipping_method_code = $rootScope.orderDetails.shipping_method_code;
        data.state = $rootScope.orderDetails.delivery_state;
        data.city = $rootScope.orderDetails.delivery_city;
        data.country_id = $rootScope.orderDetails.delivery_country_id;
        data.postcode = $rootScope.orderDetails.delivery_postcode;
        data.zone = $rootScope.orderDetails.delivery_zone;
        data.street_address = $rootScope.orderDetails.delivery_street_address;
        data.products_weight = calculateWeight();
        data.products_weight_unit = 'g'
        data.products = $rootScope.cartArray;
        //     console.log(data);
        $http.post($rootScope.mainUrl + 'getRate', data).then(function (response) {
            ionicLoading("hide");
        //    console.log(response);
            if (response.data.success == 1) {
               var m = response.data.data.shippingMethods;
                $scope.shippingMethod = Object.keys(m).map(function (key) { return m[key]; });
                $rootScope.orderDetails.total_tax = response.data.data.tax;
                // $rootScope.orderDetails.total_tax = parseFloat(response.data.data.tax);
                // $rootScope.orderDetails.shipping_cost = response.data.data.value;
                // $rootScope.orderDetails.shipping_cost = $rootScope.orderDetails.shipping_cost;
            }
            if (response.data.success == 0) {
                showAlertService(response.data.message);
                $state.go('shippingAddress');
            }
        }, function (response) {
            ionicLoading("hide");
            showAlertService("server Error while calcualting shipping cost Server not responding");
        });

    };
    //============================================================================================
    //funtion validaing the address and going to next page
    $scope.setMethod = function (data) {
        //$rootScope.orderDetails.shipping_method = data.name;
        $rootScope.orderDetails.shipping_cost = data.rate;
        $rootScope.orderDetails.shipping_method = data.name + '(' + data.shipping_method + ')';
       // $rootScope.orderDetails.total_tax = data.rate;
    };
    //checking user has select the method or not.
    var checkUserSelect = function () {
        if ($rootScope.orderDetails.shipping_method != null || $rootScope.orderDetails.shipping_method != undefined) {
            return true;
        }
        else
            return false;

    }
    //================================================================================
    //on view enter
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.getShippingMethods();
    });
});
