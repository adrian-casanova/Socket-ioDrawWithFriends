import { Typography, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { SessionContext } from '../../contextStore.js';
import PageWrapper from '../../components/PageWrapper';
import DrawingPad from './components/DrawingPad';

const useStyles = makeStyles(theme => ({
  canvas: {
    border: '1px solid black',
    marginTop: theme.spacing(2),
  },
}));

function GamePage() {
  const classes = useStyles();
  const { currentSession } = useContext(SessionContext);
  return (
    <PageWrapper>
      <Typography>Draw with your friends! :)</Typography>
      <div></div>
      {currentSession?.users?.map(user => (
        <Typography>{user}</Typography>
      ))}
      <DrawingPad />
    </PageWrapper>
  );
}

export default GamePage;
