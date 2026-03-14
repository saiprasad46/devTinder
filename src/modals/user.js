const mongoose = require("mongoose");
var validator = require('validator');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    maxLength: 50
  },
  lastName: {
    type: String,
    required: true,
    maxLength: 50
  },
  age: {
    type: Number,
    required: false,
    min: 18
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  mobileNumber: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return validator.isMobilePhone(v, 'any', { strictMode: false });
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  skills: {
    type: [String],
    required: false,
    validate: {
      validator: function (v) {
        // if field is not provided, skip validation
        if (v === undefined || v === null) return true;
        // ensure it's an array and has at most 10 items
        return Array.isArray(v) && v.length <= 10;
      },
      message: props => `Number of skills should not be greater than 10!`
    }
  },
  photo: {
    type: String,
    required: false,
    validate: {
      validator: function (v) {
        return validator.isURL(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  }
},{ timestamps: true });

 

module.exports = mongoose.model("User", userSchema);