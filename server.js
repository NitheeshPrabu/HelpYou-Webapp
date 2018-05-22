var express = require('express');
var app = express();
var path=require('path');
var request = require('request');
var fetch = require('node-fetch');
var favicon = require('serve-favicon');

var DEVELOPMENT = (process.env.NODE_ENV == 'production') ? false : true;
var headers = {'Content-Type': 'application/json'};
var url;
if (DEVELOPMENT) {
	headers.Authorization = 'Bearer ' + process.env.ADMIN_TOKEN;
  	//url = `https://data.c100.hasura.me`;
  	url = `https://data.counterespionage52.hasura-app.io`;
} else {
  	url = 'http://data.default';
}
headers['X-Hasura-Role'] = 'admin';
headers['X-Hasura-User-Id'] = 1;
app.get('/test', function (req, res) {
	var schemaFetchUrl = url + '/v1/query';
  	var options = {
	    method: 'POST',
	    headers,
	    body: JSON.stringify({
	    	"type" : "select",
	    	"args" : {
	    		"table" : "Posts",
	        	"columns": ["id", "context"]
	        }
	    })
  	};
  	fetch(schemaFetchUrl, options)
   .then(
      (response) => {
        response.text()
          .then(
            (data) => {
              res.send(data);
            },
            (e) => {
              res.send('Error in fetching current schema: ' + err.toString());
            })
          .catch((e) => {
            e.stack();
            res.send('Error in fetching current schema: ' + e.toString());
          });
      },
      (e) => {
        console.error(e);
        res.send('Error in fetching current schema: ' + e.toString());
      })
    .catch((e) => {
      e.stackTrace();
      res.send('Error in fetching current schema: ' + e.toString());
    });
});

app.use(express.static(__dirname + '/html/public'));
app.use(favicon(path.join(__dirname,'html','public','favicon.ico')));
app.get('/public/img1.jpg',function(req,res){
	console.log('Request received for img1.jpg')
	res.sendFile(path.join(__dirname,'/html/public','img1.jpg'));	
});
app.get('/public/img2.png',function(req,res){
	console.log('Request received for img2.png')
	res.sendFile(path.join(__dirname,'/html/public','img2.png'));	
});

app.get('/sidebar.js',function(req,res){
	console.log('Request received for sidebar.js')
	res.sendFile(path.join(__dirname,'/html','sidebar.js'));
});
app.get('/', function (req, res) {
	console.log('Request received for register.html');
	res.sendFile(path.join(__dirname,'/html','dashboard.html'));
});
app.get('/register', function (req, res) {
	console.log('Request received for register.html');
	res.sendFile(path.join(__dirname,'/html','register.html'));
});
app.get('/register.js',function(req,res){
	console.log('Request received for register.js');
	res.sendFile(path.join(__dirname,'/html','register.js'));
});
app.get('/login', function (req, res) {
	console.log('Request received for login.html');
	res.sendFile(path.join(__dirname,'/html','login.html'));
});
app.get('/login.js',function(req,res){
	console.log('Request received for login.js');
	res.sendFile(path.join(__dirname,'/html','login.js'));
});
app.get('/ask-for-request', function(req,res){
	console.log('Request received for ask-for-request.html');
	res.sendFile(path.join(__dirname,'/html','ask-for-request.html'));
});
app.get('/askreq.controller.js',function(req,res){
	console.log('Request received for askreq.controller.js');
	res.sendFile(path.join(__dirname,'/html','askreq.controller.js'));
});
app.get('/my-profile', function(req,res){
	console.log('Request received for my-profile.html');
	res.sendFile(path.join(__dirname,'/html','my-profile.html'));
});
app.get('/myprofile.controller.js',function(req,res){
	console.log('Request received for myprofile.controller.js');
	res.sendFile(path.join(__dirname,'/html','myprofile.controller.js'));
});
app.get('/my-requests', function(req,res){
	console.log('Request received for my-requests.html');
	res.sendFile(path.join(__dirname,'/html','my-requests.html'));
});
app.get('/myreq.controller.js', function(req,res){
	console.log('Request received for myreq.controller.js');
	res.sendFile(path.join(__dirname,'/html','myreq.controller.js'));
});
app.post(url+'/v1/query/',function(req,res){
	console.log(res.body);
});
app.post('https://auth.counterespionage52.hasura-app.io/signup',function(req,res){
	console.log(res.body);
});
app.post('https://auth.counterespionage52.hasura-app.io/login',function(req,res){
	console.log(res.body);
});
app.post('https://auth.counterespionage52.hasura-app.io/user/logout',function(req,res){
	console.log(res.body);
});
app.listen(8080, function () {
	console.log('Example app listening on port 8080!');
});
