import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';

const TEST_SITE_KEY = `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`;

const ContactFormWithFieldProps = () => {
  const reCaptchaRef = useRef(null);

  const validationSchema = Yup.object({
    firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
    lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    recaptcha: Yup.string().min(1, 'Prove You Are Not A Robot').required('Prove You Are Not A Robot'),
  });

  // Note that we have to initialize ALL of fields with values. These
  // could come from props, but since we don’t want to prefill this form,
  // we just use an empty string. If we don’t do this, React will yell
  // at us.
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      recaptcha: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      reCaptchaRef.current.reset();
      alert(JSON.stringify(values, null, 2));
      formik.resetForm({});
    },
  });
  return (
    <form className="contact-form" onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input id="firstName" type="text" {...formik.getFieldProps('firstName')} />
      {formik.touched.firstName && formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}
      <label htmlFor="lastName">Last Name</label>
      <input id="lastName" type="text" {...formik.getFieldProps('lastName')} />
      {formik.touched.lastName && formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}
      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" {...formik.getFieldProps('email')} />
      {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
      <ReCAPTCHA
        style={{ display: 'inline-block' }}
        size="compact"
        theme="dark"
        ref={reCaptchaRef}
        sitekey={TEST_SITE_KEY}
        id="recaptcha"
        // name="recaptcha"
        {...formik.getFieldProps('recaptcha')}
        // value={formik.values.recaptcha}
        // onBlur={formik.handleBlur}
        onChange={async () => {
          const token = await reCaptchaRef.current.getValue();
          console.log(token);
          formik.setFieldValue('recaptcha', token);
        }}
      />
      {formik.touched.recaptcha && formik.errors.recaptcha ? (
        <div>{formik.errors.recaptcha}</div>
      ) : formik.values.recaptcha ? (
        <textarea rows={5} cols={5}>
          {formik.values.recaptcha}
        </textarea>
      ) : null}
      <button type="submit">Submit</button>
    </form>
  );
};

export default ContactFormWithFieldProps;
