#!/bin/env node
 //  OpenShift sample Node application
var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = {
                'index.html': ''
            };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) {
        return self.zcache[key];
    };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()));
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function() {
        //  Process on exit and signals.
        process.on('exit', function() {
            self.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() {
                self.terminator(element);
            });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.app = express();

        // express 4 POST body
        self.app.use(bodyParser.urlencoded({
            extended: true
        }));
        self.app.use(bodyParser.json());


        self.router = express.Router();

        // Sample custom API
        self.router.get('/', function(req, res) {
            res.json({
                message: 'Our API is working'
            });
        });

        self.router.route('/individuals')
            .get(function(req, res) {
                res.json(self.data);
            })
            .post(function(req, res) {
              req.body.userid = self.dataMaxKey++;
              console.log('API: POST /individuals body='+JSON.stringify(req.body));
              self.data.push(req.body);
              res.status(200).json({'userid':req.body.userid});
            })
            ;
        self.router.route('/individuals/:userid')
            .get(function(req, res) {
                console.log('API: /individuals/:userid ' + req.params.userid);
                var result = self.data.filter(function(item) {
                  return item.userid == req.params.userid;
                });
                if (result.length > 0) {
                  res.json(result[0]);
                } else {
                  res.status(400).json({});
                }
            })
            .put(function(req, res) {
                console.log('API: PUT /individuals userid='+req.params.userid+' body='+JSON.stringify(req.body));
                var result = self.data.filter(function(item) {
                  return item.userid == req.params.userid;
                });
                if (result.length > 0) {
                  var index = self.data.indexOf(result[0]);
                  self.data[index] = req.body;
                  res.json(self.data[index]);
                } else {
                  res.status(400).json({});
                }
            })
            .delete(function(req, res) {
                console.log('API: DELETE /individuals userid='+req.params.userid);
                var result = self.data.filter(function(item) {
                  return item.userid == req.params.userid;
                });
                if (result.length > 0) {
                  self.data.splice(self.data.indexOf(result[0]), 1);
                  res.json(result[0]);
                } else {
                  res.status(400).json({});
                }
            })
            ;
        self.app.use('/api', self.router);

        // AngularJS app
        self.app.use(express.static('public'));

        // CORS
        self.app.use(function(req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }

        // Sample data
        self.data = [{
            userid: 1,
            firstname: 'jane',
            lastname: 'doe'
        }, {
            userid: 2,
            firstname: 'john',
            lastname: 'smith'
        }, {
            userid: 3,
            firstname: 'jeanette',
            lastname: 'lee'
        }, ];

        self.dataMaxKey = self.data.length + 1;

        // Sample API
        //self.app.list()
        //self.routes['/api/individuals'] = function(req, res) {
        //    res.json(self.data);
        //};


    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now()), self.ipaddress, self.port);
        });
    };

}; /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();
