// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var connectedToInternet = true;
angular.module('starter', ['ionic', 'ecommerce.controllers', 'ngOpenFB', 'ngStorage', 'ngCordova', 'angularPayments', 'pascalprecht.translate'
])

  .run(function ($ionicPlatform, $localStorage, $rootScope, $http, $state, ngFB, $cordovaPushV5) {

    $http.get(config.serverUrl + "siteSetting")//setting form server
      .then(function (response) {
        var settings = response.data.data[0];
        config.fbId = settings.facebook_app_id;
        config.address = settings.address + ', ' + settings.city + ', ' + settings.state + ' ' + settings.zip + ', ' + settings.country;
        config.email = settings.contact_us_email;
        config.latitude = settings.latitude;
        config.longitude = settings.longitude;
        config.phoneNo = settings.phone_no;
        config.pushNotificationSenderId = settings.fcm_android_sender_id;
        $rootScope.lazyLoaderGif = config.lazyLoadingGif = settings.lazzy_loading_effect;
        config.newProductDuration = settings.new_product_duration;
        config.notifText = settings.notification_text;
        config.notifTitle = settings.notification_title;
        config.notifDuration = settings.notification_duration;
        $rootScope.currencySymbol = config.currency = settings.currency_symbol;
        if (settings.footer_button == "1") $rootScope.showFooterTabs = config.showFooterTabs = true;
        else $rootScope.showFooterTabs = config.showFooterTabs = false;
        if (settings.cart_button == "1") $rootScope.settings.cartButton = config.showCartButton = true;
        else $rootScope.settings.cartButton = config.showCartButton = false;


        if ($localStorage.registerPushFirstTime == undefined) {
          var options = {
            android: { senderID: config.pushNotificationSenderId },
            ios: { alert: "true", badge: "true", sound: "true" },
            windows: {}
          };
          document.addEventListener("deviceready", function () {
            //  alert("run fired device");
            $cordovaPushV5.initialize(options).then(function () {
              $cordovaPushV5.onNotification();
              $cordovaPushV5.onError();
              $cordovaPushV5.register().then(function (registrationId) {
                //    alert(registrationId);
                $localStorage.registrationId = registrationId;
              })
            });
          }, false);
          $localStorage.registerPushFirstTime = new Array;
        }
        //initializing facebook app id
        ngFB.init({ appId: config.fbId });

      });//setting form server end

    $ionicPlatform.ready(function () {
      //  alert("fired ready in app.js");
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });

  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $translateProvider) {

    if (localStorage.langId == undefined) localStorage.langId = config.languageId;
    // multilanguage support for application
    $translateProvider
      // .useStaticFilesLoader({ prefix: 'languages/', suffix: '.json' })
      .useUrlLoader(config.serverUrl + 'appLabels')
      .preferredLanguage(localStorage.langId)
      .useSanitizeValueStrategy(null);





    //checking version of the device
    var currentPlatformVersion = parseFloat(ionic.Platform.version());
    if (currentPlatformVersion < 4.4)
      $ionicConfigProvider.scrolling.jsScrolling(true);
    else
      $ionicConfigProvider.scrolling.jsScrolling(false);

    var count = 0;
    //checking internet connectiivty before http request
    $httpProvider.interceptors.push(function ($q) {
      return {
        'request': function (config) {
          var canceler = $q.defer();
          config.timeout = canceler.promise;
          if (!connectedToInternet && count == 0) {
            count++;
            // Canceling request
            canceler.resolve();
            // alert("Please connect to the internet")
          }
          if (connectedToInternet) { count = 0; }
          return config;
        }
      }
    });


    $stateProvider

      .state('menu', {
        url: '/menu',
        abstract: true,
        cache: true,
        templateUrl: 'templates/menu.html',
        controller: 'menuController'
      })

      .state('intro', {
        cache: false,
        url: '/intro',
        templateUrl: 'templates/intro.html',
        controller: 'introController'
      })

      .state('menu.home', {
        cache: false,
        url: '/home',
        params: { tempName: null },
        views: {
          'menuContent': {
            templateUrl: 'templates/home-version-1.html',
            controller: 'homeController'
          }
        }
      })
      // .state('menu.home', {
      //   cache: true,
      //   url: '/home',
      //   params: { tempName: null },
      //   views: {
      //     'menuContent': {
      //       templateUrl: 'templates/home-version-1.html',
      //       controller: 'homeController'
      //     }
      //   }
      // })
      .state('menu.cart', {
        cache: false,
        url: '/cart',
        views: {
          'menuContent': {
            templateUrl: 'templates/cart-page.html',
            controller: 'cartController'
          }
        }
      })
      .state('menu.productDetail', {
        cache: false,
        url: '/productDetail',
        params: { data: null, hideData: null },
        views: {
          'menuContent': {
            templateUrl: 'templates/product-detail.html',
            controller: 'productDetailController'
          }
        }
      })
      .state('menu.myAccount', {
        cache: false,
        url: '/myAccount',
        views: {
          'menuContent': {
            templateUrl: 'templates/my-account.html',
            controller: 'myAccountController'
          }
        }
      })


      // .state('menu.categories', {
      //   cache: true,
      //   url: '/categories',
      //   params: { tempName: '1' },
      //   views: {
      //     'menuContent': {
      //       templateUrl: function (stateParams) {
      //         var template = stateParams.tempName;
      //         if (template == null || template == undefined)
      //           template = '1';
      //         return 'templates/category-version-' + template + '.html'
      //       },
      //       controller: 'categoriesController'
      //     }
      //   }
      // })

      .state('menu.categories', {
        cache: true,
        url: '/categories',
        params: { tempName: null },
        views: {
          'menuContent': {
            templateUrl: 'templates/category-version-1.html',
            controller: 'categoriesController'
          }
        }
      })

      .state('menu.subcategories', {
        cache: true,
        url: '/subcategories',
        params: { name: null, mainId: null, tempName: '1' },
        views: {
          'menuContent': {
            templateUrl: function (stateParams) {
              var template = stateParams.tempName;
              if (template == null || template == undefined)
                template = '1';
              return 'templates/sub-categories-' + template + '.html'
            },
            controller: 'subCategoriesController'
          }
        }
      })

      // .state('menu.subcategories', {
      //   cache: true,
      //   url: '/subcategories',
      //   params: { tempName: null },
      //   views: {
      //     'menuContent': {
      //       templateUrl: 'templates/sub-categories-1.html',
      //       controller: 'subCategoriesController'
      //     }
      //   }
      // })

      .state('menu.products', {
        cache: true,
        url: '/products',
        params: { name: null, catId: null, sort: null },
        views: {
          'menuContent': {
            templateUrl: 'templates/products.html',
            controller: 'productsController'
          }
        }
      })

      .state('menu.contact', {
        cache: true,
        url: '/contact',
        views: {
          'menuContent': {
            templateUrl: 'templates/contact-us.html',
            controller: 'contactUsController'
          }
        }
      })
      .state('menu.settings', {
        cache: true,
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'templates/settings.html',
            controller: 'settingsController'
          }
        }
      })
      .state('disconnected', {
        cache: false,
        url: '/disconnected',
        templateUrl: 'templates/disconnected.html'
      })
      .state('shippingAddress', {
        cache: false,
        url: '/shippingAddress',
        params: { data: null },
        templateUrl: 'templates/shipping-address.html',
        controller: 'shippingAddressController'
      })
      .state('billingAddress', {
        cache: false,
        params: { data: null },
        url: '/billingAddress',
        templateUrl: 'templates/billing-address.html',
        controller: 'billingAddressController'
      })
      .state('shippingMethod', {
        cache: false,
        url: '/shippingMethod',
        params: { data: null },
        templateUrl: 'templates/shipping-method.html',
        controller: 'shippingMethodController'
      })
      .state('menu.orderdetail', {
        cache: true,
        url: '/orderdetail',
        params: { order: null },
        views: {
          'menuContent': {
            templateUrl: 'templates/order-detail.html',
            controller: 'orderDetailController'
          }
        }
      })
      .state('order', {
        cache: false,
        url: '/order',
        templateUrl: 'templates/order.html',
        controller: 'orderController'
      })
      .state('menu.allShippingAddress', {
        url: '/allShippingAddress',
        cache: false,
        views: {
          'menuContent': {
            templateUrl: 'templates/all-shipping-address.html',
            controller: 'allShippingAddressController'
          }
        }
      })
      .state('menu.myOrders', {
        cache: false,
        url: '/myOrders',
        views: {
          'menuContent': {
            templateUrl: 'templates/my-orders.html',
            controller: 'myOrdersController'
          }
        }
      })
      .state('menu.search', {
        cache: true,
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'searchController'
          }
        }
      })
      .state('menu.wishList', {
        cache: false,
        url: '/wishList',
        views: {
          'menuContent': {
            templateUrl: 'templates/wish-list.html',
            controller: 'wishListController'
          }
        }
      })
      .state('menu.thankYou', {
        cache: true,
        url: '/thankYou',
        views: {
          'menuContent': {
            templateUrl: 'templates/thank-you.html',
            controller: 'thankYouController'
          }
        }
      })
      .state('menu.aboutUs', {
        cache: true,
        url: '/aboutUs',
        views: {
          'menuContent': {
            templateUrl: 'templates/about-us.html'
          }
        }
      })
      .state('menu.laravelCategories', {
        cache: true,
        url: '/laravelCategories',

        views: {
          'menuContent': {
            templateUrl: 'templates/laravel-categories.html',
            controller: 'laravelCategoriesController'
          }
        }
      })
      .state('menu.laravelPosts', {
        cache: true,
        url: '/laravelPosts',
        params: { name: null, id: null },
        views: {
          'menuContent': {
            templateUrl: 'templates/laravel-posts.html',
            controller: 'laravelPostsController'
          }
        }
      })
      .state('menu.laravelPostDetail', {
        cache: true,
        url: '/laravelPostDetail',
        params: { post: null },
        views: {
          'menuContent': {
            templateUrl: 'templates/laravel-post-detail.html',
            controller: 'laravelPostDetailController'
          }
        }
      })



    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/menu/home');
  });
