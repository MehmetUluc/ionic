ecommerce.controller('cartController', function ($scope, $cordovaToast, $rootScope, $http, ionicLoading, $localStorage, showAlertService, $state) {

  //============================================================================================  
  //function calcultaing total price
  $rootScope.orderDetails.productsTotal = 0;
  $rootScope.totalPrice = function () {
    $scope.price = 0;
    angular.forEach($rootScope.cartArray, function (value, key) {
      var pp = value.final_price * value.customers_basket_quantity;
      $scope.price = $scope.price + pp;
    });
    $rootScope.total = $scope.price;
    $rootScope.orderDetails.productsTotal = $rootScope.total;
    $localStorage.cart = $rootScope.cartArray;
  };
  $rootScope.totalPrice();
  //============================================================================================  
  //function updating total price with quantity
  //function adding quantity
  $scope.qunatityPlus = function (q) {

    q.customers_basket_quantity++;
    q.subtotal = q.final_price * q.customers_basket_quantity;
    q.total = q.subtotal;
    animateCart();
    if (q.customers_basket_quantity > q.quantity) {
      q.customers_basket_quantity--;
      document.addEventListener("deviceready", function () {
        $cordovaToast.show('Product Quantity is Limited!', 'short', 'center');//android toast 
      }, false);
    }
    $rootScope.totalPrice();

  }
  //function decreasing the quantity
  $scope.qunatityMinus = function (q) {
    if (q.customers_basket_quantity == 1) {
      return 0;
      // $scope.removeCart(q.products_id); 
    }
    animateCart();
    q.customers_basket_quantity--;
    q.subtotal = q.final_price * q.customers_basket_quantity;
    q.total = q.subtotal;
    $rootScope.totalPrice();
  }
  //============================================================================================  
  //removing elemnt form cart Array
  $scope.removeCart = function (id) {
    $rootScope.cartArray.some(function (value, index) {
      //  console.log("count :" +index);
      if (value.products_id == id) {
        $rootScope.cartArray.splice(index, 1);
        // document.addEventListener("deviceready", function () {
        //   $cordovaToast.show('Removed', 'short', 'center');//android toast 
        // }, false);
        animateCart();
        return true;
      }
    });
    // $localStorage.cart = $rootScope.cartArray;
    $rootScope.totalPrice();

  };
  //============================================================================================  
  //animatiing cart
  var animateCart = function () {
    $(".badge").addClass('cart-animation');
    setTimeout(function () { $(".badge").removeClass('cart-animation'); }, 400);
  };
  //==================================================================================
  //proceed to check out
  $scope.proceedToCheckOut = function () {
    $rootScope.orderDetails.productsTotal = $rootScope.total;
    if ($rootScope.customerData != null && $rootScope.cartArray.length != 0) {
      $state.go('shippingAddress');
    }
    else if ($rootScope.customerData == null && $rootScope.cartArray.length != 0) {
      // showAlertService("You have to login first");
      $scope.showModal('login');
    }
    else if ($rootScope.cartArray.length == 0) {
      showAlertService("Please Add some Items..");
    }
  }
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
     // showAlertService("Error server not reponding");
    });
  };
  //================================================================================
  //on view enter
  $scope.$on('$ionicView.beforeEnter', function () {
    $rootScope.footerTabsView = false;
  });
});