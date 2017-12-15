ecommerce
  .controller('orderController', function ($localStorage, $ionicPopup, lineItemTotalService, applyCouponService, ionicLoading, $ionicHistory, $scope, validateCouponService, $http, $rootScope, $state, showAlertService) {

    $scope.orderDetail = $.extend(true, {}, $rootScope.orderDetails);//include shipping address, billing address,  shipping methods.
    $scope.products = $.extend(true, [], $rootScope.cartArray);
    $scope.couponArray = [];
    $scope.couponApplied = 0;
    $scope.tokenFromServer = null;
    $scope.discount = 0;
    $rootScope.orderDetails.payment_method = 'paypal';
    //============================================================================================
    //placing order
    $scope.addOrder = function (nonce) {
      ionicLoading("show");
      $scope.orderDetail.customers_id = $rootScope.customerData.customers_id;
      $scope.orderDetail.customers_name = $rootScope.orderDetails.delivery_firstname + " " + $rootScope.orderDetails.delivery_lastname;
      $scope.orderDetail.delivery_name = $rootScope.orderDetails.billing_firstname + " " + $rootScope.orderDetails.billing_lastname;
      $scope.orderDetail.customers_email_address = $rootScope.customerData.customers_email_address;
      $scope.orderDetail.customers_telephone = $rootScope.customerData.customers_telephone;
      $scope.orderDetail.delivery_suburb = $rootScope.orderDetails.delivery_state
      $scope.orderDetail.customers_suburb = $rootScope.orderDetails.customers_state;
      $scope.orderDetail.customers_address_format_id = '1';
      $scope.orderDetail.delivery_address_format_id = '1';
      $scope.orderDetail.products = $scope.products;
      $scope.orderDetail.is_coupon_applied = $scope.couponApplied;
      $scope.orderDetail.coupons = $scope.couponArray;
      $scope.orderDetail.coupon_amount = $scope.discount;
      $scope.orderDetail.totalPrice = $scope.totalAmountWithDisocunt;
      $scope.orderDetail.nonce = nonce;
      var data = $scope.orderDetail;
      $http.post($rootScope.mainUrl + 'addToOrder', data).then(function (response) {
        if (response.data.success == 1) {
          ionicLoading("hide");
          $rootScope.cartArray = [];
          $localStorage.cart = [];
          //  showAlertService(response.data.message);
          $state.go('menu.thankYou');
        }
        if (response.data.success == 0) { ionicLoading("hide"); showAlertService(response.data.message); }
      }, function (response) {
        ionicLoading("hide");
        showAlertService("Error server not reponding");
      });
    };
    //============================================================================================
    //getting single Product data from server
    $scope.getSingleProductDetail = function (id) {
      ionicLoading("", 1000);
      var data = {};//object to pass data for service called
      if ($rootScope.customerData == null)
        data.customers_id = null;// if user are not logged in
      else//in case user is logged in customer id will be send to the server to get user liked products
        data.customers_id = $rootScope.customerData.customers_id;
      data.products_id = id;
      $http.post($rootScope.mainUrl + 'getProductDetail', data).then(function (response) {
        if (response.data.success == 1) {
          $state.go('menu.productDetail', { data: response.data.product_data[0] });
        }
        if (response.data.success == 0) {
          showAlertService("Product not Available!");
        }
      }, function (response) {
        showAlertService("Error while fetching data from Server");
        ionicLoading("hide");
      }
      );
    };
    //============================================================================================
    //CAlculate all total
    $scope.totalDiscount = function () {
      var subTotal = 0;
      var total = 0;
      $scope.products.some(function (value) {
        subTotal += parseFloat(value.subtotal);
        total += value.total;
      });
      $scope.productsTotal = subTotal;
      $scope.discount = (subTotal - total);
    };
    //============================================================================================
    //CAlculate all total
    $scope.allTotal = function () {
      var a = lineItemTotalService($scope.products);
      var b = $scope.orderDetail.total_tax;
      var c = $scope.orderDetail.shipping_cost;
      $scope.totalAmountWithDisocunt = parseFloat(parseFloat(a) + parseFloat(b) + parseFloat(c));
      // console.log(" all total " + $scope.totalAmountWithDisocunt);
      // console.log("shipping_tax " + $scope.orderDetail.shipping_tax);
      // console.log(" shipping_cost " + $scope.orderDetail.shipping_cost);
      $scope.totalDiscount();
    };

    $scope.allTotal();



    //============================================================================================
    //getting token from server
    var settingNonce = function (value) {
      $scope.nonce = value;
      console.log("$scope.nonce " + $scope.nonce);
    }
    //============================================================================================
    //getting token from server
    $scope.getToken = function () {
      ionicLoading("show");
      $http.get($rootScope.mainUrl + 'generateBraintreeToken').then(function (response) {
        ionicLoading("hide");
        if (response.data.success == 1) {
          $scope.tokenFromServer = response.data.token;
          //$scope.braintreePaypal($scope.tokenFromServer);
          //$scope.braintreeCreditCard($scope.tokenFromServer);
          if ($rootScope.settings.paymentMethods == 'paypal')
          { }
          else
          { }
        }
        if (response.data.success == 0) {
          ionicLoading("hide");

        }
      }, function (response) {
        showAlertService("Error while continuing Process Server not responding");
        ionicLoading("hide");
      });
    };
    //================================================================================
    // braintree paypal method
    $scope.braintreePaypal = function (clientToken) {
      ionicLoading("", 2000);
      braintree.setup(clientToken, "custom", {
        paypal: {
          container: "paypal-container",
          displayName: "VcShop"
        },
        onReady: function () {

          $(document).find('#braintree-paypal-button').attr('href', 'javascript:void(0)');
        },
        onPaymentMethodReceived: function (obj) {
          //  console.log(obj.nonce);
          $scope.addOrder(obj.nonce);
        }
      });
    };
    //================================================================================
    // braintree creditcard method
    $scope.braintreeCreditCard = function (clientToken) {
      ionicLoading("", 2000);
      var braintreeForm = document.querySelector('#braintree-form');
      var braintreeSubmit = document.querySelector('input[id="braintreesubmit"]');
      braintree.client.create({
        authorization: clientToken
      }, function (clientErr, clientInstance) {
        if (clientErr) { }

        braintree.hostedFields.create({
          client: clientInstance,
          styles: {

          },
          fields: {
            number: {
              selector: '#card-number',
              placeholder: '4111 1111 1111 1111'
            },
            cvv: {
              selector: '#cvv',
              placeholder: '123'
            },
            expirationDate: {
              selector: '#expiration-date',
              placeholder: '10/2019'
            }
          }
        }, function (hostedFieldsErr, hostedFieldsInstance) {
          if (hostedFieldsErr) {
            // Handle error in Hosted Fields creation
            showAlertService("hostedFieldsErr" + hostedFieldsErr);
            console.log("hostedFieldsErr" + hostedFieldsErr);
            return;
          }

          braintreeSubmit.removeAttribute('disabled');
          braintreeForm.addEventListener('submit', function (event) {
            event.preventDefault();
            hostedFieldsInstance.tokenize(function (tokenizeErr, payload) {
              if (tokenizeErr) {
                showAlertService('Error : ' + JSON.stringify(tokenizeErr.message));
                // Handle error in Hosted Fields tokenization
                return 0;
              }
              // Put `payload.nonce` into the `payment-method-nonce` input, and then
              // submit the form. Alternatively, you could send the nonce to your server
              // with AJAX.

              document.querySelector('input[name="payment-method-nonce"]').value = payload.nonce;
              $scope.addOrder(payload.nonce);

              //  console.log(payload.nonce);

            });
          }, false);
        });
      });
    };
    //============================================================================================
    //getting token from server
    $scope.getPublishkey = function () {
      ionicLoading("show");
      $http.get($rootScope.mainUrl + 'getPaymentMethods').then(function (response) {
        ionicLoading("hide");
        if (response.data.success == 1) {
          //   console.log(response.data.data[0].publishable_key);
          var key = response.data.data[0].publishable_key;
          Stripe.setPublishableKey(key);
        }
        if (response.data.success == 0) {
          ionicLoading("hide");

        }
      }, function (response) {
        ionicLoading("hide");
        showAlertService("Error while getting Publish key");
      });
    };

    // Stripe Response Handler
    $scope.stripeCallback = function (code, result) {
      ionicLoading("", 1000);
      if (result.error) {
        showAlertService('Error : ' + result.error.message);
        console.log('it failed! error: ' + result.error.message);
      } else {
        //   console.log(result.id);
        $scope.addOrder(result.id);
      }
    };
    //================================================================================
    //opeing view
    $scope.goToView = function (view) {
      if (view == 'shippingMethod') {
        $ionicHistory.removeBackView();
      }
      $state.go(view, { data: 'order' });
    };

    //================================================================================
    //on view enter
    $scope.$on('$ionicView.enter', function () {
      // if ($rootScope.orderDetails.shipping_method == "upsShipping")
      $scope.allTotal();
    //  $scope.getToken();
      $scope.getPublishkey();
    });


    //variable to store coupon data
    $scope.coupon = null;
    //============================================================================================
    //getting getMostLikedProducts from the server
    $scope.getCoupon = function (code) {
      if (code == '' || code == null) {
        showAlertService('Please enter coupon code!');
        return 0;
      }
      ionicLoading("show");
      var data = {};
      data.code = code;
      $http.post($rootScope.mainUrl + 'getCoupon', data).then(function (response) {
        ionicLoading("hide");
        if (response.data.success == 1) {
          $scope.coupon = response.data.data[0]
          // console.log($scope.coupon)
          applyCouponCart($scope.coupon);
        }
        if (response.data.success == 0) {
          showAlertService(response.data.message);
        }
      }, function (response) {
        ionicLoading("hide");
        console.log(response);
      });

    };
    //============================================================================================
    //applying coupon on the cart
    var applyCouponCart = function (coupon) {
      //checking the coupon is valid or not

      if (validateCouponService(coupon, $scope.products, $scope.couponArray) == false) {
        return 0;
      } else {
        if (coupon.individual_use == 1) {
          $scope.products = $.extend(true, [], $rootScope.cartArray);
          $scope.couponArray = [];
          $scope.orderDetail.shipping_cost = $rootScope.orderDetails.shipping_cost;
          console.log('individual_use');
        }
        var v = {};
        v.code = coupon.code;
        v.amount = coupon.amount;
        v.product_ids = coupon.product_ids;
        v.exclude_product_ids = coupon.exclude_product_ids;
        v.product_categories = coupon.product_categories;
        v.excluded_product_categories = coupon.excluded_product_categories;
        v.discount = coupon.amount;
        v.individual_use = coupon.individual_use;
        v.free_shipping = coupon.free_shipping;
        v.discount_type = coupon.discount_type;
        //   v.limit_usage_to_x_items = coupon.limit_usage_to_x_items;
        //  v.usage_limit = coupon.usage_limit;
        // v.used_by = coupon.used_by ;
        // v.usage_limit_per_user = coupon.usage_limit_per_user ;
        // v.exclude_sale_items = coupon.exclude_sale_items;
        $scope.couponArray.push(v);
      }


      //checking for free shipping
      if (coupon.free_shipping == 1) {
        // $scope.orderDetail.shippingName = 'free shipping';
        $scope.orderDetail.shipping_cost = 0;
        //  console.log('free_shipping');
      }
      //applying coupon service
      $scope.products = applyCouponService(coupon, $scope.products);
      if ($scope.couponArray != 0) {
        $scope.couponApplied = 1;
      }
      $scope.allTotal();
    };
    //============================================================================================
    //delete Coupon
    $scope.deleteCoupon = function (code) {

      $scope.couponArray.some(function (value, index) {
        if (value.code == code) { $scope.couponArray.splice(index, 1); return true; }
      });

      $scope.products = $.extend(true, [], $rootScope.cartArray);
      $scope.orderDetail.shipping_cost = $rootScope.orderDetails.shipping_cost;

      $scope.couponArray.some(function (value) {
        //checking for free shipping
        if (value.free_shipping == true) {
          $scope.orderDetail.shippingName = 'free shipping';
          $scope.orderDetail.shippingCost = 0;
        }
        $scope.products = applyCouponService(value, $scope.products);
      });
      $scope.allTotal();
      if ($scope.couponArray == 0) {
        $scope.couponApplied = 0;
      }
    };
    //========================================================================================
//    var myPopup;
//    $scope.showCouponPopup = function () {
//      var temp = '<ul class="coupon-popup">'
//        + '<li>Cart Percentage <span>(cp9989)</span><a href="" class="pull-right" ng-click="setCouponCode(\'cp9989\')">use it</a><p>{{"A percentage discount for the entire cart"|translate}}</p></li>'
//        + '<li>Cart Fixed <span>(cf9999)</span><a href="" class="pull-right" ng-click="setCouponCode(\'cf9999\')">use it</a> <p>{{"A fixed total discount for the entire cart"|translate}}</p></li>'
//        + '<li>Product Fixed <span>(pf8787)</span><a href="" class="pull-right" ng-click="setCouponCode(\'pf8787\')">use it</a><p>{{"A fixed total discount for selected products only"|translate}}</p></li>'
//        + '<li>Product Percentage <span>(pp2233)</span><a href="" class="pull-right" ng-click="setCouponCode(\'pp2233\')">use it</a><p>{{"A percentage discount for selected products only"|translate}}</p></li>'
//        + '</ul>';
//      // Custom popup
//      myPopup = $ionicPopup.show({
//        template: temp,
//        title: 'Coupons',
//        subTitle: 'Sample codes for app demo',
//        scope: $scope,
//
//        buttons: [
//          { text: 'Cancel', type: 'button-royal' }
//        ]
//      });
//    };

    $scope.setCouponCode = function (code) {
      myPopup.close();
      $scope.c = code;
    };
  });
