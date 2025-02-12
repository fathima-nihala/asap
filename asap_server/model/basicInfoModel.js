const mongoose = require('mongoose');

const basicInfoSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: [true, "Please enter date of birth"]
    },
    gender: {
        type: String,
        required: [true, "Please select gender"],
        enum: ['Male', 'Female', 'Non-Binary']
    },
    aadhar: {
        type: String,
        required: [true, "Please enter Aadhar number"],
        validate: {
            validator: function(v) {
                return /^\d{12}$/.test(v);
            },
            message: props => `${props.value} is not a valid Aadhar number!`
        }
    },
    address: {
        type: String,
        required: [true, "Please enter address"]
    },
    state: {
        type: String,
        required: [true, "Please select state"]
    },
    district: {
        type: String,
        required: [true, "Please select district"]
    },
    pincode: {
        type: String,
        required: [true, "Please enter pincode"],
        validate: {
            validator: function(v) {
                return /^\d{6}$/.test(v);
            },
            message: props => `${props.value} is not a valid pincode!`
        }
    },
    parent_name: {
        type: String,
        required: [true, "Please enter parent/guardian name"]
    },
    parent_number: {
        type: String,
        required: [true, "Please enter parent/guardian number"],
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('BasicInfo', basicInfoSchema);