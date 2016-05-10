angular.module('patientsCtrl', ['patientService'])

    .controller('patientsController', function($scope, patientService) {

        $scope.patients = [];
        patientService.getPatients()
            .then(function (result) {
                $scope.patients = result.patients;
            })
            .catch(function (err) {
                console.log("Err: " + err)
            });

        $scope.newPatient = {};
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
        };

        $scope.setCurrDoctor = function (patient) {
            $scope.currPatientToModify = angular.copy(patient);
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
                        console.log(err);
                    });
            });
        };

    });