import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';

const TEST_SITE_KEY = `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`;
const TEST_SECRET_KEY = `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`;

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
      //   const token = await reCaptchaRef.current.getValue();
      //   console.log(token);
      //   values.recaptcha = token;
      reCaptchaRef.current.reset();
      alert(JSON.stringify(values, null, 2));
      formik.resetForm({});
    },
  });
  return (
    <form className="contact-form" onSubmit={formik.handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.firstName}
      />
      {formik.touched.firstName && formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}
      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.lastName}
      />
      {formik.touched.lastName && formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
      <ReCAPTCHA
        style={{ display: 'inline-block' }}
        size="compact"
        theme="dark"
        ref={reCaptchaRef}
        sitekey={TEST_SITE_KEY}
        name="recaptcha"
        id="recaptcha"
        value={formik.values.recaptcha}
        onBlur={formik.handleBlur}
        onChange={async () => {
          const token = await reCaptchaRef.current.getValue();
          // const token = await reCaptchaRef.current.getValue();
          console.log(token);
          //   formik.handleChange(
          formik.setFieldValue('recaptcha', token);
          //   reCaptchaRef.current.reset();
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
