
var app = angular.module('plunker', []);

app.service('UserService', function ($http, $q) {
  this.getUsers = function (date, search) {
  return $http.get('/get', {
      params: {
        date: date,
        search: search
      }
    })
    .then(getData)
    .catch(handleErr);
  }

  function getData(response) {
    console.log('status: ' + reponse.status + ' - ' + response.message);
    return response.data;
  }

  function handleErr(err) {
    console.log(JSON.stringify(err));
    console.log('status: ' + err.status + ' Err= ' + err.data.message);
    console.log('Could not retrieve users.', err.data.message, 'Ooops');
    return $q.reject(err);
  }
});

app.controller('MainCtrl', function($scope, $http, $q, UserService) {
  var vm = $scope;
  vm.name = 'World';
  UserService.getUsers(new Date(), '*');

});
