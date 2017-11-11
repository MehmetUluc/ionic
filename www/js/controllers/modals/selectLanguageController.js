ecommerce.controller('selectLanguageController', function ($translate, ionicLoading, $localStorage, $http, $scope, $rootScope, $window) {
	$scope.lang = {};
	$scope.languages = [];
	//============================================================================================
	//get list of languages
	$scope.getLanguages = function () {
		$http.get($rootScope.mainUrl + 'getLanguages').then(function (response) {
			$scope.languages = response.data.languages;
			$scope.languages.some(function (value) {
				if (value.languages_id == $localStorage.languageId) {
					$scope.lang = value;
					//console.log($scope.lang);
					//	$rootScope.languageId = value.languages_id;
				}
			});
		}, function (response) {
			//	showAlertService("Error while loading zones from the server");
			console.log(response);
		});


	};
	$scope.getLanguages();

	//============================================================================================  
	//Function used to change the language
	$scope.changeLanguage = function (language) {
		$scope.lang = language;
		//	console.log(language.languages_id);
		if (language.languages_id == $rootScope.languageId)
			return 0;
		ionicLoading("", 3000);
		$localStorage.languageId = $rootScope.languageId = language.languages_id;
		$localStorage.languageDirection = language.direction;
		$localStorage.recentViewed = [];
		$localStorage.cart = [];
		//	$scope.hideModal('selectLanguage');
		//$translate.use(language.code);
		localStorage.langId = $rootScope.languageId;
		//	setTimeout(function() {
		$window.location.reload(true);
		//	}, 50);

	};
	//============================================================================================  
	//Event fired when language changes
	$rootScope.$on('$translateChangeSuccess', function (event, data) {
		// $scope.languages.some(function (value) {
		// 	if (value.languages_id == $localStorage.languageId) {
		// 		if (value.direction == 'rtl') {
		// 			$(document).ready(function () {
		// 				$('body').css('direction', 'rtl');
		// 			});
		// 		}
		// 		else {
		// 			$(document).ready(function () {
		// 				$('body').css('direction', 'ltr');
		// 			});
		// 		}
		// 	}
		// });
	});
});


