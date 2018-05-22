var app = angular.module("myApp",[]);

var AuthApi = "https://auth.counterespionage52.hasura-app.io";
var DataApi = "https://data.counterespionage52.hasura-app.io";

var AuthApiDev = "http://auth.c100.hasura.me";
var DataApiDev = "http://data.c100.hasura.me";

var userid;
var username;
var mobile;
var emailid;
var roles;
var whereClause;

$(document).ready(function () {
	$('#editRequestModal').on('shown.bs.modal', function() {
		$('#myform').bootstrapValidator({
	        fields: {
	            title: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please fill this field.'
	                    }
	                }
	            },
	            description: {
	                validators: {
	                    notEmpty: {
	                        message: 'Please fill this field.'
	                    }
	                }
	            }
	        }
	    });
	});
});

app.controller("myCtrl",[ '$scope','$http', '$window', function($scope,$http,$window){

	angular.element(document).ready(function () {
		var statusNames = ['Unaccepted','Accepted','Completed'];
		$scope.statusNames = statusNames;
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
			$scope.userid = userid;
			username = response.username;
			$scope.username = username;
			mobile = response.mobile;
			emailid = response.email;
			roles = response.hasura_roles;
			$scope.isNormalUser = true;
			$scope.urlToMainPage = "ask-for-request";
			whereClause = {
				"userid": userid
			}
			$scope.displayText = "Find your previous requests here. Click on any request to edit it.";
			if (roles.indexOf("worker") !== -1) {
				$scope.isNormalUser = false;
				$scope.urlToMainPage = "my-requests";
				$scope.displayText = "Find requests grouped under your category here. Click on any request to accept/reject it.";
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
					"type": "select",
					"args": {
						"table": "profile",
				    	"columns": ["categoryName"],
				    	"where": {
				    		"userid": userid 
				    	}
				 	}
				}
			}).success(function(response) {
				userCategory = response[0].categoryName;
				$scope.userCategory = userCategory;
				if (userCategory !== "Other") {
						whereClause = {
						"categoryName": userCategory, 
						"status": {"$ne": 2}
					}
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
						"type": "select",
						"args": {
							"table": "request",
					    	"columns": ["requestid","userid","categoryName","title","description","status","created","setBy","tentative"],
					    	"where": whereClause,
					    	"order_by": ["-created"]
					 	}
					}
				}).success(function(response) {
					//console.log("User requests fetched.");
					$scope.requests = response;
					if ($scope.requests.length === 0) {
						$scope.noRequests = true;
					}
				}).error(function(data,status) {
					//console.log("Could not fetch user requests.");
					alert("Could not fetch user requests. Reload page.");
					$window.location.reload();
				});
			}).error(function(data,status) {
				//console.log("Could not fetch user category.");
				alert("Could not fetch user category. Reload page.");
				$window.location.reload();
			});
		}).error(function(data,status) {
			//console.log("Could not fetch user details.");
			alert("Could not fetch user details. Reload page.");
			$window.location.reload();
		});
	});

	$scope.setModalData = function (request) {
		$scope.request = request;
		$scope.newStatus = $scope.statusNames[request.status];
		$scope.tentativeDate = request.tentative;
		$scope.newTentative = request.tentative;
		document.getElementById('tentative').value = $scope.newTentative;
		$scope.statusError = "";
		$scope.dateError = "";
		if ($scope.isNormalUser) {
			$scope.newCategory = request.categoryName;
			$scope.newTitle = request.title;
			$scope.newDescription = request.description;
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
			}).error(function(data,status) {
				//console.log("Failed to fetch categories.");
			});
		}
	}

	$scope.updateCategory = function (categoryName) {
		$scope.newCategory = categoryName;
	}

	$scope.updateStatus = function (status) {
		if ($scope.isNormalUser) {
			if ($scope.request.status === 0) {
				$scope.statusError = "You cannot edit the status when request is unaccepted.";
			} else {
				if (($scope.request.status === 1 || $scope.request.status === 2) && status === "Unaccepted"){
					$scope.statusError = "You cannot change the state of an accepted request to unaccepted.";
				} else {
					$scope.statusError = "";
					$scope.newStatus = status;
				}
			}
		} else {
			if (status === "Completed") {
				$scope.statusError = "You cannot set the status as completed.";
			} else {
				if ($scope.request.setBy == $scope.request.userid || $scope.request.setBy == userid) {
					$scope.statusError = "";
					$scope.newStatus = status;
					if ($scope.newStatus === "Unaccepted") {
						document.getElementById('tentative').value = undefined;
						$scope.newTentative = null;
					}
				} else {
					$scope.statusError = "You cannot edit the status of request not accepted by you.";
				}
			}
		}
	}

	$scope.updateRequest = function () {
		if ($scope.isNormalUser) {
			if ($scope.newTitle === undefined || $scope.newDescription === undefined) {
				alert("Please fill in all the fields!");
				return;
			} else {
				$http({
					method: "POST",
					url: DataApiDev + "/v1/query",
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer"
					},
					data: {
						"type": "update",
						"args": {
							"table": "request",
					    	"$set": {
					    		"categoryName": $scope.newCategory,
					    		"title": $scope.newTitle,
					    		"description": $scope.newDescription,
					    		"status": $scope.statusNames.indexOf($scope.newStatus),
					    		"setBy": $scope.request.setBy
					    	},
					    	"where": {
					    		"requestid": $scope.request.requestid
					    	}
					 	}
					}
				}).success(function(response) {
					//console.log("Request table updated.");
					alert("Your request has been updated.");
				}).error(function(data,status) {
					//console.log("Could not update request table.");
					alert("Could not update your request details! Please try again.");
				}).finally(function() {
					$window.location.reload();
				});
			}
		} else {
			$scope.newTentative = document.getElementById('tentative').value;
			if ($scope.newTentative === undefined) 
				$scope.newTentative = null;
			if ($scope.newStatus !== $scope.statusNames[$scope.request.status] || $scope.tentativeDate !== $scope.newTentative) {
				var set = {
					"status": $scope.statusNames.indexOf($scope.newStatus),
		    		"setBy": userid
				};
				if ($scope.newStatus != "Unaccepted") {
					set["tentative"] = $scope.newTentative;
				}
				console.log($scope.newStatus,$scope.newTentative);
				if ($scope.newStatus != "Unaccepted" && !$scope.newTentative) {
					alert("Please provide a tentative date!");
				} else {
					$http({
						method: "POST",
						url: DataApiDev + "/v1/query",
						withCredentials: true,
						headers: {
							"Content-Type": "application/json",
							"Authorization": "Bearer"
						},
						data: {
							"type": "update",
							"args": {
								"table": "request",
						    	"$set": set,
						    	"where": {
						    		"requestid": $scope.request.requestid
						    	}
						 	}
						}
					}).success(function(response) {
						//console.log("Request table updated.");
						alert("Request status updated.");
					}).error(function(data,status) {
						//console.log("Could not update request table.");
						alert("Could not update the request details! Please try again.");
					}).finally(function() {
						$window.location.reload();
					});	
				}
			} else {
				alert("No changes made.");
			}
		}
	}

	$scope.viewUserDetails = function (request) {
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
			    	"columns": ["username","mobile"],
			    	"where": {
			    		"userid": request.userid
			    	}
			 	}
			}
		}).success(function(response) {
			$scope.userWhoRequested = response[0].username;
			$scope.mobileOfUserWhoRequested = response[0].mobile;
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
						"table": "request",
				    	"columns": ["tentative"],
				    	"where": {
				    		"requestid": request.requestid
				    	}
				 	}
				}
			}).success(function(response) {
				$scope.tentativeDateWhoRequested = response[0].tentative;
				$('#userInfoModal').modal();
			});
		});
	}

	var d;

	$('#tentative').on("focus",function() {
		d = document.getElementById('tentative').value;
	});

	$("#tentative").on("change",function() {
		var today = new Date();
		var td = new Date(document.getElementById('tentative').value);
		if (Math.floor((td.getTime()-today.getTime())/(3600*24*1000)) <= -2	) {
			alert('Cannot enter a past date!');
			document.getElementById('tentative').value = d;
		}
	});

	$scope.viewWorkerDetails = function (request) {
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
			    	"columns": ["username","mobile"],
			    	"where": {
			    		"userid": request.setBy
			    	}
			 	}
			}
		}).success(function(response) {
			$scope.userWhoRequested = response[0].username;
			$scope.mobileOfUserWhoRequested = response[0].mobile;
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
						"table": "request",
				    	"columns": ["tentative"],
				    	"where": {
				    		"requestid": request.requestid
				    	}
				 	}
				}
			}).success(function(response) {
				$scope.tentativeDateWhoRequested = response[0].tentative;
				$('#userInfoModal').modal();
			});
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
		}).error(function(data,response) {
			alert("Could not log out. Please try again.");
		});
	}

}]);