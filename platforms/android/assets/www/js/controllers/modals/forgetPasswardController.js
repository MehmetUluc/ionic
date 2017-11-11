ecommerce.controller('forgetPasswardController', function ($rootScope, showAlertService, $http, $scope) {
  $scope.loginData = {};
  $scope.errorMessage = '';
  //============================================================================================  
  //recovering password
  $scope.doLogin = function (form) {
    if (form.$valid) {
      $scope.errorMessage = '';
      var data = {};
      data.customers_email_address = $scope.loginData.customers_email_address;
      $http.post($rootScope.mainUrl + 'processForgotPassword', data).then(function (response) {
        if (response.data.success == 1) {
          $scope.hideModal('forget');
          showAlertService(response.data.message);
          $scope.loginData = {};
          $scope.errorMessage = '';
        }
        if (response.data.success == 0) {
          $scope.errorMessage = response.data.message;
        }
      });
    }
    else {
      showAlertService("please enter valid email");
    }
  };
});


