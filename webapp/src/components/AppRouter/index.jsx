import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import StartPage from '../../pages/StartPage';
import GamePage from '../../pages/GamePage';

function AppRouter() {
  return (
    <BrowserRouter>
      <Route exact path="/" component={StartPage} />
      <Route exact path="/game" component={GamePage} />
    </BrowserRouter>
  );
}

export default AppRouter;
