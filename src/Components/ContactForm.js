/* eslint-disable no-alert */
import React, { useRef } from 'react';
import { useFormik } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';

const TEST_SITE_KEY = `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`;

const ContactForm = () => {
  const reCaptchaRef = useRef(null);

  //   const validate = (values) => {
  //     const errors = {};
  //     if (!values.firstName) {
  //       errors.firstName = 'Required';
  //     } else if (values.firstName.length > 15 || values.firstName.length < 2) {
  //       errors.firstName = 'Must be between 2 and 15 characters';
  //     }

  //     if (!values.lastName) {
  //       errors.lastName = 'Required';
  //     } else if (values.lastName.length > 20) {
  //       errors.lastName = 'Must be 20 characters or less';
  //     }

  //     if (!values.email) {
  //       errors.email = 'Required';
  //     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
  //       errors.email = 'Invalid email address';
  //     }

  //     if (!values.recaptcha) {
  //       errors.recaptcha = 'Prove You Are Not A Robot';
  //     }

  //     return errors;
  //   };

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Required'),
    lastName: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    recaptcha: Yup.string()
      .min(1, 'Prove You Are Not A Robot')
      .required('Prove You Are Not A Robot'),
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
      <input
        id="firstName"
        name="firstName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.firstName}
      />
      {formik.touched.firstName && formik.errors.firstName ? (
        <div>{formik.errors.firstName}</div>
      ) : null}
      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        name="lastName"
        type="text"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.lastName}
      />
      {formik.touched.lastName && formik.errors.lastName ? (
        <div>{formik.errors.lastName}</div>
      ) : null}
      <label htmlFor="email">Email Address</label>
      <input
        id="email"
        name="email"
        type="email"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
      {formik.touched.email && formik.errors.email ? (
        <div>{formik.errors.email}</div>
      ) : null}
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

export { ContactForm };

export const contactFormCodeString = [
  `
import React, { useRef } from 'react';
import { useFormik } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';

const TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

const ContactForm = () => {
  const reCaptchaRef = useRef(null);

  //   const validate = (values) => {
  //     const errors = {};
  //     if (!values.firstName) {
  //       errors.firstName = 'Required';
  //     } else if (values.firstName.length > 15 || values.firstName.length < 2) {
  //       errors.firstName = 'Must be between 2 and 15 characters';
  //     }

  //     if (!values.lastName) {
  //       errors.lastName = 'Required';
  //     } else if (values.lastName.length > 20) {
  //       errors.lastName = 'Must be 20 characters or less';
  //     }

  //     if (!values.email) {
  //       errors.email = 'Required';
  //     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i.test(values.email)) {
  //       errors.email = 'Invalid email address';
  //     }

  //     if (!values.recaptcha) {
  //       errors.recaptcha = 'Prove You Are Not A Robot';
  //     }

  //     return errors;
  //   };

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

export default ContactForm;

`,
].toString();
