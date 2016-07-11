var Api;
(function (Api) {
    var User = (function () {
        function User(api) {
            this.user = api.newUser();
        }
        User.prototype.init = function (userid, firstname, lastname) {
            this.user.userid = userid;
            this.user.firstname = firstname;
            this.user.lastname = lastname;
        };
        User.prototype.getFirstname = function () {
            return this.user.firstname;
        };
        User.prototype.getLastname = function () {
            return this.user.lastname;
        };
        User.prototype.toString = function () {
            return JSON.stringify(this.user);
        };
        User.prototype.save = function () {
            return this.user.$save();
        };
        User.$inject = ['apiService'];
        return User;
    }());
    Api.User = User;
    var ApiService = (function () {
        function ApiService($resource) {
            this.$resource = $resource;
            console.log("ApiService constructor ");
            this.UserResource = this.$resource('/api/individuals/:userid', { userid: '@userid' }, {
                'update': {
                    method: 'PUT',
                    isArray: false
                }
            });
        }
        ApiService.prototype.getUsername = function () {
            return "gregorifaroux@gmail.com";
        };
        ApiService.prototype.getUserResource = function () {
            return this.UserResource;
        };
        ApiService.prototype.getUsers = function () {
            return this.UserResource.query();
        };
        ApiService.prototype.newUser = function () {
            return new this.UserResource();
        };
        ApiService.prototype.findById = function (anId) {
            if (anId) {
                return this.UserResource.get({
                    'userid': anId
                });
            }
            return this.newUser();
        };
        ApiService.prototype.deleteById = function (anId) {
            if (!anId) {
                return;
            }
            return this.UserResource.delete({
                'userid': anId
            });
        };
        ApiService.prototype.save = function (anUser, aCallback) {
            console.log('Service.save ' + JSON.stringify(anUser));
            if (anUser.userid) {
                this.UserResource.update(anUser).$promise.then(function (result) { aCallback(); }, function (reason) {
                    console.error('Api.save ERROR ' + JSON.stringify(reason));
                });
            }
            else {
                anUser.$save(aCallback);
            }
        };
        ApiService.$inject = ['$resource'];
        return ApiService;
    }());
    Api.ApiService = ApiService;
    angular.module('Api', ['ngResource']).service('apiService', ApiService);
})(Api || (Api = {}));
