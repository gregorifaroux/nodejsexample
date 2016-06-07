var app = angular.module('plunker', ['ngResource']);

app.service('UserService', function($resource) {
    var User = $resource('/api/individuals/:userid', {
        userid: '@userid'
    }, {
        'update': {
            method: 'PUT'
        }
    });

    this.getUsers = function() {
        return User.query();
    }

    this.newUser = function() {
        return new User();
    }

    this.findById = function(anId) {
        if (anId) {
            return User.get({
                'userid': anId
            });
        }
        return 'No id specified';
    }

    this.deleteById = function(anId) {
        if (!anId) {
            return;
        }
        return User.delete({
            'userid': anId
        });
    }

    this.save = function(anUser, aCallback) {
        if (anUser.userid) {
            anUser.$update(aCallback);
        } else {
            anUser.$save(aCallback);
        }
    }

});

app.controller('MainCtrl', function($scope, $http, $q, UserService) {
    var vm = this;
    vm.name = 'World';
    vm.individualToSave = UserService.newUser();
    vm.individuals = UserService.getUsers();
    vm.query = {
        userid: '',
        result: ''
    };

    vm.save = function() {
        UserService.save(vm.individualToSave, function(item, putResponseHeaders) {
            vm.individuals = UserService.getUsers();
        });
        vm.individualToSave = UserService.newUser();
    }

    vm.search = function() {
        vm.query.result = UserService.findById(vm.query.userid);
    }

    vm.edit = function(anUserId) {
        var result = vm.individuals.filter(function(item) {
            return item.userid == anUserId;
        });
        if (result.length > 0) {
            vm.individualToSave = angular.copy(result[0]);
        }
    }

    vm.cancel = function() {
        vm.individualToSave = UserService.newUser();
    }

    vm.delete = function(anUserId) {
        UserService.deleteById(anUserId);
        var result = vm.individuals.filter(function(item) {
            return item.userid == anUserId;
        });
        if (result.length > 0) {
            vm.individuals.splice(vm.individuals.indexOf(result[0]), 1);
        }

    }
});
