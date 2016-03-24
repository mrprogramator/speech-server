var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var request = require('request');
var fs = require('fs');
var url = require('url');

// Put these statements before you define any routes.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use(express.static(__dirname + ''));

app.listen(process.env.PORT || 8080, function () {
  console.log('listening...');
});



app.get('/get-speech', function (req, res) {
	console.log('requesting speech...');

	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;

	message = query.t;
	voice = query.r;
	
	console.log('message:', message, 'voice:', voice);

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
		if (error) { 
			console.log('error getting requesttoken:', error);
			res.send(error);
		}

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
			    url: "http://api.naturalreaders.com/v2/tts/?t=" + message + "&r=" + voice + "&s=1&requesttoken=" + x.requesttoken,
			    method: 'POST',
			    headers: headers2,
			}
			var c = request(options2, function (err){
				if (err) { 
					console.log('error getting audio:'. err);
					res.send(error);
				}
			})

			c.pipe(res);
	    }
	})
});
