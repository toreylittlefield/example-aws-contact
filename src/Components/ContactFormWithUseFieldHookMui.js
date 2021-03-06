import React, { useRef } from 'react';
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

export const ContactFormWithUseFieldHookMui = () => {
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
      {({ errors, touched, isSubmitting }) => (
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
};

export const contactFormWithUseFieldHookMuiCodeString = [
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
  
  export const ContactFormWithUseFieldHookMui = () => {
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
