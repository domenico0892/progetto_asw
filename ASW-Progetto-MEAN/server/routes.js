/**
 *	Dispatcher
 * */
module.exports = function(app, express) {

	app.get('/', function(req, res) {
		res.sendfile('./client/index.html');
	});

	var router = express.Router();

	require('./controllers/doctorController.js')(app, router);

	require('./controllers/patientController.js')(app, router);

	app.use('/', router);

};