import React, { useRef } from 'react';
import { Formik } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';
import * as Yup from 'yup';

const TEST_SITE_KEY = `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`;

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
        }, 400);
      }}
    >
      {(formik) => (
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
            {...formik.getFieldProps('recaptcha')}
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
      )}
    </Formik>
  );
};

export default ContactFormReactContext;
