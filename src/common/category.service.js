//Get the list of categories from server
(function () {

angular.module('common')
.service('CategoryService',CategoryService);

CategoryService.$inject = ['$http', 'ApiPath'];
function CategoryService($http,ApiPath) {
	var service = this;

	service.getCategories = function () {
		return ['Carpentry','Plumbing','Electrical']; //mocking db call
	}

	service.getUserJobs = function (username) {
		var config = {};
		if (username) {
			config.params = {'username': username};
		}
		//mocking db call
		return [{'Job1': 'Status of Job1', 
				'Job2': 'Status of Job2',
			 	'Job3': 'Status of Job3',
			 	'Job4': 'Status of Job4', 
				'Job5': 'Status of Job5',
			 	'Job6': 'Status of Job6'}];
	}

	service.getCategoryJobs = function (category) {
		var config = {};
		if (category) {
			config.params = {'category': category};
		}
		//mocking db call
		if (category === 'Carpentry') {
			return [{'Job1': 'Description of Job1', 
					'Job2': 'Description of Job2',
			 		'Job3': 'Description of Job3'}];
		}
		if (category === 'Plumbing') {
			return [{'Job4': 'Description of Job4', 
					'Job5': 'Description of Job5',
			 		'Job6': 'Description of Job6'}];
		}
		if (category === 'Carpentry') {
			return [{'Job7': 'Description of Job7', 
					'Job8': 'Description of Job8',
			 		'Job9': 'Description of Job9'}];
		}
	}
}	

})();