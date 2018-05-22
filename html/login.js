var AuthApi = "https://auth.counterespionage52.hasura-app.io";
var DataApi = "https://data.counterespionage52.hasura-app.io";

var AuthApiDev = "http://auth.c100.hasura.me";
var DataApiDev = "http://data.c100.hasura.me";

function myfunc() {
	var request = new XMLHttpRequest;
   	request.onreadystatechange = function () {
   		if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                //console.log("User logged in.");
                alert("Welcome, " + username + "!"); 
                var response = JSON.parse(request.responseText);
                console.log(response);
                if (response.hasura_roles.indexOf("worker") == -1) {
                    window.location = "ask-for-request";    
                } else {
                    window.location = "my-requests";
                }
                
            } else {
            	alert("Incorrect username/password.");
            }
                      
        }  
    }; 

    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
	request.open('POST',AuthApiDev + '/login',true);
	request.withCredentials = true;
	request.setRequestHeader('Content-Type', 'application/json');
	request.send(JSON.stringify({
		username: username,
		password: password
	}));
   
}