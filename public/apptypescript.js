var nodejsexample;
(function (nodejsexample) {
    var MainCtrl = (function () {
        function MainCtrl(api) {
            this.api = api;
            console.log("home.controller constructor " + this.api.getUsername());
            var vm = this;
            vm.individualToSave = vm.api.newUser();
            vm.query = {
                userid: 1,
                result: null
            };
            var myUser = new Api.User(vm.api);
            myUser.init(null, 'Neville', 'Stackoverflow');
            console.log('Debug Stackoverflow: ' + myUser.toString());
            console.log('Debug Stackoverflow firstname: ' + myUser.getFirstname());
            myUser.save();
            vm.individuals = vm.api.getUsers();
        }
        MainCtrl.prototype.save = function () {
            var vm = this;
            console.log('save: ' + JSON.stringify(vm.individualToSave));
            vm.api.save(vm.individualToSave, function (item, putResponseHeaders) {
                vm.individuals = vm.api.getUsers();
            });
            vm.individualToSave = vm.api.newUser();
        };
        MainCtrl.prototype.search = function () {
            var vm = this;
            vm.query.result = vm.api.findById(vm.query.userid);
        };
        MainCtrl.prototype.edit = function (anUserId) {
            var vm = this;
            var result = vm.individuals.filter(function (item) {
                return item.userid == anUserId;
            });
            if (result.length > 0) {
                vm.individualToSave = angular.copy(result[0]);
            }
        };
        MainCtrl.prototype.cancel = function () {
            var vm = this;
            vm.individualToSave = vm.api.newUser();
        };
        MainCtrl.prototype.delete = function (anUserId) {
            var vm = this;
            vm.api.deleteById(anUserId);
            var result = vm.individuals.filter(function (item) {
                return item.userid == anUserId;
            });
            if (result.length > 0) {
                vm.individuals.splice(vm.individuals.indexOf(result[0]), 1);
            }
        };
        MainCtrl.$inject = ['apiService'];
        return MainCtrl;
    }());
    console.log('app.ts ... started!');
    angular.module('nodejsexample', ['Api'])
        .controller('MainCtrl', MainCtrl);
})(nodejsexample || (nodejsexample = {}));
