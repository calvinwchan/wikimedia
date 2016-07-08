// required packages
var http = require('http')
var path = require('path')
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var express = require('express');
var handlebars = require('express-handlebars');
var logger = require('morgan');
var nodemw = require('nodemw');
textstatistics = require('text-statistics');

var index = require('./routes/index');

var app = express();

// all environments
app.use(logger('dev'));
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser('Calvin Chan'));

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('handlebars', handlebars({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// add routes here
app.get('/', index.view);
app.get('/categorySearch', index.categorySearch);

// initialize globally accessible mediawiki api object
wikiclient = new nodemw({
	server: 'en.wikipedia.org',		// host name of MediaWiki-powered site
	path: '/w',						// path to api.php script
	debug: false					// is more verbose when set to true
});

http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});
