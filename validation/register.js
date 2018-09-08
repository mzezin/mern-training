const Validator = require('validator');
const isEmpty = require('./is-empty');

const validateRegisterinput = (data) => {
  const errors = {};

  data.name = !isEmpty ? data.name : '';
  data.email = !isEmpty ? data.email : '';
  data.password = !isEmpty ? data.password : '';
  data.password2 = !isEmpty ? data.password2 : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }

  // if (!Validator.isEmail(data.email)) {
  //   errors.email = 'Email is not valid';
  // }

  // if (Validator.isEmpty(data.email)) {
  //   errors.email = 'Email field is required';
  // }

  // if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
  //   errors.password = 'Password must be between 6 and 30 characters';
  // }

  // if (Validator.isEmpty(data.password)) {
  //   errors.password = 'Password field is required';
  // }

  // if (!Validator.equals(data.password, data.password2)) {
  //   errors.email = 'Passwords must match';
  // }

  // if (Validator.isEmpty(data.password2)) {
  //   errors.password2 = 'Confirm password field is required';
  // }

  return { errors, isValid: isEmpty(errors) };
};

module.exports = validateRegisterinput;