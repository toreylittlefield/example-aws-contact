import React, { useState } from 'react';
import { FormControlLabel, Switch } from '@material-ui/core';

export const SkipPageTransitionsToggle = ({ state, setState }) => {
  const [checked, setChecked] = useState(true);

  const toggleChecked = () => {
    setChecked((prev) => !prev);
    if (checked) setState(undefined);
    if (!checked && state === undefined) setState(null);
  };

  const labelText = checked ? 'Page Animations On' : 'Page Animations Off';

  return (
    <FormControlLabel
      className="page-animations-switch"
      control={<Switch checked={checked} onChange={toggleChecked} />}
      label={labelText}
    />
  );
};
