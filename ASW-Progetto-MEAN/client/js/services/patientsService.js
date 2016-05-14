angular.module('patientService', [])

    .factory('patientService', ['$q', '$http', function ($q, $http) {

        return {
            getPatients: function () {
                var deferred = $q.defer();

                var req = {
                    method: 'GET',
                    url: '/api/patients'
                };

                $http(req).success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                        console.log('patientService.getPatients: Error ' + data.error);
                    });

                return deferred.promise;
            },

            getPatient: function (patientId) {
                var deferred = $q.defer();

                var req = {
                    method: 'GET',
                    url: '/api/patient/' + patientId
                };

                $http(req).success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                        console.log('patientService.getPatients: Error ' + data.error);
                    });

                return deferred.promise;
            },

            addNewPatient: function (newDoctor) {
                var deferred = $q.defer();

                var req = {
                    method: 'POST',
                    url: '/api/patient',
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

            modifyPatien: function (patient) {
                var deferred = $q.defer();

                var req = {
                    method: 'PUT',
                    url: '/api/patient',
                    data: patient
                };

                $http(req).success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                        console.log('patientService.modifyPatien: Error ' + data.error);
                    });

                return deferred.promise;
            },

            deletePatient: function (patientId) {
                var deferred = $q.defer();

                var req = {
                    method: 'DELETE',
                    url: '/api/patient/' + patientId
                };

                $http(req).success(function (data) {
                        deferred.resolve(data);
                    })
                    .error(function (data) {
                        deferred.reject(data);
                        console.log('patientService.deleteDoctor: Error ' + data.error);
                    });

                return deferred.promise;
            }

        };

    }]);