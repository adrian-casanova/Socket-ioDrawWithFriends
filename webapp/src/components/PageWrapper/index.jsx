import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
}));

function PageWrapper({ children }) {
  const classes = useStyles();
  return <div className={classes.container}>{children}</div>;
}

export default PageWrapper;
