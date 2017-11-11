ecommerce.controller('billingAddressController', function ($scope, $ionicModal, $stateParams, $rootScope, $state, showAlertService) {

    var view = 'shippingMethod';
    $scope.defaultCheckBox = true;
    //============================================================================================
    //funtion validaing the address and going to next page
    $scope.addBillingAddress = function (form) {
        if (form.$valid) {
            $state.go(view);
        }
        else {
            showAlertService("Please fill all fields correctly!");
        }
    };
    //============================================================================================
    //funtion setting default address
    $scope.defaultAddress = function (defaultCheckBox) {
        //  console.log($rootScope.orderDetails);
        if (defaultCheckBox == true) {
            $rootScope.orderDetails.billing_firstname = $rootScope.orderDetails.delivery_firstname;
            $rootScope.orderDetails.billing_lastname = $rootScope.orderDetails.delivery_lastname;
            $rootScope.orderDetails.billing_state = $rootScope.orderDetails.delivery_state;
            $rootScope.orderDetails.billing_city = $rootScope.orderDetails.delivery_city;
            $rootScope.orderDetails.billing_country = $rootScope.orderDetails.delivery_country;
            $rootScope.orderDetails.billing_postcode = $rootScope.orderDetails.delivery_postcode;
           // $rootScope.orderDetails.billing_telephone = $rootScope.orderDetails.delivery_telephone;
            $rootScope.orderDetails.billing_zone = $rootScope.orderDetails.delivery_zone;
            $rootScope.orderDetails.billing_street_address = $rootScope.orderDetails.delivery_street_address;
        }
        else {
            $rootScope.orderDetails.billing_firstname = '';
            $rootScope.orderDetails.billing_lastname = '';
            $rootScope.orderDetails.billing_state = '';
            $rootScope.orderDetails.billing_city = '';
            $rootScope.orderDetails.billing_postcode = '';
           // $rootScope.orderDetails.billing_telephone = '';
            $rootScope.orderDetails.billing_country = '';
            $rootScope.orderDetails.billing_street_address = '';
            $rootScope.orderDetails.billing_zone = '';
        }
    }
    $scope.defaultAddress(true);


    // $scope.onChangeCountery = function () {
    //     var e = document.getElementById("country");
    //     var id = e.options[e.selectedIndex].id;
    //     $scope.getZones(id);
    // }
    //=======================================================================================
    //onchange
    $scope.countrySelect = function (c) {
        $rootScope.orderDetails.billing_country = c.countries_name;
        $rootScope.orderDetails.billing_zone = null;
        $scope.getZones(c.countries_id);
        $scope.closeModal();
    };

    //=======================================================================================
    //onchange
    $scope.zoneSelect = function (c) {
        if (c == 'other') {
            console.log(c);
            $rootScope.orderDetails.billing_zone = 'other';
        }

        else
            $rootScope.orderDetails.billing_zone = c.zone_name;
        $scope.closeModal();
    };

    $ionicModal.fromTemplateUrl('templates/modals/select-country.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    $scope.enableCounties = true;
    $scope.openModal = function (m) {
        if (m == 'country')
            $scope.enableCounties = true;
        else
            $scope.enableCounties = false;
        $scope.modal.show();
    };
    $scope.closeModal = function () {
        $scope.modal.hide();
    };
});
