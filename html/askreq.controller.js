var app = angular.module("myApp",[]);

var AuthApi = "https://auth.counterespionage52.hasura-app.io";
var DataApi = "https://data.counterespionage52.hasura-app.io";

var AuthApiDev = "http://auth.c100.hasura.me";
var DataApiDev = "http://data.c100.hasura.me";

var userid;
var username;
var mobile;

app.controller("myCtrl",[ '$scope','$http', function($scope,$http){
	angular.element(document).ready(function () {
		$http({
			method: "GET",
			url: AuthApiDev + "/user/account/info",
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer"
			}
		}).success(function(response) {
			//console.log("User details fetched.");
			userid = response.hasura_id;
			username = response.username;
			$scope.username = username;
			mobile = response.mobile;
			$http({
				method: "POST",
				url: DataApiDev + "/v1/query",
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer"
				},
				data: {
					"type": "select",
					"args": {
						"table": "profile",
				    	"columns": ["username"],
				    	"where": {
				    		"username": username
				    	}
				 	}
				}
			}).success(function(response) {
				if (!$.trim(response) === true) {
					$http({
						method: "POST",
						url: DataApiDev + "/v1/query",
						withCredentials: true,
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer"
						},
						data: {
							"type": "insert",
							"args": {
								"table": "profile",
						    	"objects": [{
						    		"userid": userid,
						    		"username": username,
						    		"mobile": mobile,
						    		"categoryName": "Other"
						    	}]
						 	}
						}
					}).success(function(response) {
						//console.log("User added.");
					}).error(function(data,status) {
						//console.log("Could not add user. Try next login.");
					});
				} else {
					//console.log("User already added.");		
				}
			}).finally(function() {
				$http({
					method: "POST",
					url: DataApiDev + "/v1/query",
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer"
					},
					data: {
						"type": "select",
						"args": {
							"table": "category",
							"columns": ["*"]
						}
					}
				}).success(function(categories) {
					//console.log("Fetched categories.");
					$scope.categories = categories;
					$scope.selectedCategory = "Select Category";
				}).error(function(data,status) {
					//console.log("Failed to fetch categories.");
				});
			});
		}).error(function(data,status) {
			//console.log("Could not fetch user details.");
		});
	});

	$scope.updateCategory = function (categoryName) {
		$scope.selectedCategory = categoryName;
	}

	$scope.postRequest = function () {
		if ($scope.title === undefined || $scope.description === undefined || $scope.selectedCategory === "Select Category") {
			alert("Please fill in all the details.");
			return;
		}
		$http({
			method: "POST",
			url: DataApiDev + "/v1/query",
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer"
			},
			data: {
				"type": "insert",
				"args": {
					"table": "request",
			    	"objects": [{
			    		"userid": userid,
			    		"setBy": userid,
			    		"categoryName": $scope.selectedCategory,
			    		"title": $scope.title,
			    		"description": $scope.description,
			    	}]
			 	}
			}
		}).success(function(response) {
			//console.log("Request added.");
			alert("Your request has been posted! Kindly wait till someone accepts it.")
		}).error(function(data,status) {
			//console.log("Could not add request.");
			alert("Could not add request! Please try again.");
		});
	}

	$scope.logout = function () {
		$http({
			method: "POST",
			url: AuthApiDev + "/user/logout",
			withCredentials: true,
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer"
			}
		}).success(function(response) {
			//console.log("User logged out.");
			alert("You are logged out successfully.");
	        window.location = "/login";
		}).error(function(data,status) {
			alert("Could not log out. Please try again.");
		});
	}
}]);