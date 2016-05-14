var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var patientSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone_number: {
            type: String,
            required: true
        },
        updated: {
            type: Date,
            default: Date.now
        },
        doctors: [ Schema.Types.ObjectId ]
    }
);

var patientModel = mongoose.model('Patient', patientSchema);
module.exports = patientModel;


/**
 *
 * Patient functions
 * Utilità per i controllers
 *
 * */
module.exports = {

    findOne: function(query) {
        var qdef = Q.defer();

        patientModel.findOne(query).lean().exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } if(!result) {
                qdef.resolve();
            } else {
                qdef.resolve(result);
            }
        });

        return (qdef.promise);
    },

    findAll: function() {
        var qdef = Q.defer();

        patientModel.find({}).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } if(!result) {
                qdef.reject(err);
            } else {
                qdef.resolve(result);
            }
        });

        return (qdef.promise);
    },

    saveNewPatient: function(patient) {
        var qdef = Q.defer();

        //Non posso inserire sudenti con lo stessa nome e cognome
        patientModel.findOne({name: patient.name, surname: patient.surname}).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } else {

                if(!result || result == null) {
                    result = new patientModel();
                    result.name = patient.name;
                    result.surname = patient.surname;
                    result.email = patient.email;
                    result.address = patient.address;
                    result.phone_number = patient.phone_number;
                }

                result.save(function (err) {
                    if(err) {
                        qdef.reject(err);
                    } else {
                        qdef.resolve(result);
                    }
                });
            }
        });

        return (qdef.promise);
    },

    modifyPatien: function(patient) {
        var qdef = Q.defer();

        patientModel.findOne({_id: patient._id}).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } else {

                if(result || result !== null) {
                    result.name = patient.name;
                    result.surname = patient.surname;
                    result.address = patient.address;
                    result.phone_number = patient.phone_number;
                    result.email = patient.email;
                    result.doctors = patient.doctors;

                }

                result.save(function (err) {
                    if(err) {
                        qdef.reject(err);
                    } else {
                        qdef.resolve(result);
                    }
                });
            }
        });

        return (qdef.promise);
    },

    deletePatient: function(query) {
        var qdef = Q.defer();

        patientModel.remove(query).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } else {
                qdef.resolve(result);
            }
        });

        return (qdef.promise);
    },

    addDoctorToPatient: function(patientId, doctorId) {
        var qdef = Q.defer();

        patientModel.findOne({_id: patientId}).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } else {

                if(result && result.doctors.indexOf(doctorId) < 0) {
                    result.doctors.push(doctorId);
                    result.save(function (err) {
                        if (err) {
                            qdef.reject(err);
                        } else {
                            qdef.resolve(result);
                        }
                    });
                } else {
                    qdef.reject(err);
                }
            }
        });

        return (qdef.promise);
    },

    removeDoctorToPatient: function(patientId, doctorId) {
        var qdef = Q.defer();

        patientModel.findOne({_id: patientId}).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } else {

                if(result && result.doctors.indexOf(doctorId) >= 0) {
                    var index = result.doctors.indexOf(doctorId);
                    result.doctors.splice(index, 1);
                    result.save(function (err) {
                        if (err) {
                            qdef.reject(err);
                        } else {
                            qdef.resolve(result);
                        }
                    });
                } else {
                    qdef.reject(err);
                }
            }
        });

        return (qdef.promise);
    },

};