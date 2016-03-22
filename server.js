var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');

// Put these statements before you define any routes.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(express.static(__dirname + ''));

app.listen(process.env.PORT || 8080, function () {
  console.log('listening...');
});



app.post('/get-speech', function (req, res) {
	console.log('requesting speech');
	message = "hola mundo";
	
	var headers = {
	    'User-Agent':       'Super Agent/0.0.1',
	    'Content-Type':     'application/json'
	}
	 
	var options = {
	    url: 'http://api.naturalreaders.com/v2/auth/requesttoken?callback=?&appid=pelc790w2bx&appsecret=2ma3jkhafcyscswg8wgk00w0kwsog4s',
	    method: 'POST',
	    headers: headers,
	}
	 
	request(options, function (error, response, body) {
	    if (!error && response.statusCode == 200) {

	    	body = body.replace('?','');
	    	body = body.replace('(','');
	    	body = body.replace(')','');
	    	body = body.replace(';','');

	        var x = JSON.parse(body);

	        var headers2 = {
			    'Content-Type':'audio/mp3'
			}
			var options2 = {
			    url: "http://api.naturalreaders.com/v2/tts/?t='" + message + "'&r=" + 19 + "&s=1&requesttoken=" + x.requesttoken,
			    method: 'POST',
			    headers: headers2,
			}
			request(options2, function (err, respo, bod){
				if (!err && respo.statusCode == 200) {
					console.log(bod);
					res.send(bod);
				}
			})
	    }
	})
});
