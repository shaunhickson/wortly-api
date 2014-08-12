var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

mongoose.connect('mongodb://localhost/wortly');
var Bar = require('./models/bar');

var router = express.Router();

router.use(function(req, res, next){
	console.log('Processing request: ' + JSON.stringify(req.body));
	next();
});

router.get('/', function(req, res) {
	res.json({message: 'api test successful'});
});

router.route('/bars')
	.post(function(req, res) {
		var bar = new Bar();
		bar.name = req.body.name;
		bar.address = req.body.address;
		bar.zip = req.body.zip;
		setLocation(bar, req);

		bar.save(function(err) {
			if (err) 
				res.send(err);
			res.json({message: 'Bar created'});
		});
	})

	.get(function(req, res) {
		Bar.find(function(err, bars){
			if (err) 
				res.send(err);
			res.json(bars);
		});
	});

router.route('/bars/:bar_id')
	.get(function(req, res){
		Bar.findById(req.params.bar_id, function(err, bar){
			if (err)
				res.send(err);
			res.json(bar);
		});
	})

	.put(function(req, res){
		Bar.findById(req.params.bar_id, function(err, bar){
			if (err)
				res.send(err);

			if (req.body.loc) {
				setLocation(bar, req);
				delete req.body.loc;
			}
			for (var prop in req.body) {
				bar[prop] = req.body[prop];
			}

			bar.save(function(err){
				if (err)
					res.send(err);
				res.json({message: 'Bar updated!'});
			});
		});
	})

	.delete(function(req, res){
		Bar.remove({
			_id: req.params.bar_id
		}, function( err, bar){
			if (err)
				res.send(err);
			res.json({message: 'Successfuly deleted'})
		});
	});

function setLocation(bar, req) {
	var locPoints = JSON.parse(req.body.loc);
	var locData = {type: 'Point', coordinates: locPoints};
	bar.loc = locData;
}

app.use('/api', router);

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip_addr = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
app.listen(port, ip_addr, function() {
	console.log('Listening on port ' + port + ' on server ' + ip_addr);
});

