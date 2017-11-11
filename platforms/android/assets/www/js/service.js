//========================================================================================================
//=============================== service to add product to the cart ==============================

ecommerce.service('addToCartService', function ($rootScope, $animate, $filter, checkDublicateService, $cordovaToast, calculateFinalPriceService, $localStorage) {
  return function (product, attArray) {
    var attributesArray = attArray;
    if (attArray.length == 0 || attArray == null) {
      attributesArray = [];
      if (product.attributes != undefined) {
        product.attributes.some(function (value, index) {
          var att = {
            products_options_id: value.option.id,
            products_options: value.option.name,
            products_options_values_id: value.values[0].id,
            options_values_price: value.values[0].price,
            price_prefix: value.values[0].price_prefix,
            products_options_values: value.values[0].value,
            name: value.values[0].value + ' ' + value.values[0].price_prefix + $filter('currency')(value.values[0].price)
          };
          attributesArray.push(att);
        });
      }
    }
    //  if(checkDublicateService(product.products_id,$rootScope.cartArray)==false){

    var pprice = product.products_price
    var on_sale = false;
    if (product.discount_price != null) {
      pprice = product.discount_price;
      on_sale = true;
    }

    var finalPrice = calculateFinalPriceService(attArray) + parseFloat(pprice, 10);

    $rootScope.cartArray.push({
      products_id: product.products_id,
      manufacture: product.manufacturers_name,
      customers_basket_quantity: 1,
      final_price: finalPrice,
      model: product.products_model,
      categories_id: product.categories_id,
      categories_name: product.categories_name,
      // quantity: product.products_quantity,
      weight: product.products_weight,
      on_sale: on_sale,
      unit: product.products_weight_unit,
      image: product.products_image,
      attributes: attributesArray,
      products_name: product.products_name,
      price: pprice,
      subtotal: finalPrice,
      total: finalPrice
    });
    $localStorage.cart = $rootScope.cartArray;
    // console.log($localStorage.cart);
    // } 	
    // console.log($rootScope.cartArray);
    $(".badge").addClass('cart-animation');
    setTimeout(function () { $(".badge").removeClass('cart-animation'); }, 400);

    //  });
    // document.addEventListener("deviceready", function () {
    //   $cordovaToast.show('Added to Cart', 'short', 'center');//android toast 
    // }, false);

  }
});
//========================================================================================================
//=============================== service to check duplicate ==============================
ecommerce.service('checkDublicateService', function (showAlertService) {
  return function (id, array) {
    var find = 0;
    array.some(function (value, index) {
      if (value.products_id == id) {
        // showAlertService("Product Already added");
        find++;
        return true;
      }
    });
    if (find > 0) { return true; }
    else return false;
  }
});
//========================================================================================================
//=============================== service to calculate total Price ==============================
ecommerce.service('calculateFinalPriceService', function () {
  return function (attArray) {
    var total = 0;
    attArray.some(function (value, index) {

      var attPrice = parseFloat(value.options_values_price, 10);
      if (value.price_prefix == '+') {
        //  console.log('+');
        total += attPrice;
      }
      else {
        //  console.log('-');
        total -= attPrice;
      }
    });
    // console.log("max "+total);
    return total;
  }
});
//========================================================================================================
//=============================== service to show alert message ==============================
ecommerce.service('showAlertService', function ($ionicPopup) {
  return function (message, title) {
    if (title == undefined)
      title = "Alert";
    var alertPopup = $ionicPopup.alert({
      title: title,
      animation: 'slide-in-up',
      template: message,
      buttons: [
        {
          text: 'DONE',
          type: 'button-royal'
        }
      ]
    });
  }
});
//========================================================================================================
//=============================== service to show and hide ionic Loading ==============================
ecommerce.service('ionicLoading', function ($ionicLoading) {
  return function (value, time) {
    var template = '<ion-spinner icon="ripple"></ion-spinner>';
    if (time == null || time == undefined) {
      if (value == 'show')
        $ionicLoading.show({ template: template, });
      else
        $ionicLoading.hide();
    }
    else {
      $ionicLoading.show({ template: template, });
      setTimeout(function () {
        $ionicLoading.hide();
      }, time);
    }
    setTimeout(function () {
      $ionicLoading.hide();
    }, 10000);
  }
});
ecommerce.factory('$translateUrlLoader', $translateUrlLoader);

function $translateUrlLoader($q, $http) {

  'use strict';

  return function (options) {

    if (!options || !options.url) {
      throw new Error('Couldn\'t use urlLoader since no url is given!');
    }

    var requestParams = {};

    requestParams[options.queryParameter || 'lang'] = options.key;

    return $http(angular.extend({
      url: options.url,
      params: requestParams,
      method: 'POST'
    }, options.$http))
      .then(function (result) {
        //console.log(result.data)
        return result.data.labels;
      }, function () {
        return $q.reject(options.key);
      });
  };
}