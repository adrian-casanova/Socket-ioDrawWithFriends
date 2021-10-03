import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import { getSession } from '../../services/SessionService';
import { SessionContext } from '../../contextStore.js';

const useStyles = makeStyles(theme => ({
  joinButton: {
    marginTop: theme.spacing(2),
  },
}));

function StartPage() {
  const classes = useStyles();
  const history = useHistory();
  const [name, setName] = useState('');
  const { setCurrentSession } = useContext(SessionContext);

  async function onJoin() {
    const session = await getSession(name);
    setCurrentSession(session);
    history.push('/game');
  }

  function onNameChange(e) {
    setName(e.target.value);
  }
  return (
    <PageWrapper>
      <Typography>Draw With Friends</Typography>
      <TextField
        onChange={onNameChange}
        placeholder="Name"
        variant="outlined"
      />
      <Button
        variant="contained"
        onClick={onJoin}
        color="primary"
        className={classes.joinButton}
      >
        Join Session
      </Button>
    </PageWrapper>
  );
}

export default StartPage;
