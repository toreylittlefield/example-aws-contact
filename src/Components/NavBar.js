import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { amber, common } from '@material-ui/core/colors';

export const NavBar = () => {
  const location = useLocation();
  const handlePathName =
    location.pathname === '/' || !location.key
      ? '/ExampleOne'
      : location.pathname;
  return (
    <AppBar
      position="static"
      style={{ backgroundColor: amber[300], color: common.black }}
    >
      <Tabs
        // variant="fullWidth"

        value={handlePathName}
        variant="scrollable"
        scrollButtons="on"
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
        <Tab
          to="/ExampleFour"
          value="/ExampleFour"
          component={Link}
          label="Example 4: useField Hook"
        />
        <Tab
          to="/ExampleFive"
          value="/ExampleFive"
          component={Link}
          label="Example 5: Material UI"
        />
      </Tabs>
    </AppBar>
  );
};
