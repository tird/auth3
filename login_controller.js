(function () {
    'use strict';

    angular
        .module('restApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location', '$scope', '$http'];
    function LoginController($location,  $scope, $http) {

        var vm = this;

        if($location.search().p){
            console.log($location.search().p);
            vm.resetForm = true;
            console.log(vm.resetForm);
        } else {
            vm.resetForm = false;
            console.log(vm.resetForm);
        }

        vm.user = {
            username: '',
            password: '',
            rememberMe: 1
        };

        vm.logIn = function(){

            vm.user.username = vm.username;
            vm.user.password = vm.password;

            vm.send = function () {
                return $http.post('rest.php/users/login', vm.user)
                    .then(successHandler)
                    .catch(errorHandler);
                function successHandler(result) {
                    console.log(result);
                    localStorage.setItem('username',vm.username);
                    alert('success');
                    $location.path('/resource/index');

                }
                function errorHandler(result){
                    alert(result.data[0].message);
                    console.log(result.data[0].message);
                }
            };
            vm.send();
        };

        vm.restorePassword = function(){
            console.log('restore');
            vm.json = {
                username: vm.username
            };
            return $http.post('rest.php/users/restorepass', vm.json)
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(result) {
                console.log(result);
                alert('Повідомлення успішно відправлено на вашу електронну скриньку!');
                //$location.path('/resource/index');
            }
            function errorHandler(result){
                alert(result.data.message);
                console.log(result.data.message);
            }

        };
        vm.sendNewPassword = function(){
            console.log('send_new_password');
            vm.json = {
                username: $location.search().u,
                token: $location.search().p,
                password: vm.password
            };
            console.log(vm.json);
            return $http.post('rest.php/users/changepass', vm.json)
                .then(successHandler)
                .catch(errorHandler);
            function successHandler(result) {
                console.log(result);
                alert('success');
                //$location.path('/resource/index');
            }
            function errorHandler(result){
                alert(result.data.message);
                console.log(result.data.message);
            }

        };
    }

})();
