/* eslint-disable arrow-body-style */
import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { amber, common } from '@material-ui/core/colors';

export const NavBar = () => {
  return (
    <AppBar
      position="static"
      style={{ backgroundColor: amber[300], color: common.black }}
    >
      <Tabs
        variant="fullWidth"
        // // value={value}
        // onChange={handleChange}
        aria-label="nav tabs example"
      >
        <Tab
          to="/ExampleOne"
          value="/ExampleOne"
          component={Link}
          label="Example 1: Boilerplate"
        />
        <Tab
          to="/ExampleTwo"
          value="/ExampleTwo"
          component={Link}
          label="Example 2: Field Props"
        />
        <Tab
          to="/ExampleThree"
          value="/ExampleThree"
          component={Link}
          label="Example 3: Formik Context"
        />
      </Tabs>
    </AppBar>
  );
};
