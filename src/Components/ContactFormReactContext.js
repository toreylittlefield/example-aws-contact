import React, { useRef } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';

const TEST_SITE_KEY = `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`;

const RecaptchaComponent = ({
  field, // { name, value, onChange, onBlur }
  form: { values, touched, errors, setFieldValue, getFieldProps }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  reCaptchaRef,
  ...props
}) => {
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
        {...getFieldProps('recaptcha')}
        onChange={async () => {
          const token = await reCaptchaRef.current.getValue();
          console.log(token);
          setFieldValue('recaptcha', token);
        }}
      />
      {touched.recaptcha && errors.recaptcha ? (
        <div>{errors.recaptcha}</div>
      ) : values.recaptcha ? (
        <textarea rows={5} cols={5}>
          {values.recaptcha}
        </textarea>
      ) : null}
    </>
  );
};

const ContactFormReactContext = () => {
  const reCaptchaRef = useRef(null);

  return (
    <Formik
      initialValues={{ firstName: '', lastName: '', email: '', recaptcha: '' }}
      validationSchema={Yup.object({
        firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
        lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        recaptcha: Yup.string().min(1, 'Prove You Are Not A Robot').required('Prove You Are Not A Robot'),
      })}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          reCaptchaRef.current.reset();
          resetForm({});
          setSubmitting(false);
        }, 100);
      }}
    >
      <Form className="contact-form">
        <label htmlFor="firstName">First Name</label>
        <Field name="firstName" type="text" />
        <ErrorMessage name="firstName" />

        <label htmlFor="lastName">Last Name</label>
        <Field name="lastName" type="text" />
        <ErrorMessage name="lastName" />

        <label htmlFor="email">Email Address</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" />
        <Field name="recaptcha" component={RecaptchaComponent} reCaptchaRef={reCaptchaRef} />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default ContactFormReactContext;
