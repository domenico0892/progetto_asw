angular.module('aswProgetto', [
    'ngRoute',
    'mainCtrl',
    'doctorsService',
    'patientService',
    'patientsCtrl',
    'doctorsCtrl'
])

    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

        $routeProvider

            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'mainController'
            })

            .when('/doctors', {
                templateUrl: 'views/doctorsView.html',
                controller: 'doctorsController'
            })

            .when('/patients', {
                templateUrl: 'views/patientsView.html',
                controller: 'patientsController'
            })

            .otherwise({
                redirectTo: '/'
            });


        //$locationProvider.html5Mode(true);

    }]);