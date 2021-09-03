import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab } from '@material-ui/core';
import { amber, common } from '@material-ui/core/colors';

export const NavBar = ({ handleChange }) => {
  const location = useLocation();
  const handlePathName =
    location.pathname === '/' || !location.key
      ? '/ExampleOne'
      : location.pathname;
  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: amber[300],
        color: common.black,
        zIndex: 2,
        position: 'relative',
      }}
    >
      <Tabs
        onChange={handleChange}
        value={location.path ?? handlePathName}
        variant="scrollable"
        scrollButtons="on"
        aria-label="nav tabs example"
      >
        <Tab
          to="/ExampleOne"
          value="/ExampleOne"
          dataindex={0}
          component={NavLink}
          label="Example 1: Boilerplate"
        />
        <Tab
          to="/ExampleTwo"
          value="/ExampleTwo"
          component={NavLink}
          dataindex={1}
          label="Example 2: Field Props"
        />
        <Tab
          to="/ExampleThree"
          value="/ExampleThree"
          dataindex={2}
          component={NavLink}
          label="Example 3: Formik Context"
        />
        <Tab
          to="/ExampleFour"
          value="/ExampleFour"
          dataindex={3}
          component={NavLink}
          label="Example 4: useField Hook"
        />
        <Tab
          to="/ExampleFive"
          value="/ExampleFive"
          dataindex={4}
          component={NavLink}
          label="Example 5: Material UI"
        />
      </Tabs>
    </AppBar>
  );
};
