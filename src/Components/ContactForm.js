import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import ReCAPTCHA from 'react-google-recaptcha';

const TEST_SITE_KEY = `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`;
const TEST_SECRET_KEY = `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`;

const ContactForm = () => {
  const [state, setState] = useState();
  const reCaptchaRef = useRef(null);

  // Note that we have to initialize ALL of fields with values. These
  // could come from props, but since we don’t want to prefill this form,
  // we just use an empty string. If we don’t do this, React will yell
  // at us.
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
    onSubmit: async (values) => {
      const token = await reCaptchaRef.current.executeAsync();
      console.log(token);
      reCaptchaRef.current.reset();
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <>
      <form className="contact-form" onSubmit={formik.handleSubmit}>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.firstName}
        />

        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.lastName}
        />

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />

        <button type="submit">Submit</button>
      </form>
      <ReCAPTCHA
        style={{ display: 'inline-block' }}
        size="invisible"
        theme="dark"
        ref={reCaptchaRef}
        sitekey={TEST_SITE_KEY}
      />
    </>
  );
};

export default ContactForm;
