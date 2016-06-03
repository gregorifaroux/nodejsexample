var express         = require('express');
var dateFormat      = require('dateformat');
var users           = require('../models/users');
var validation      = require('../middleware/validation');

var usersRoute = express.Router();

//Checks for a valid token
validation.isLoggedIn(usersRoute);


usersRoute.get('/get', function(req, res) {

    //If no date was passed in - just use todays date

    var date    = req.query.date || dateFormat(new Date(), 'yyyy-mm-dd'),
        search  = req.query.search;

    users.getAllUsers(date, search)
        .then(function(results) {
           res.json(results);
        }, function(err) {
            res.status(500).json({
                success: false,
                message: 'Server error.',
                data: []
            });
        });
});

module.exports = usersRoute;
