(function(){

    'use strict';

    angular
        .module('restApp', ['ngRoute', 'ngSanitize', 'restApp.map', 'ngCookies'])
        .config(config)
        .run(run);

    config.$inject = ['$locationProvider', '$routeProvider'];

    function config($locationProvider, $routeProvider) {

    $routeProvider
        .when('/site/index', {
            controller: 'index',
            templateUrl: 'views/site/index.html'
        })
        .when('/resource/resource', {
            templateUrl: 'views/resource/resource.html'
        })
        .when('/site/about', {
            templateUrl: 'views/site/about.html'
        })
        .when('/site/contact', {
            templateUrl: 'views/site/contact.html'
        })
        .when('/site/user_reg', {
            templateUrl: 'views/site/about.html',
            controller: 'index'
        })
        .when('/resource/index', {
            templateUrl: 'views/resource/resource.html',
            controller: 'index'
        })
        .when('/resource/create', {
            templateUrl: 'views/resource/create_resource.html',
            controller: 'index'
        })
        .when('/resource/update/:resourceId', {
            templateUrl: 'views/resource/update_resource.html',
            controller: 'update',
            resolve: {
                resourceId: function($route){
                    return $route.current.params.resourceId;
                }
            }
        })
        .when('/resource/delete/:resourceId', {
            templateUrl: 'views/resource/resource.html'
        })
        .when('/site/login', {
            controller: 'LoginController',
            templateUrl: 'views/site/login.html',
            controllerAs: 'vm'
        })
        .when('/site/registration', {
            controller: 'RegistrationCtrl',
            templateUrl: 'views/site/registration.html',
            controllerAs: 'reg'
        })
        .when('/site/restorepassword', {
            controller: 'LoginController',
            templateUrl: 'views/site/restorepassword.html',
            controllerAs: 'vm'
        })
        .when('/site/home', {
            controller: 'index',
            templateUrl: 'views/site/home.html'
        })
        .otherwise({
            redirectTo: '/resource/index'
        });

        $locationProvider.html5Mode(true).hashPrefix('!');
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http){


        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            var test = localStorage.getItem('username');
            /*if (!test) {
                $location.path('/site/login');
            }*/
            console.log('change');
        });
    }

})();
