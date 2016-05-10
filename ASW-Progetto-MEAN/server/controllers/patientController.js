var Patient = require('../models/patient.js');

module.exports = function (apiRoutesAuth) {

    apiRoutesAuth
        .post('/api/patient', function (req, res, next) {
            var newPatient = req.body;

            Patient.saveNewPatient(newPatient)
                .then(function (result) {

                    res.status(200).json({
                        "success": true,
                        "message": "New patient added",
                        "patient": result
                    });

                    return next();
                })
                .catch(function (error) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error"
                    });
                });

        })

        .get('/api/patients', function (req, res, next) {
            Patient.findAll()
                .then(function (result) {
                    if (!result) {
                        res.status(404).json({
                            "success": false,
                            "message": "Patients not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Patients list",
                            "patients": result
                        });
                    }

                    return next();
                })
                .catch(function (error) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error"
                    });
                });
        })

        .put('/api/patient', function (req, res, next) {
            Patient.modifyPatien(req.body)
                .then(function (result) {
                    res.status(200).json({
                        "success": true,
                        "message": "Patient updated",
                        "patient": result
                    });
                    return next();
                })
                .catch(function (error) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error"
                    });
                });
        })

        .get('/api/patient/:patientId', function (req, res, next) {
            var patientId = req.params.patientId;
            var query = {'_id': patientId};

            Patient.findOne(query)
                .then(function (result) {
                    if (!result) {
                        res.status(404).json({
                            "success": false,
                            "message": "Patient not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Patient",
                            "patient": result
                        });
                    }

                    return next();
                })
                .catch(function (err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error"
                    });
                });
        })

        .delete('/api/patient/:patientId', function (req, res, next) {
            var patientId = req.params.patientId;
            var query = {'_id': patientId};

            Patient.findOne(query)
                .then(function (patient) {
                    var promises = [
                        Patient.deletePatient(query)
                    ];

                    if (patient.doctors && patient.doctors.length > 0) {
                        var doctors = patient.doctors;
                        doctors.forEach(function (currDoc) {
                            var newMethod = Patient.removeDoctorToPatient(patientId, currDoc._id);
                            promises.push(newMethod);
                        });
                    }

                    Q.all(promises)
                        .then(function (results) {
                            res.status(200).json({
                                "success": true,
                                "message": "Doctor removed"
                            });
                            return next();
                        })
                        .catch(function (error) {
                            res.status(500).json({
                                "success": false,
                                "message": "Internal server error"
                            });
                        });

                })
                .catch(function (err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error"
                    });
                });

            //Doctor.deleteDoctor(doctorId)
            //    .then(function (resultDoctor) {
            //        var res = resultDoctor;
            //        return Patient.addDoctorToPatient(doctorId);
            //    })
            //    .then(function (resultPatient) {
            //        res.status(200).json({
            //            "success": true,
            //            "message": "New patient " + patientId + " added to doctor " + doctorId
            //        });
            //        return next();
            //    })
            //    .catch(function (error) {
            //        res.status(500).json({
            //            "success": false,
            //            "message": "Internal server error"
            //        });
            //    });

        });

};
