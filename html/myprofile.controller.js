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
var firstCategory;
var nUsername, nEmail, nMobile, nPassword;
var onlyProfile = true;

$(document).ready(function () {
    $('#myform').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                        notEmpty: {
                        message: 'Please fill this field.'
                    }
                }
            },
            mobileno: {
                validators: {
                    notEmpty: {
                        message: 'Please fill this field.'
                    },
                    stringLength: {
                        min: 10,
                        max: 10,
                        message: 'Enter a valid mobile number.'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'Please fill this field.'
                    },
                    stringLength: {
                        min: 8,
                        message: 'Minimum 8 characters.'
                    }
                }
            },
            newPassword: {
                validators: {
                    notEmpty: {
                        message: 'Please fill this field.'
                    },
                    stringLength: {
                        min: 8,
                        message: 'Minimum 8 characters.'
                    }
                }
            }
        }
    });  
});

app.controller("myCtrl",[ '$scope','$http', '$window', '$q', '$timeout', function($scope,$http,$window,$q,$timeout){
	angular.element(document).ready(function () {
		$scope.urlToMainPage = "ask-for-request";
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
			emailid = response.email;
			roles = response.hasura_roles;
			$scope.isNormalUser = true;
			if (roles.indexOf("worker") !== -1) {
				$scope.isNormalUser = false;
				$scope.urlToMainPage = "my-requests";
			}
			$scope.username = username;
			$scope.mobile = mobile;
			$scope.emailid = emailid;
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
			}).success(function(category) {
				//console.log("User category fetched.");
				$scope.newCategory = category[0].categoryName;
				firstCategory = category[0].categoryName;
			}).error(function(data,status) {
				//console.log("Failed to fetch user category.");
			});
		}).error(function(data,status) {
			//console.log("Could not fetch user details.");
			alert("Could not fetch user details. Reload page.");
			$window.location.reload();
		});
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
					"columns": ["*"],
					"where": {
						"categoryName": {"$ne": "Other"}
					}
				}
			}
		}).success(function(categories) {
			//console.log("Fetched categories.");
			$scope.categories = categories;
		}).error(function(data,status) {
			//console.log("Failed to fetch categories.");
		});
	});

	$scope.updateCategory = function (categoryName) {
		$scope.newCategory = categoryName;
	}

	$scope.verifyPassword = function () {
		if ($scope.password === undefined) {
			alert("Please enter the password!");
			return;
		}
		if ($scope.username !== username || $scope.mobile !== mobile || $scope.emailid !== emailid || (($scope.newPassword !== $scope.password) && ($scope.newPassword !== undefined)) || $scope.newCategory !== firstCategory) {
			nUsername = $scope.username;
			nEmail = $scope.emailid;
			nMobile = $scope.mobile;
			nPassword = $scope.newPassword;
			$http({
				method: "POST",
				url: AuthApiDev + "/user/password/verify",
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer"
				},
				data: {
					"password": $scope.password
				}
			}).success(function(response) {
				//console.log("Password verified.");
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
							"table": "profile",
					    	"$set": {
					    		"username": $scope.username,
					    		"mobile": $scope.mobile,
					    		"categoryName": $scope.newCategory
					    	},
					    	"where": {
					    		"userid": userid
					    	}
					 	}
					}
				}).success(function(response) {
					//console.log("Profile table updated.");
					updatePassword();
				}).error(function(data,status) {
					//console.log("Could not update profile table.");
					alert("Could not update your profile details! Please try again.");
				});
			}).error(function(data,status) {
				//console.log("Wrong password.");
				alert("Please enter the correct password!");
			});
		} else {
			alert("No changes made.");
		}
	}

	function updateProfile() {
		var deferred = $q.defer();
		if (nUsername !== username) {
			$http({
				method: "POST",
				url: AuthApiDev + "/user/account/change-username",
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer"
				},
				data: {
					"username": nUsername
				}
			}).success(function(response) {
				//console.log("Username updated in auth_hasura_user table.");
				deferred.reject();
			}).error(function(data,status) {
				//console.log("Could not update username in auth_hasura_user table.");
				alert("Could not update your profile details! Please reload the page and try again.");
			});
		}
		if (nEmail !== emailid) {
			$http({
				method: "POST",
				url: AuthApiDev + "/user/email/change",
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer"
				},
				data: {
					"email": nEmail
				}
			}).finally(function() {
				//console.log("Email ID update needs verification.");
				deferred.reject();
			});
		}
		if (nMobile !== mobile) {
			$http({
				method: "POST",
				url: AuthApiDev + "/user/mobile/change",
				withCredentials: true,
				headers: {
					"Content-Type": "application/json",
					"Authorization": "Bearer"
				},
				data: {
					"mobile": nMobile
				}
			}).finally(function() {
				//console.log("Mobile no. update needs OTP verification.");
				deferred.reject();
			});
		}
		if ($scope.password !== nPassword && nPassword !== undefined) {
			onlyProfile = false;
			deferred.resolve();
		}
		return deferred.promise;
	}

	function updatePassword(newPassword,oldPassword) {
		var promise = updateProfile();
		$timeout(function() {
			promise.then(function() {
				$http({
					method: "POST",
					url: AuthApiDev + "/user/password/change",
					withCredentials: true,
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer"
					},
					data: {
						"password": $scope.password,
						"new_password": nPassword
					}
				}).finally(function() {
					//console.log("Password updated.");
					alert("Profile details updated successfully! Please login to apply changes.");
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
				});
			});
			if (onlyProfile) {
				alert("Profile details updated successfully!");
				$window.location.reload();
			}
		}, 1000);
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