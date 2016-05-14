angular.module('patientsCtrl', ['patientService', 'doctorsService'])

    .controller('patientsController', function($scope, $q, patientService, doctorsService) {

        $scope.patients = [];
        patientService.getPatients()
            .then(function (result) {
                $scope.patients = result.patients;
            })
            .catch(function (err) {
                console.log("Err: " + err)
            });

        $scope.doctors = [];
        doctorsService.getDoctrors()
            .then(function (result) {
                $scope.doctors = result.doctors;
            })
            .catch(function (err) {
                console.log("Err: " + err)
            });

        $scope.newPatient = {};
        $scope.successAddNewPatient = undefined;
        $scope.addNewPatient = function () {
            if ($scope.newPatient && $scope.newPatient.surname && $scope.newPatient.email && $scope.newPatient.phone_number && $scope.newPatient.address) {
                patientService.addNewPatient($scope.newPatient)
                    .then(function (result) {
                        $scope.patients.push(result.patient);
                        $scope.errorAddNewPatient = undefined;
                        $scope.successAddNewPatient = "Operazione eseguita con successo, il paziente " + result.patient.name + " " + result.patient.surname + " inserito correttamente.";
                        $scope.newPatient = {};
                    })
                    .catch(function (error) {
                        $scope.errorAddNewPatient = "Errore di sistema, il nuovo paziente non è stato inserito.";
                        $scope.successAddNewPatient = undefined;
                    });
            } else {
                $scope.errorAddNewPatient = "Errore nell'inserimento di un nuovo paziente, uno o più campi mancanti.";
                $scope.successAddNewPatient = undefined;
            }
        };

        $scope.patientDetail = function (patient) {
            $scope.currPatient = patient;
            $scope.currPatient.doctorsDetails = [];
            if ($scope.currPatient.doctors.length > 0) {
                var promises = [];
                angular.forEach($scope.currPatient.doctors, function (currDoctorId) {
                    var funCall = doctorsService.getDoctror(currDoctorId);
                    promises.push(funCall);
                });

                $q.all(promises)
                    .then(function (results) {
                        angular.forEach(results, function (currResult) {
                            $scope.currPatient.doctorsDetails.push(currResult.doctor);
                        })
                    })
                    .catch(function (err) {
                        console.log("Err: " + err);
                    })
            }
        };

        $scope.setCurrentPatient = function (patient) {
            $scope.currPatientToModify = angular.copy(patient);
            $scope.currPatientToModify.doctorsDetails = [];
            if ($scope.currPatientToModify.doctors.length > 0) {
                var promises = [];
                angular.forEach($scope.currPatientToModify.doctors, function (currDoctorId) {
                    var funCall = doctorsService.getDoctror(currDoctorId);
                    promises.push(funCall);
                });

                $q.all(promises)
                    .then(function (results) {
                        angular.forEach(results, function (currResult) {
                            $scope.currPatientToModify.doctorsDetails.push(currResult.doctor);
                        })
                    })
                    .catch(function (err) {
                        console.log("Err: " + err);
                    })
            }
        };

        $scope.updatePatient = function (patient) {
            if (patient && patient.name && patient.surname && patient.email && patient.phone_number && patient.address) {
                patientService.modifyPatien(patient)
                    .then(function (resp) {
                        var index = -1;
                        angular.forEach($scope.patients, function (item, currIndex) {
                            if (item._id === resp.patient._id) {
                                index = currIndex;
                            }
                        });

                        $scope.patients[index] = resp.patient;
                        swal("Operazione eseguita", "Dettagli dottore/ssa " + resp.patient.name + " " + resp.patient.surname + " aggiornati", "success");

                    })
                    .catch(function (err) {
                        console.log("Err: " + err);
                    });
            } else {
                swal("Errore di sistema", "Le modifiche non sono state apportate, potrebbero esserci campi mancanti", "error");
            }
        };

        $scope.deletePatient = function (patient) {
            swal({
                title: "Conferma eliminazione",
                text: "Sei sicuro di voler eliminare: " + patient.name + " " + patient.surname + " dalla lista di dottori?" ,
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function() {
                patientService.deletePatient(patient._id)
                    .then(function (result) {
                        var indexOf = $scope.patients.indexOf(patient);
                        $scope.patients.splice(indexOf, 1);
                        swal("Operazione eseguita", "Il dottore è stato eliminato dalla lista");
                    })
                    .catch(function (err) {
                        var indexOf = $scope.patients.indexOf(patient);
                        $scope.patients.splice(indexOf, 1);
                        swal("Operazione eseguita", "Il dottore è stato eliminato dalla lista");
                    });
            });
        };

        $scope.addNewDoctorToPatient = function (doctor) {
            swal({
                title: "Conferma operazione",
                text: "Sei sicuro di voler associare al paziente il dottore: " + doctor.name + " " + doctor.surname + "?" ,
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function() {
                var updatedPatient = $scope.currPatientToModify;
                updatedPatient.doctors.push(doctor._id);
                updatedPatient.doctorsDetails.push(doctor);
                patientService.modifyPatien(updatedPatient)
                    .then(function (result) {
                        var updatedDoctror = doctor;
                        updatedDoctror.patietnts.push(updatedPatient._id);
                        return doctorsService.modifyDoctor(updatedDoctror);
                    })
                    .then(function (secondResult) {
                        swal("Operazione eseguita", "Il dottore è stato aggiunto al paziente: " + updatedPatient.name + " " + updatedPatient.surname);
                    })
                    .catch(function (err) {
                        swal("Operazione non eseguita", "Server error", "error");
                        console.log(err);
                    });
            });
        };

        $scope.removeDoctorToPatient = function (doctor) {
            swal({
                title: "Conferma operazione",
                text: "Sei sicuro di voler eliminare al paziente il dottore: " + doctor.name + " " + doctor.surname + "?" ,
                showCancelButton: true,
                closeOnConfirm: false,
                showLoaderOnConfirm: true,
            }, function() {
                var updatedPatient = $scope.currPatientToModify;
                var indexDoctors = $scope.currPatientToModify.doctors.indexOf(doctor._id);
                var indexDoctorsDetails = $scope.currPatientToModify.doctorsDetails.indexOf(doctor);
                updatedPatient.doctors.splice(indexDoctors, 1);
                updatedPatient.doctorsDetails.splice(indexDoctorsDetails, 1);

                patientService.modifyPatien(updatedPatient)
                    .then(function (result) {
                        var updatedDoctror = doctor;
                         var index = updatedDoctror.patietnts.indexOf(updatedPatient._id);
                        updatedDoctror.patietnts.splice(index, 1);
                        return doctorsService.modifyDoctor(updatedDoctror);
                    })
                    .then(function (secondResult) {
                        swal("Operazione eseguita", "Il dottore è stato rimosso dal paziente: " + updatedPatient.name + " " + updatedPatient.surname);
                    })
                    .catch(function (err) {
                        swal("Operazione non eseguita", "Server error", "error");
                        console.log(err);
                    });
            });
        };

        $scope.forceUpdatePatientsLst = function () {
            var doctorsIds = $scope.currPatientToModify.doctors;
            var doctorsDetail = $scope.currPatientToModify.doctorsDetails;
            angular.forEach($scope.patients, function (item, currIndex) {
                if (item._id === $scope.currPatientToModify._id) {
                    item.doctors = doctorsIds;
                    item.doctorsDetails = doctorsDetail;
                }
            });
        };

    });