module Api {


    export interface IUser extends ng.resource.IResource<IUser> {
        userid: number;
        firstname: string;
        lastname: string;
    }

    export interface IUserResource extends ng.resource.IResourceClass<IUser> {
        update(IUser): IUser
    }


    export class ApiService {
        static $inject = ['$resource'];
        UserResource: IUserResource;

        constructor(private $resource: ng.resource.IResourceService) {
            console.log("ApiService constructor ");
        
            this.UserResource = <IUserResource>this.$resource('/api/individuals/:userid',
                {userid: '@userid'},
                {
                    'update': {
                               method: 'PUT',
                               isArray: false
                           }
                });
        }

        public getUsername(): String {
            return "gregorifaroux@gmail.com";
        }

        public getUserResource(): IUserResource {
            return this.UserResource;
        }

        public getUsers(): IUser[] {
            return this.UserResource.query();
        }

        public newUser(): IUser {
            return new this.UserResource();
        }

        public findById(anId: number): IUser {
            if (anId) {
                return this.UserResource.get({
                    'userid': anId
                });
            }
            return this.newUser();
        }

        public deleteById(anId): IUser {
            if (!anId) {
                return;
            }
            return this.UserResource.delete({
                'userid': anId
            });
        }

        public save(anUser: IUser, aCallback: Function): void {
            console.log('Service.save ' + JSON.stringify(anUser));
            if (anUser.userid) {
                this.UserResource.update(anUser).$promise.then((result) => { aCallback() }, (reason) => {
                    console.error('Api.save ERROR ' + JSON.stringify(reason));
                });
            } else {
                anUser.$save(aCallback);
            }
        }
    }

    angular.module('Api', ['ngResource']).service('apiService', ApiService);
}
