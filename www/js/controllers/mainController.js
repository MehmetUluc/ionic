ecommerce.controller('mainController', function ($http, $state,$cordovaInAppBrowser, $ionicPlatform,
	 $translate, $cordovaDevice, $ionicSideMenuDelegate, $cordovaLocalNotification, $cordovaNetwork,
	 $window, $scope, showAlertService, ionicLoading, $ionicModal, $rootScope, $ionicHistory, $localStorage) {
	if ($localStorage.config == undefined)
		$localStorage.config = config;
	// Declaring global vaicables
	$rootScope.mainUrl = config.serverUrl;
	//$rootScope.wpUrl = "http://vectorcoder.net/testing/sites/vcshop/";// this will be used for login controller
	$rootScope.wpUrl = config.wordPressUrl;// this will be used for login controller
	$rootScope.orderDetails = {};
	$rootScope.products = [];
	$rootScope.topSellers = [];
	$rootScope.mostLiked = [];
	$rootScope.special = [];
	$rootScope.categories = [];
	$rootScope.shopName = config.shopName;
	$rootScope.settings = {
		cartButton: config.showCartButton,
		newProductDuration: config.newProductDuration,
		paymentMethods: config.defaultPaymentMethod
	};
	$rootScope.currencySymbol = config.currency;
	$rootScope.filterPriceMin = config.filterMinPrice;
	$rootScope.filterPriceMax = config.filterMaxPrice;

	$rootScope.logo = config.logo;
	$rootScope.logoMini = config.miniLogo;
	$rootScope.showFooterTabs = config.showFooterTabs;
	$rootScope.footerTabsView = false;
	$rootScope.productsLayout = config.layout;
	$rootScope.lazyLoaderGif = config.lazyLoadingGif;

	if ($localStorage.languageId == undefined) {
		$localStorage.languageId = config.languageId;
		$localStorage.languageDirection = config.direction;
	}
	$rootScope.languageId = $localStorage.languageId;

	//cart array with local storage variable to store ids of the prodcuts in cart
	if ($localStorage.cart == undefined) {
		$localStorage.cart = new Array;
	}
	$rootScope.cartArray = $localStorage.cart;

	//recentViewedArray array with local storage variable to store ids of the prodcuts in recentViewed
	$rootScope.recentViewedArray = [];
	if ($localStorage.recentViewed == undefined) {
		$localStorage.recentViewed = new Array;
	}
	$rootScope.recentViewedArray = $localStorage.recentViewed;

	//customer array with local storage variable to keep user log in
	$rootScope.customerData = null;
	if ($localStorage.customer == undefined) {
		$localStorage.customer = null;
	}
	$rootScope.customerData = $localStorage.customer;
	//servies to show ionic loading
	//	ionicLoading('', 3000);
	//============================================================================================  
	//It provides information about the device’s cellular and wifi connection
	document.addEventListener("deviceready", function () {
		// listen for Online event
		$rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
			if (connectedToInternet == false) {
				$ionicHistory.goBack();
				// setTimeout(function () {
				// 	//$window.location.reload(true);
				// }, 100);
				//$state.reload();
				connectedToInternet = true;
				$window.location.reload(true);
			}
		})
		// listen for Offline event
		$rootScope.$on('$cordovaNetwork:offline', function (event, networkState) {
			$state.go('disconnected');
			connectedToInternet = false;
			//showAlertService("Please Turn on internet");
		})
	}, false);
	//============================================================================================  
	//Adding local notification
	document.addEventListener("deviceready", function () {
		// var now = new Date().getTime(),
		// 	_12_hour_from_now = new Date(now + 12 * 3600000);

		// cordova.plugins.notification.local.schedule({
		// 	id: 2,
		// 	title: 'Lets Shop',
		// 	text: 'Bundle of products waiting for you!',
		// 	at: _12_hour_from_now,
		// 	led: "FF0000",
		// 	sound: null
		// });
		////////////////////////////////////////////////////////////////////
		$scope.scheduleNotification = function () {
			//alert("setting noti");
			$cordovaLocalNotification.schedule({
				id: 1,
				title: config.notifTitle,
				text: config.notifText,
				every: config.notifDuration,
			});
		};
		if ($localStorage.notificationFired == undefined) {

			$localStorage.notificationFired = new Array;
			$localStorage.settings = {};
			$localStorage.settings.localNotification = true;
			$scope.scheduleNotification();
			//alert("notificaiton fired");
		}
	}, false);
	//============================================================================================  
	//getting banners data from server
	$scope.getBanners = function () {
		$http.get($rootScope.mainUrl + 'getBanners').then(function (response) {
			if (response.data.success == 1)
				$rootScope.imageSliderArray = response.data.data;
		},
			function (response) {
				//showAlertService("Error while loading banners from the server");
			});
	};
	//============================================================================================  	
	//getting countries from server
	$scope.getCountries = function () {
		$http.post($rootScope.mainUrl + 'getCountries').then(function (response) {
			$rootScope.countries = response.data.data;
		},
			function (response) {
				console.log(response);
			});
	};
	//============================================================================================  
	//getting topseller from the server
	$scope.getTopSeller = function () {
		var data = {};
		if ($rootScope.customerData == null)
			data.customers_id = null;
		else
			data.customers_id = $rootScope.customerData.customers_id;
		data.page_number = 0;
		data.type = 'top seller';
		data.language_id = $rootScope.languageId;
		$http.post($rootScope.mainUrl + 'getAllProducts', data).then(function (response) {
			if (response.data.success == 1) {
				$rootScope.topSellers = response.data.product_data;
			}
		}, function (response) {
			//showAlertService("Error while loading Top seller products from the server");
			console.log(response);
		});
	};

	//============================================================================================   
	//getting getMostLikedProducts from the server
	$scope.getMostLiked = function () {
		var data = {};
		if ($rootScope.customerData == null)
			data.customers_id = null;
		else
			data.customers_id = $rootScope.customerData.customers_id;
		data.page_number = 0;
		data.language_id = $rootScope.languageId;
		data.type = 'most liked';
		$http.post($rootScope.mainUrl + 'getAllProducts', data).then(function (response) {
			if (response.data.success == 1) {
				$rootScope.mostLiked = response.data.product_data;
			}
		}, function (response) {
			//showAlertService("Error while loading Most Liked products from the server");
			console.log(response);
		});
	};

	//============================================================================================  
	//getting getMostLikedProducts from the server
	$scope.getSpecialProductsDeal = function () {
		var data = {};
		if ($rootScope.customerData == null)
			data.customers_id = null;
		else
			data.customers_id = $rootScope.customerData.customers_id;
		data.language_id = $rootScope.languageId;
		data.page_number = 0;
		data.type = 'special';
		$http.post($rootScope.mainUrl + 'getAllProducts', data).then(function (response) {
			if (response.data.success == 1) {
				$rootScope.special = response.data.product_data;
			}
		}, function (response) {
			//showAlertService("Error while loading Special products from the server");
			console.log(response);
		});
	};

	//============================================================================================  
	//getting list of categories from the server
	$scope.getCategories = function () {
		var data = {};
		data.language_id = $rootScope.languageId;
		$http.post($rootScope.mainUrl + 'allCategories', data).then(function (response) {
			if (response.data.success == 1) {
				$rootScope.categories = response.data.data;
			}
			else {
				$scope.getCategories();
			}
		}, function (response) {
			//showAlertService("Error while loading Tabs from the server");
			console.log(response);
		});
	};
	$rootScope.zones = [];
	//============================================================================================
	//get zones
	$scope.getZones = function (zone_country_id) {
		$scope.zoneData = { 'zone_country_id': zone_country_id };
		var data = $scope.zoneData;
		$http.post($rootScope.mainUrl + 'getZones', data).then(function (response) {
			$rootScope.zones = response.data.data;
		}, function (response) {
			//	showAlertService("Error while loading zones from the server");
			console.log(response);
		});
	};

		//============================================================================================  
	//getting privacy policy and term and condtions and others.
	$rootScope.privacyPolicy = '';
	$rootScope.termServices = '';
	$rootScope.refundPolicy = '';
	$rootScope.aboutUs = '';
	$scope.getAllPages = function () {
		var data = {};
		data.language_id = $rootScope.languageId;
		$http.post($rootScope.mainUrl + 'getAllPages', data).then(function (response) {
			if (response.data.success == 1) {
				var pages = response.data.pages_data;
				pages.some(function (value) {
					if (value.slug == 'privacy-policy') $rootScope.privacyPolicy = value.description;
					if (value.slug == 'term-services') $rootScope.termServices = value.description;
					if (value.slug == 'refund-policy') $rootScope.refundPolicy = value.description;
					if (value.slug == 'about-us') $rootScope.aboutUs = value.description;
				});
			}
		}, function (response) {
			console.log(response);
		});
	};
	$scope.getAllPages();
	//============================================================================================  
	//getting single Product data from server
	$scope.getProductDetail = function (id, value) {
		var data = {};
		data.products_id = id;
		if ($rootScope.customerData == null)
			data.customers_id = null;
		else
			data.customers_id = $rootScope.customerData.customers_id;
		data.language_id = $rootScope.languageId;
		$http.post($rootScope.mainUrl + 'getAllProducts', data).then(function (response) {
			if (value == 'cart' && response.data.success == 0) {
				$rootScope.cartArray.some(function (value, index) {
					if (value.products_id == id) {
						$rootScope.cartArray.splice(index, 1);
					}
				});
			}
			if (response.data.success == 0 && value != 'cart') {
				$rootScope.recentViewedArray.some(function (value, index) {
					if (value.products_id == id) {
						//	console.log("product removed form cart");
						$rootScope.recentViewedArray.splice(index, 1);
					}
				});
			}

		},
			function (response) {
				//showAlertService("Error while loading product from the server");
				console.log("Error : " + id + "" + response);
			});
	};
	//============================================================================================  
	//getting all recent viewed from the server
	$scope.getAllRecentViewed = function () {
		$localStorage.recentViewed.some(function (value, index) {
			if (value != null)
				$scope.getProductDetail(value.products_id);
		});
	};

	//============================================================================================  
	//getting cart from the server
	$scope.getAllCart = function () {
		$localStorage.cart.some(function (value, index) {
			if (value != null) {
				$scope.getProductDetail(value.products_id, 'cart');
			}
		});
	};

	//============================================================================================  
	//remove recent viewed
	$scope.removeRecent = function (id) {
		$rootScope.recentViewedArray.some(function (value, index) {
			if (value.products_id == id) {
				$rootScope.recentViewedArray.splice(index, 1);
				return true;
			}
		});
		$localStorage.recentViewed.some(function (value, index) {
			if (value == id) {
				$localStorage.recentViewed.splice(index, 1);
				return true;
			}
		});
		// console.log($rootScope.recentViewedArray);
		// console.log($localStorage.recentViewed);
	};

	//============================================================================================
	//registering device for push notification function
	$scope.registerDevice = function () {
		//	console.log("called");
		var data = {};
		if ($rootScope.customerData == null)
			data.customers_id = null;
		else
			data.customers_id = $rootScope.customerData.customers_id;
		//	alert("device ready fired");
		var deviceInfo = $cordovaDevice.getDevice();
		data.device_model = deviceInfo.model;
		data.device_type = deviceInfo.platform;
		data.device_id = $localStorage.registrationId;
		data.device_os = deviceInfo.version;
		data.manufacturer = deviceInfo.manufacturer;
		data.ram = '2gb';
		data.processor = 'mediatek';
		data.location = 'empty';

		//console.log(JSON.stringify(data));
		$http.post($rootScope.mainUrl + 'registerDevices', data).then(function (response) {
			//console.log(JSON.stringify(response));
		}, function (response) {
			//	showAlertService("Error while loading zones from the server");
			//console.log("Error" + JSON.stringify(response));
		});
	};
	//============================================================================================  
	//registering device for push notification
	if ($localStorage.pushNotification == undefined) {
		setTimeout(function () {
			$scope.registerDevice();
		}, 10000);
		$localStorage.pushNotification = 'loaded';
	}

	//showing intro state for first time app run.
	$(document).ready(function () {
		if ($localStorage.intro == undefined) {
			//  alert("loading intro");
			$localStorage.intro = new Array;
			$state.go("intro");
		}
	});
	//===================================================================================================================
	//calling function
	if (connectedToInternet == true) {
		$scope.getBanners();
		$scope.getTopSeller();
		$scope.getMostLiked();
		$scope.getSpecialProductsDeal();
		$scope.getCategories();
		$scope.getAllRecentViewed();
		$scope.getAllCart();
	}
	//modals array
	$scope.modals = [];
	//===========================================================================================
	//create modal function
	var createModal = function (url, name) {
		$ionicModal.fromTemplateUrl('templates/modals/' + url + '.html',
			{ scope: $scope, animation: 'slide-in-up' }).then(function (modal) {
				$scope.modals[name] = modal;
			});
	}
	createModal('login', 'login');
	createModal('signup', 'createNewAccount');
	createModal('update-shipping-address', 'updateShipping');
	createModal('forget-passward', 'forget');
	createModal('select-language', 'selectLanguage');
	createModal('privacy-policy', 'privacyPolicy');
	createModal('refund-policy', 'refundPolicy');
	createModal('term-services', 'termServices');
	//	createModal('forget-passward', 'forget');

	//============================================================================================  
	// method to use the show the modals
	$scope.showModal = function (temp, product) {
		$scope.modals[temp].show();
	};

	//============================================================================================  
	// method to use the hide the modals
	$scope.hideModal = function (temp) {
		$scope.modals[temp].hide();
	};
	//============================================================================================  
	// Cleanup the modal when we're done with it!
	$scope.$on('$destroy', function () {
		$scope.modals.remove();
	});
	//============================================================================================  
	//go back to previous page 
	$scope.goBack = function () {
		// console.log('going back');
		$ionicHistory.goBack();
	};
	//============================================================================================  
	//on changing the current state
	$scope.currentState = "menu.home";
	$rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
		$scope.currentState = toState.name;
	});
	//============================================================================================  
	//go back to previous page 
	$scope.lazyScroll = function () {
		$rootScope.$broadcast('lazyScrollEvent');
	};
	//============================================================================================  
	//checking product is new or old 
	$scope.checkProduct = function (date) {
		//	console.log(date);
		var pDate = new Date(date);
		pDate = pDate.getTime() + $rootScope.settings.newProductDuration * 86400000;
		var todayDate = new Date();
		if (pDate > todayDate)
			return true;
		else
			return false
	};
	//============================================================================================  
	//calculating product discount
	$scope.pDiscount = function (p1, p2) {
		p1 = parseInt(p1);
		p2 = parseInt(p2);
		if (p1 == 0 || p2 == null || p2 == undefined || p2 == 0) { return ""; }
		var result = Math.abs((p1 - p2) / p1 * 100);
		result = parseInt(result);
		if (result == 0) { return ''; }
		return result + '%';
	}
	//============================================================================================  
	//checking that product is in cart or not
	$scope.isInCart = function (id) {
		var found = false;
		$rootScope.cartArray.some(function (value, index) {
			if (value.products_id == id) {
				found = true;
				return true;
			}
		});
		if (found == true) return true;
		else return false;
	};
	//============================================================================================  
	//apply scope function to load data quickly
	$scope.safeApply = function (fn) {
		var phase = this.$root.$$phase;
		if (phase == '$apply' || phase == '$digest') {
			if (fn && (typeof (fn) === 'function')) {
				fn();
			}
		} else {
			this.$apply(fn);
		}
	};

	//============================================================================================  
	//Function used to change the language
	$scope.changeLanguage = function (language) {
		$translate.use(language);
		console.log(language);
	};
	$rootScope.appDirection = config.direction;
	//============================================================================================  
	//changing direction of app on language changes
	if ($localStorage.languageDirection == 'rtl') {
		$rootScope.appDirection = 'rtl';
	}
	else {
		$rootScope.appDirection = 'ltr';
	}
	//============================================================================================  
	//Function used to change the language
	$scope.cartTotalItems = function () {
		var total = 0;
		$rootScope.cartArray.some(function (value) {
			total += value.customers_basket_quantity;
		});
		return total;
	};
	//============================================================================================  
	//Function used to open link in browser
    $scope.openLink = function (link) {
        var options = {
            location: 'yes',
            clearcache: 'yes',
            toolbar: 'yes'
        };
        document.addEventListener("deviceready", function () {
            $cordovaInAppBrowser.open(link, '_blank', options)
                .then(function (event) {
                    // success
                })
                .catch(function (event) {
                    // error
                });
        }, false);
    };
	//hiding footer on menu open or close
	$scope.$watch(function () {
		return $ionicSideMenuDelegate.getOpenRatio();
	},
		function (ratio) {
			if (ratio == 1) {
				$rootScope.footerTabsView = false;
			}
			else if (ratio == -1) {
				$rootScope.footerTabsView = false;
			} else if (ratio == 0 && $scope.currentState != 'menu.products' && $scope.currentState != 'menu.cart') {
				$rootScope.footerTabsView = true;
			}
		});
});