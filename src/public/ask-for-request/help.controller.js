(function () {
	'use strict';
	
	angular.module('public')
	.controller('HelpController',HelpController);

	HelpController.$inject = ['categories'];
	function HelpController(categories) {
		var $ctrl = this;
		$ctrl.categories = categories;

		//check if entered category exists in categories array.
		//if not, add new category to database.
		//add the request under the category into the database.

	}


})();