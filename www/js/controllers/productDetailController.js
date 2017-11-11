ecommerce.controller('productDetailController', function ($scope, $stateParams, $filter, showAlertService, $localStorage, ionicLoading, $cordovaSocialSharing, $rootScope, addToCartService, $state, calculateFinalPriceService) {
  $scope.attributes = [];
  $scope.product = $stateParams.data;
  $scope.discount_price = $scope.product.discount_price;
  $scope.product_price = $scope.product.products_price;
  //============================================================================================  
  // function to set default attributes of the product         
  $scope.defaultAttributes = function (array) {
    array.some(function (value, index) {
      //   console.log(value.option.name);
      var att = {
        products_options_id: value.option.id,
        products_options: value.option.name,
        products_options_values_id: value.values[0].id,
        options_values_price: value.values[0].price,
        price_prefix: value.values[0].price_prefix,
        products_options_values: value.values[0].value,
        name: value.values[0].value + ' ' + value.values[0].price_prefix + $filter('currency')(value.values[0].price)
      };

      $scope.attributes.push(att);
    });
    //  console.log($scope.attributes);
  };
  if ($scope.product.attributes != null && $scope.product.attributes != undefined)
    $scope.defaultAttributes($scope.product.attributes);
  // console.log($scope.attributes);
  //============================================================================================  
  //function adding attibute into array
  $scope.fillAttribues = function (val, optionID) {

     console.log(val);
     console.log($scope.attributes);
    $scope.attributes.some(function (value, index) {
      if (optionID == value.products_options_id) {
        value.products_options_values_id = val.id;
        value.options_values_price = val.price;
        value.price_prefix = val.price_prefix;
        value.products_options_values= val.value;
        value.name = val.value + ' ' + val.price_prefix + $filter('currency')(val.price)
      }
    });
    // console.log($scope.attributes);
    //calculating total price 
    $scope.calculatingTotalPrice();
  };
  //============================================================================================  
  //calculating total price  
  $scope.calculatingTotalPrice = function () {
    var price = parseFloat($scope.product.products_price);
    if ($scope.product.discount_price != null || $scope.product.discount_price != undefined)
      price = $scope.product.discount_price;
    var totalPrice = calculateFinalPriceService($scope.attributes) + parseFloat(price, 10);

    if ($scope.product.discount_price != null || $scope.product.discount_price != undefined)
      $scope.discount_price = totalPrice;
    else
      $scope.product_price = totalPrice;

  };
  $scope.calculatingTotalPrice();
  //============================================================================================  
  //adding product to the cart 
  $scope.addToCart = function (product, attArray, check) {
    // console.log(product)
    // console.log(attArray)
    addToCartService(product, attArray);
    // if (check != 1)
    //   $scope.goBack();
    $scope.attributes = [];
    $scope.defaultAttributes($scope.product.attributes);
  };
  //============================================================================================  
  //intialize swiper
  $scope.initializeSwiper = function () {
    var swiper = new Swiper('.product-detail-swiper', {
      pagination: '.swiper-pagination',
      centeredSlides: 1,
      observer: true,
      lazyLoading: true,
    });
  };
  $scope.initializeSwiper();
  //============================================================================================  
  //sharing product 
  $scope.socialShare = function (msg, image, link) {
    ionicLoading("", 1000);
    document.addEventListener("deviceready", function () {
      // alert("sharing");
      $cordovaSocialSharing
        .share(msg, 'Ecommerce', image, link) // Share via native share sheet
        .then(function (result) {
          //  showAlertService("Shared!");
          // Success!
        }, function (err) {
          // An error occured. Show a message to the user
        });
    }, false);
  };

  //===============================================================================================
  //go to specific page and also storing item in recent Viewed
  $scope.addToRecentArray = function () {
    // pushing viewed product into recentViewedArray array and in the localstorage 
    var found = 0;
    var found2 = 0;
    $rootScope.recentViewedArray.some(function (value, index) {
      if (value.products_id == $scope.product.products_id) {
        found++; return true;
      }
    });
    if (found == 0)
      $rootScope.recentViewedArray.push($scope.product);
    //storing in localstorage recently viewed items
    $localStorage.recentViewed.some(function (value, index) {
      if (value.products_id == $scope.product.products_id) {
        found2++; return true;
      }
    });
    if (found2 == 0)
      $localStorage.recentViewed.push($scope.product);
  }
  $scope.addToRecentArray();
  //================================================================================
  //on view enter
  $scope.$on('$ionicView.enter', function () {
    $rootScope.footerTabsView = true;
  });
});