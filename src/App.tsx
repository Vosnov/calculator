import React, { FC } from 'react';
import './App.scss';
import { Calculator } from './components/Calculator';

export const App: FC = () => {
  return (
    <div className="App">
      <Calculator/>
    </div>
  );
}