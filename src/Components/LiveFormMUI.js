/* eslint-disable react/jsx-boolean-value */
import React, { useRef, useEffect, useState } from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';
import { Button, TextField, InputAdornment } from '@material-ui/core';
import {
  Send as SendIcon,
  Subject as SubjectIcon,
  Face as FaceIcon,
  AlternateEmail as AltEmailIcon,
} from '@material-ui/icons';

const TEST_SITE_KEY = process.env.REACT_APP_RECAPTCHA_CLIENT_KEY;

const useFetch = () => {
  const [resData, setResData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState(null);

  useEffect(() => {
    if (values === null) return;
    setLoading(true);
    const { firstName, lastName, message, email, recaptcha } = values;
    const abortController = new AbortController();

    const callFetchAsync = async () => {
      const endpoint = process.env.REACT_APP_FORM_ENDPOINT;
      const body = JSON.stringify({
        name: `${firstName.value} ${lastName.value}`,
        email: email.value,
        message,
        recaptcha,
      });
      const requestOptions = {
        method: 'POST',
        body,
        signal: abortController.signal,
      };
      const response = await fetch(endpoint, requestOptions);
      if (response.status === 200 && response.ok) {
        const json = response.json();
        setResData(json);
        setLoading(false);

        return json;
      }
      setResData(response);
      setLoading(false);
      return response;
    };
    callFetchAsync();
    return () => abortController?.abort();
  }, [values]);

  return [resData, isLoading, setValues];
};

const RecaptchaComponent = ({ children, reCaptchaRef, ...props }) => {
  const [field, meta, helpers] = useField({ ...props, type: 'checkbox' });
  return (
    <>
      <ReCAPTCHA
        {...field}
        {...props}
        className="recaptcha-component"
        size="normal"
        ref={reCaptchaRef}
        sitekey={TEST_SITE_KEY}
        id="recaptcha"
        onChange={async () => {
          const token = await reCaptchaRef.current.getValue();
          helpers.setValue(token);
        }}
      />
      {meta.touched && meta.error && <ErrorMessage name="recaptcha" />}
    </>
  );
};

export const LiveFormMUI = () => {
  const reCaptchaRef = useRef(null);
  const [resData, isLoading, setValues] = useFetch();

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        message: '',
        recaptcha: '',
        submissionCount: 0,
      }}
      validationSchema={Yup.object({
        firstName: Yup.string()
          .max(15, 'Must be 15 characters or less')
          .required('First Name Is Required'),
        lastName: Yup.string()
          .max(20, 'Must be 20 characters or less')
          .required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        message: Yup.string()
          .min(15, 'Must be a minimum of 15 characters')
          .required('Please add your message'),
        recaptcha: Yup.string()
          .min(1, 'Prove You Are Not A Robot')
          .required('Prove You Are Not A Robot'),
      })}
      /**
       * @linkplain if onSubmit is async setSubmitting does not need to be called, it is invoked automatically once resolved
       * @tutorial https://formik.org/docs/api/withFormik#the-formikbag
       */
      onSubmit={(values, { resetForm, setSubmitting }) => {
        const asyncWrapper = async () => {
          setValues(values);
          setSubmitting(false);
          reCaptchaRef.current.reset();
          resetForm({
            submitCount: values.submissionCount + 1,
            values: {
              firstName: '',
              lastName: '',
              email: '',
              message: '',
              recaptcha: '',
              submissionCount: values.submissionCount + 1,
            },
          });
        };
        asyncWrapper();
      }}
    >
      {/* formik uses render props */}
      {({ errors, touched }) => (
        <Form className="contact-form live" method="POST">
          <Field
            name="firstName"
            type="text"
            label="First Name"
            className="first-name"
            required
            helperText={<ErrorMessage name="firstName" />}
            error={errors.firstName && touched.firstName}
            placeholder="Bob"
            variant="outlined"
            as={TextField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaceIcon />
                </InputAdornment>
              ),
            }}
          />

          <Field
            name="lastName"
            type="text"
            label="Last Name"
            className="last-name"
            required
            helperText={<ErrorMessage name="lastName" />}
            error={errors.lastName && touched.lastName}
            placeholder="Hannock"
            as={TextField}
            variant="outlined"
          />

          <Field
            name="email"
            type="email"
            label="Email Address"
            className="form-email"
            required
            helperText={<ErrorMessage name="email" />}
            error={errors.email && touched.email}
            placeholder="example@emailcompany.com"
            as={TextField}
            variant="outlined"
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AltEmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <Field
            name="message"
            type="message"
            label="Message"
            className="form-message"
            required
            helperText={<ErrorMessage name="message" />}
            error={errors.message && touched.message}
            placeholder="What's Up With You?"
            margin="normal"
            minRows={3}
            variant="outlined"
            multiline
            as={TextField}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SubjectIcon />
                </InputAdornment>
              ),
            }}
          />

          <RecaptchaComponent name="recaptcha" reCaptchaRef={reCaptchaRef} />

          <Button
            disabled={isLoading}
            color="primary"
            variant="contained"
            size="large"
            type="submit"
            endIcon={<SendIcon />}
          >
            Submit
          </Button>
          {JSON.stringify(resData, null, 2)}
        </Form>
      )}
    </Formik>
  );
};

export const LiveFormMUICodeString = [
  `import React, { useRef } from 'react';
  import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
  import ReCAPTCHA from 'react-google-recaptcha';
  import * as Yup from 'yup';
  import { Button, TextField, TextareaAutosize } from '@material-ui/core';
  import { Send as SendIcon } from '@material-ui/icons';
  
  const TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';
  
  const RecaptchaComponent = ({ children, reCaptchaRef, ...props }) => {
    const [field, meta, helpers] = useField({ ...props, type: 'checkbox' });
    return (
      <>
        <ReCAPTCHA
          {...field}
          {...props}
          style={{ display: 'inline-block' }}
          size="compact"
          theme="dark"
          ref={reCaptchaRef}
          sitekey={TEST_SITE_KEY}
          id="recaptcha"
          onChange={async () => {
            const token = await reCaptchaRef.current.getValue();
            helpers.setValue(token);
          }}
        />
        {meta.touched && meta.error ? (
          <ErrorMessage name="recaptcha" />
        ) : field.value ? (
          <TextareaAutosize
            minRows={3}
            maxRows={5}
            aria-label="empty textarea"
            placeholder="Empty"
          >
            {field.value}
          </TextareaAutosize>
        ) : null}
      </>
    );
  };
  
  export const LiveFormMUI = () => {
    const reCaptchaRef = useRef(null);
  
    return (
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          recaptcha: '',
          submissionCount: 0,
        }}
        validationSchema={Yup.object({
          firstName: Yup.string()
            .max(15, 'Must be 15 characters or less')
            .required('First Name Is Required'),
          lastName: Yup.string()
            .max(20, 'Must be 20 characters or less')
            .required('Required'),
          email: Yup.string().email('Invalid email address').required('Required'),
          recaptcha: Yup.string()
            .min(1, 'Prove You Are Not A Robot')
            .required('Prove You Are Not A Robot'),
        })}
        /**
         * @linkplain if onSubmit is async setSubmitting does not need to be called, it is invoked automatically once resolved
         * @tutorial https://formik.org/docs/api/withFormik#the-formikbag
         */
        onSubmit={(values, { resetForm, setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
            reCaptchaRef.current.reset();
            // eslint-disable-next-line no-param-reassign
            resetForm({
              submitCount: values.submissionCount + 1,
              values: {
                firstName: '',
                lastName: '',
                email: '',
                recaptcha: '',
                submissionCount: values.submissionCount + 1,
              },
            });
          }, 3000);
        }}
      >
        {/* formik uses render props */}
        {({ errors, touched, isSubmitting, dirty }) => (
          <Form className="contact-form">
            <Field
              name="firstName"
              type="text"
              label="First Name"
              required
              helperText={<ErrorMessage name="firstName" />}
              error={errors.firstName && touched.firstName}
              placeholder="Bob"
              as={TextField}
            />
  
            <Field
              name="lastName"
              type="text"
              label="Last Name"
              required
              helperText={<ErrorMessage name="lastName" />}
              error={errors.lastName && touched.lastName}
              placeholder="Hannock"
              as={TextField}
            />
  
            <Field
              name="email"
              type="email"
              label="Email Address"
              required
              helperText={<ErrorMessage name="email" />}
              error={errors.email && touched.email}
              placeholder="example@emailcompany.com"
              as={TextField}
            />
  
            <RecaptchaComponent name="recaptcha" reCaptchaRef={reCaptchaRef} />
  
            <Button
              disabled={isSubmitting}
              color="primary"
              variant="contained"
              type="submit"
              endIcon={<SendIcon />}
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    );
  };`,
].toString();
