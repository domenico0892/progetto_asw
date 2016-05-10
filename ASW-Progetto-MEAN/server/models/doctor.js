var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var doctorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        },
        address: { type: String },
        type: { type: String },
        updated: {
            type: Date,
            default: Date.now
        },
        patietnts: [ Schema.Types.ObjectId ]
    }
);

var doctorModel = mongoose.model('Doctor', doctorSchema);
module.exports = doctorModel;

/**
 *
 * Doctor functions
 * Utilità per i controllers
 *
 * */
module.exports = {

    findAll: function() {
        var qdef = Q.defer();

        doctorModel.find({}).exec(function (err, result) {
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

    findOne: function(query) {
        var qdef = Q.defer();

        doctorModel.findOne(query).lean().exec(function (err, result) {
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

    saveNewDoctor: function(doctor) {
        var qdef = Q.defer();

        //Non posso inserire dottori con lo stesso nome e cognome
        doctorModel.findOne({surname: doctor.surname}).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } else {

                if(!result || result === null) {
                    result = new doctorModel();
                    result.name = doctor.name;
                    result.surname = doctor.surname;
                    result.address = doctor.address;
                    result.type = doctor.type;
                    //result.patietnts = [];
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

    deleteDoctor: function(query) {
        var qdef = Q.defer();

        doctorModel.remove(query).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } else {
                qdef.resolve(result);
            }
        });

        return (qdef.promise);
    },

    modifyDoctor: function(doctor) {
        var qdef = Q.defer();

        doctorModel.findOne({_id: doctor._id}).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } else {

                if(result || result !== null) {
                    result.name = doctor.name;
                    result.surname = doctor.surname;
                    result.address = doctor.address;
                    result.type = doctor.type;
                    result.patietnts = doctor.patietnts;
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

    addPatientToDoctor: function(patientId, doctorId) {
        var qdef = Q.defer();

        doctorModel.findOne({_id: doctorId}).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } else {

                if(result && result.patietnts.indexOf(patientId) < 0) {
                    result.patietnts.push(patientId);
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

    removePatienToDoctor: function(patientId, doctorId) {
        var qdef = Q.defer();

        doctorModel.findOne({_id: doctorId}).exec(function (err, result) {
            if(err) {
                qdef.reject(err);
            } else {

                if(result && result.patietnts.indexOf(patientId) >= 0) {
                    var index = result.patietnts.indexOf(patientId);
                    result.patietnts.splice(index, 1);
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