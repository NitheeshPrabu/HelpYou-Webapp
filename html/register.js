var AuthApi = "https://auth.counterespionage52.hasura-app.io";
var DataApi = "https://data.counterespionage52.hasura-app.io";

var AuthApiDev = "http://auth.c100.hasura.me";
var DataApiDev = "http://data.c100.hasura.me";

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
            emailid: {
                validators: {
                    notEmpty: {
                        message: 'Please fill this field.'
                    },
                    emailAddress: {
                        message: 'Enter a valid email address.'
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
            confirm_password: {
                validators: {
                    identical: {
                        field: 'password',
                        message: 'Passwords do not match.'
                    },
                    notEmpty: {
                        message: 'Please fill this field.'
                    }
                }
            }
        }
    })  
});

function register() {
	var request = new XMLHttpRequest;
   	request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
            	//console.log("User registered.");
                alert("Account created successfully! Login to continue.");
                window.location = "login";
            } else {
                alert("Could not create account. EmailID / Username already exists.");
            }
                      
        }  
    }; 
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var email = document.getElementById("emailid").value;
    var mobile = document.getElementById("mobileno").value;
    //console.log(username,password,email,mobile);
   	request.open('POST',AuthApiDev + '/signup',true);
   	request.setRequestHeader('Content-Type', 'application/json');
   	request.send(JSON.stringify({
   		username : username,
   		password : password,
   		email : email,
   		mobile : mobile
   	}));
}