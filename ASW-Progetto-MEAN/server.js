var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

var log4js = require('log4js');
var logger = log4js.getLogger();

var db = require('./server/config/db');

var port = process.env.PORT || 3000;
mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/client')); // settings dei file statici location /public/img will be /img for users

require('./server/routes')(app, express);

app.listen(port);	
logger.info('Applicazione in ascolto sulla porta: ' + port);
exports = module.exports = app;