import { useEffect } from 'react';

export const useRecaptchaCleanup = (location) => {
  useEffect(() => {
    document
      .querySelectorAll('iframe[title="recaptcha challenge"]', '.page')
      ?.forEach((element, pathIndex) => {
        if (pathIndex === 0) return;
        if (element.tagName === 'IFRAME')
          return element.parentElement.parentElement.remove();
      });
  }, [location]);
};
