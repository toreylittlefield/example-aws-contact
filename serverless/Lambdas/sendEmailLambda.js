'use strict';

const https = require('https');
const AWS = require('aws-sdk');

if (!AWS.config.region) {
  AWS.config.update({
    region: 'us-east-1',
  });
}
const ses = new AWS.SES();

const recaptchaSecKey = process.env.CAPTCHA_KEY;
const sendToEmail = process.env.SEND_MAIL_TO_ADDRESS;

const checkRecaptcha = async (recaptcha) => {
  const sendEmailParams = new sendEmailParams({
    secret: recaptchaSecKey,
    response: recaptcha,
  });
  const postData = sendEmailParams.toString();
  const options = {
    hostname: 'www.google.com',
    port: 443,
    path: '/recaptcha/api/siteverify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  const sendRequest = () =>
    new Promise((resolve, reject) => {
      const data = [];
      const request = https.request(options, (response) => {
        response.setEncoding('utf-8');
        response.on('data', (chunk) => {
          const captchaResponse = JSON.parse(chunk);
          console.log({ captchaResponse });
          data.push(captchaResponse);
          if (
            captchaResponse.success === true ||
            captchaResponse.success === false
          ) {
            console.log({
              'Captcha data': JSON.stringify(captchaResponse, null, 2),
            });
            return resolve(...data);
          }
        });
      });
      request.on('error', (error) => {
        console.log({ 'Captcha error': JSON.stringify(error, null, 2) });
        const errorObj = {
          statusCode: 500,
          body: JSON.stringify({
            msg: `Captcha verification failed. ${error.message}`,
          }),
        };
        data = [errorObj];
        reject(...data);
      });
      request.write(postData);
      request.end();
    });
  const res = await sendRequest();
  console.log('google res', res);
  return res;
};

exports.lambdaHandler = async (event, context, callback) => {
  // Extract the properties from the event body
  const {
    name = '',
    email = '',
    message = '',
    recaptcha = '',
    isLocal = false,
  } = JSON.parse(event.body);

  console.log({ event, name, email, message, recaptcha });

  const checkName = () => {
    if (!name || name.trim() === '') {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          msg: `A name is required`,
        }),
      });
    }
  };

  checkName();
  let captcha;
  if (!isLocal) {
    captcha = await checkRecaptcha(recaptcha);
  } else if (isLocal) {
    captcha = { success: true };
  }
  switch (captcha.success) {
    case true:
      const sendEmailParams = {
        Destination: {
          ToAddresses: [`Portofolio <${sendToEmail}>`],
        },
        // Interpolate the data in the strings to send
        Message: {
          Body: {
            Text: {
              Data: `You just got a message from ${name} - ${email}:
            ${message}`,
            },
          },
          Subject: { Data: `Message from ${name}` },
        },
        Source: `Portfolio Contact Form <${sendToEmail}>`,
      };
      const sendEmail = await ses.sendEmail(sendEmailParams).promise();
      console.log(sendEmail);
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: captcha,
        }),
      });
      break;
    case false:
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: captcha,
        }),
      });
      break;
    default:
  }
  console.log(captcha);

  return captcha;
};

/**
 * @description allows locally debugging and stepping through the lambda with the VS Code Debugger
 * @link https://nodejs.org/api/modules.html#modules_require_main
 */
if (require.main === module) {
  console.log('running a test locally');
  const event = require('../events/event.json');
  const body = {
    name: 'first name, last name',
    email: 'testlocal@emailaddress.com',
    message: 'this is a local test and this is the message from the form',
    recaptcha: 'somefakecaptchakeyfromtheclientside',
  };
  event.body = JSON.stringify(body);
  const callback = (...args) => console.log(...args);
  exports.lambdaHandler(event, {}, callback);
}
