module nodejsexample {

    class MainCtrl {
        static $inject = ['apiService'];
        individuals: Api.IUser[];
        individualToSave: Api.IUser;
        query: {
            userid: number,
            result: Api.IUser
        };

        constructor(private api: Api.ApiService) {
            console.log("home.controller constructor " + this.api.getUsername());
            var vm = this;

            vm.individualToSave = vm.api.newUser();
            vm.individuals = vm.api.getUsers();
            vm.query = {
                userid: 1,
                result: null
            };

        }

        save(): void {
            var vm = this;
            console.log('save: ' + JSON.stringify(vm.individualToSave));
            vm.api.save(vm.individualToSave, function(item, putResponseHeaders) {
                vm.individuals = vm.api.getUsers();
            });
            vm.individualToSave = vm.api.newUser();
        }

        search() {
            var vm = this;
            vm.query.result = vm.api.findById(vm.query.userid);
        }

        edit(anUserId): void {
            var vm = this;
            var result = vm.individuals.filter(function(item) {
                return item.userid == anUserId;
            });
            if (result.length > 0) {
                vm.individualToSave = angular.copy(result[0]);
            }
        }

        cancel(): void {
            var vm = this;
            vm.individualToSave = vm.api.newUser();
        }

        delete(anUserId) {
            var vm = this;
            vm.api.deleteById(anUserId);
            var result = vm.individuals.filter(function(item) {
                return item.userid == anUserId;
            });
            if (result.length > 0) {
                vm.individuals.splice(vm.individuals.indexOf(result[0]), 1);
            }

        }
    }


    console.log('app.ts ... started!');


    angular.module('nodejsexample', ['Api'])
        .controller('MainCtrl', MainCtrl)
        ;


}
