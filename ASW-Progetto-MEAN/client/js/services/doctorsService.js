angular.module('doctorsService', [])

    .factory('doctorsService', ['$q', '$http', function ($q, $http) {

        return {
            getDoctrors: function () {
                var deferred = $q.defer();

                var req = {
                    method: 'GET',
                    url: '/api/doctors'
                };

                $http(req).success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);

                        console.log('doctorServive.getDoctrors: Error ' + data.error);
                    });

                return deferred.promise;
            },

            getDoctror: function (doctorId) {
                var deferred = $q.defer();

                var req = {
                    method: 'GET',
                    url: '/api/doctor/' + doctorId
                };

                $http(req).success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);

                        console.log('doctorServive.getDoctrors: Error ' + data.error);
                    });

                return deferred.promise;
            },

            addNewDoctor: function (newDoctor) {
                var deferred = $q.defer();

                var req = {
                    method: 'POST',
                    url: '/api/doctor',
                    data: newDoctor
                };

                $http(req).success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                        console.log('patientService.addNewDoctor: Error ' + data.error);
                    });

                return deferred.promise;
            },

            modifyDoctor: function (doctor) {
                var deferred = $q.defer();

                var req = {
                    method: 'PUT',
                    url: '/api/doctor',
                    data: doctor
                };

                $http(req).success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                        console.log('patientService.addNewDoctor: Error ' + data.error);
                    });

                return deferred.promise;
            },

            deleteDoctor: function (doctorId) {
                var deferred = $q.defer();

                var req = {
                    method: 'DELETE',
                    url: '/api/doctor/' + doctorId
                };

                $http(req).success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                        console.log('patientService.deleteDoctor: Error ' + data.error);
                    });

                return deferred.promise;
            },
        };

    }]);