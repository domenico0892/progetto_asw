angular.module('doctorsCtrl', ['doctorsService', 'patientService'])

    .controller('doctorsController', function($scope, $q, doctorsService, patientService) {

        $scope.doctors = [];
        doctorsService.getDoctrors()
            .then(function (result) {
                $scope.doctors = result.doctors;
            })
            .catch(function (err) {
                console.log("Err: " + err)
            });

        $scope.newDoctor = {};
        $scope.addNewDoctor = function () {
            if ($scope.newDoctor && $scope.newDoctor.surname && $scope.newDoctor.name && $scope.newDoctor.type && $scope.newDoctor.address) {
                doctorsService.addNewDoctor($scope.newDoctor)
                    .then(function (result) {
                        $scope.doctors.push(result.doctor);
                        $scope.errorAddNewDoctor = undefined;
                        $scope.successAddNewDoctor = "Operazione eseguita con successo, il dottore " + result.doctor.name + " " + result.doctor.surname + " inserito correttamente.";
                        $scope.newDoctor = {};
                    })
                    .catch(function (error) {
                        $scope.errorAddNewDoctor = "Errore di sistema, il nuovo dottore non è stato inserito.";
                        $scope.successAddNewDoctor = undefined;
                    });
            } else {
                $scope.errorAddNewDoctor = "Errore nell'inserimento di un nuovo dottore, uno o più campi mancanti.";
                $scope.successAddNewDoctor = undefined;
            }
        };

        $scope.setCurrDoctor = function (doctor) {
            $scope.currDoctorToModify = angular.copy(doctor);
        };

        $scope.updateDoctor = function (doctor) {
            if (doctor && doctor.name && doctor.surname && doctor.type && doctor.address) {
                doctorsService.modifyDoctor(doctor)
                    .then(function (resp) {
                        var index = -1;
                        angular.forEach($scope.doctors, function (item, currIndex) {
                            if (item._id === resp.doctor._id) {
                                index = currIndex;
                            }
                        });

                        $scope.doctors[index] = resp.doctor;
                        swal("Operazione eseguita", "Dettagli dottore/ssa " + resp.doctor.name + " " + resp.doctor.surname + " aggiornati", "success");

                    })
                    .catch(function (err) {
                        console.log("Err: " + err);
                    });
            } else {
                swal("Errore di sistema", "Le modifiche non sono state apportate, potrebbero esserci campi mancanti", "error");
            }
        };

        $scope.doctorDetail = function (doctor) {
            var doctorId = doctor._id;
            if (doctorId) {
                doctorsService.getDoctror(doctorId)
                    .then(function (result) {
                        $scope.currDoctor = result.doctor;
                        $scope.currDoctor.patientsDetail = [];
                        if ($scope.currDoctor.patietnts.length > 0) {
                            var promises = [];
                            angular.forEach($scope.currDoctor.patietnts, function (currPatientId) {
                                var funCall = patientService.getPatient(currPatientId);
                                promises.push(funCall);
                            });

                            $q.all(promises)
                                .then(function (results) {
                                    angular.forEach(results, function (currResult) {
                                        $scope.currDoctor.patientsDetail.push(currResult.patient);
                                    })
                                })
                                .catch(function (err) {
                                    console.log("Err: " + err);
                                })
                        }
                    })
                    .catch(function (err) {
                        console.log("Err: " + err);
                    });
            } else {
                console.log("Error on select doctor");
            }
        };

        $scope.deleteDoctor = function (doctor) {
            swal({
                title: "Conferma eliminazione",
                text: "Sei sicuro di voler eliminare: " + doctor.name + " " + doctor.surname + " dalla lista di dottori?" ,
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function() {
                doctorsService.deleteDoctor(doctor._id)
                    .then(function (result) {
                        var indexOf = $scope.doctors.indexOf(doctor);
                        $scope.doctors.splice(indexOf, 1);
                        swal("Operazione eseguita", "Il dottore è stato eliminato dalla lista");
                    })
                    .catch(function (err) {
                        swal("Operazione non eseguita", "Server error", "error");
                        console.log(err);
                    });
            });
        };

    });
