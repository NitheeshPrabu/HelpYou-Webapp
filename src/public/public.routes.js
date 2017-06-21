(function () {
'use strict';
angular.module('public')
.config(routeConfig);

routeConfig.$inject = ['$stateProvider'];
function routeConfig ($stateProvider) {
	$stateProvider
		.state('public', {
			abstract: true,
			templateUrl: 'src/public/public.html'
		})
		.state('public.home', {
			url: '/',
			templateUrl: 'src/public/home.html'
		})
		.state('public.askforrequests', {
			url: '/ask-for-request',
			templateUrl: 'src/public/ask-for-request/ask-for-request.html',
			controller: 'HelpController',
			controllerAs: 'helpCtrl',
			resolve: {
				categories: ['CategoryService', function (CategoryService) {
	          		return CategoryService.getCategories();
				}]
			}
		})
		.state('public.myrequests', {
			url: '/my-requests',
			templateUrl: 'src/public/my-requests/my-requests.html',
			controller: 'MyRequestsController',
			controllerAs: 'myReqCtrl',
			resolve: {
				myRequests: ['$stateParams','CategoryService', function($stateParams,CategoryService) {
					return CategoryService.getUserJobs($stateParams.username);
				}]
			}
		})
		.state('public.requests', {
			url: '/requests',
			templateUrl: 'src/public/requests/requests.html',
			controller: 'RequestsController',
			controllerAs: 'reqCtrl',
			resolve: {
				requests: ['$stateParams','CategoryService', function($stateParams,CategoryService) {
					return CategoryService.getCategoryJobs($stateParams.category);
				}]
			}
		});
}
})();