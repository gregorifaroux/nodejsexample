
var app = angular.module('plunker', ['ngResource']);

app.service('UserService', function ($resource) {
  var User = $resource('/api/individuals/:userid');

  this.getUsers = function () {
    return User.query();
  }

  this.newUser = function() {
    return new User();
  }

  this.findById = function(anId) {
    console.log('find by id '+anId);
    return User.get({'userid': anId});
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
    console.log('save '+JSON.stringify(vm.individualToSave));
    vm.individualToSave.$save(function(item, putResponseHeaders) {
      console.log('new id:'+ JSON.stringify(item));
      vm.individuals = UserService.getUsers();
    });
    vm.individualToSave = UserService.newUser();
  }

  vm.search = function() {
    console.log('search for '+vm.query.userid);
    vm.query.result = UserService.findById(vm.query.userid);
  }
});
