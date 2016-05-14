var Doctor = require('../models/doctor.js');
var Patient = require('../models/patient.js');
var Q = require('q');

module.exports = function (apiRoutesAuth) {

    apiRoutesAuth
        .post('/api/doctor', function (req, res, next) {
            var newDoctor = req.body;

            Doctor.saveNewDoctor(newDoctor)
                .then(function (result) {

                    res.status(200).json({
                        "success": true,
                        "message": "New doctor added",
                        "doctor": result
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

        .get('/api/doctors', function (req, res, next) {
            Doctor.findAll()
                .then(function (result) {
                    if (!result || result.length == 0) {
                        res.status(404).json({
                            "success": false,
                            "message": "Doctors not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Doctors list",
                            "doctors": result
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

        .get('/api/doctor/:doctorId', function (req, res, next) {
            var doctorId = req.params.doctorId;
            var query = {'_id': doctorId};

            Doctor.findOne(query)
                .then(function (result) {
                    if (!result) {
                        res.status(404).json({
                            "success": false,
                            "message": "Doctor not found"
                        });
                    } else {
                        res.status(200).json({
                            "success": true,
                            "message": "Doctor",
                            "doctor": result
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

        .put('/api/doctor', function (req, res, next) {
            Doctor.modifyDoctor(req.body)
                .then(function (result) {
                    res.status(200).json({
                        "success": true,
                        "message": "Doctor updated",
                        "doctor": result
                    });
                    //return next();
                })
                .catch(function (error) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error"
                    });
                });
        })

        .delete('/api/doctor/:doctorId', function (req, res, next) {
            var doctorId = req.params.doctorId;
            var query = {'_id': doctorId};

            Doctor.findOne(query)
                .then(function (doctor) {
                    var promises = [
                        Doctor.deleteDoctor(query)
                    ];

                    if (doctor.patietnts && doctor.patietnts.length > 0) {
                        var patients = doctor.patietnts;
                        patients.forEach(function (currPatient) {
                            var newMethod = Patient.removeDoctorToPatient(currPatient, doctorId);
                            promises.push(newMethod);
                        });
                    }

                    Q.all(promises)
                        .then(function (results) {
                            res.status(200).json({
                                "success": true,
                                "message": "Doctor removed",
                                "result": results
                            });
                            //return next();
                        })
                        .catch(function (error) {
                            res.status(500).json({
                                "success": false,
                                "message": "One promises failded",
                                "error": error
                            });
                        });

                })
                .catch(function (err) {
                    res.status(500).json({
                        "success": false,
                        "message": "Internal server error",
                        "error": err
                    });
                });



        });

};