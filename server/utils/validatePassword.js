const getPasswordPolicies = require('./getPasswordPolicies');

const validatePassword = async (password) => {
  const policy = await getPasswordPolicies();
  
  if (!policy) {
    throw new Error('Password policies not found');
  }

  const errors = [];

  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
  }
  
  if (password.length > policy.maxLength) {
    errors.push(`Password must be no more than ${policy.maxLength} characters long`);
  }
  
  const upperCaseCount = (password.match(/[A-Z]/g) || []).length;
  if (upperCaseCount < policy.minUpperCase) {
    errors.push(`Password must contain at least ${policy.minUpperCase} uppercase letter(s)`);
  }

  const lowerCaseCount = (password.match(/[a-z]/g) || []).length;
  if (lowerCaseCount < policy.minLowerCase) {
    errors.push(`Password must contain at least ${policy.minLowerCase} lowercase letter(s)`);
  }

  const numberCount = (password.match(/\d/g) || []).length;
  if (numberCount < policy.minNumbers) {
    errors.push(`Password must contain at least ${policy.minNumbers} number(s)`);
  }

  const specialCharCount = (password.match(/[^A-Za-z0-9]/g) || []).length;
  if (specialCharCount < policy.minSpecialChars) {
    errors.push(`Password must contain at least ${policy.minSpecialChars} special character(s)`);
  }

  return errors;
};

module.exports = validatePassword;
