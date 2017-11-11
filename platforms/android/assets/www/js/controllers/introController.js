ecommerce.controller('introController', function ($scope, $state, $ionicSlideBoxDelegate) {


	$scope.slideImages = [
		{ image: 'http://placehold.it/320x480' },
		{ image: 'http://placehold.it/320x480' },
		{ image: 'http://placehold.it/320x480' }
	];
	var swiper;
	$scope.lastSlide = false;
//	$scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
		swiper = new Swiper('.intro-slider', {
			pagination: '.swiper-pagination',
			paginationClickable: true,
			// nextButton: '.swiper-button-next',
			// prevButton: '.swiper-button-prev',
			
			onSlideChangeStart: function () {
				var n = swiper.activeIndex + 1;
				//console.log("n : "+n +"   length:  "+$scope.slideImages.length);
				if (n == $scope.slideImages.length) {
					//	console.log('slide endt');
					$scope.lastSlide = true;
					$scope.safeApply();	
				}
				else {$scope.lastSlide = false;
				$scope.safeApply();}
				//console.log('slide change start' + swiper.activeIndex);
			}
		});

//	});

	// Called to navigate to the main app
	$scope.startApp = function () {
		$state.go('menu.home');
	};
	// Called to navigate to the main app
	$scope.nextSlide = function () {
		swiper.slideNext();
	};

});

