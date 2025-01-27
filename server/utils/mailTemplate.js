const generateEmailTemplate = (verificationCode, verificationUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { width: 80%; margin: 0 auto; }
    .header { background: #f4f4f4; padding: 10px; text-align: center; }
    .content { padding: 20px; }
    .footer { background: #f4f4f4; padding: 10px; text-align: center; }
    .button { display: inline-block; padding: 10px 20px; background: #007bff; color: #fff; text-decoration: none; border-radius: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Thank you for registering with us. To complete your registration, please use the following verification code:</p>
      <h2>${verificationCode}</h2>
      <p>The code is valid for 10 minutes. Please enter it to verify your email address.</p>
      <p>If you did not request this registration, please ignore this email.</p>
      <a href="${verificationUrl}" class="button">Verify Email</a>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} VRS Catering. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
const generatePasswordResetTemplate = (resetUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { width: 80%; margin: 0 auto; }
    .header { background: #f4f4f4; padding: 10px; text-align: center; }
    .content { padding: 20px; }
    .footer { background: #f4f4f4; padding: 10px; text-align: center; }
    .button { display: inline-block; padding: 10px 20px; background: #007bff; color: #fff; text-decoration: none; border-radius: 5px; }
    a { color: #007bff; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Password Reset Request</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to reset your password:</p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p>If you did not request a password reset, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} VRS Catering. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = {
  generateEmailTemplate,
  generatePasswordResetTemplate,
};