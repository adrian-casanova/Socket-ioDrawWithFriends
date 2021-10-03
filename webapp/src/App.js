import './App.css';
import React, { useState } from 'react';
import { Typography } from '@material-ui/core';
import AppRouter from './components/AppRouter';

import { SessionContext } from './contextStore';

function App() {
  const [currentSession, setCurrentSession] = useState();

  return (
    <React.Fragment>
      <SessionContext.Provider value={{ currentSession, setCurrentSession }}>
        <AppRouter />
      </SessionContext.Provider>
    </React.Fragment>
  );
}

export default App;
