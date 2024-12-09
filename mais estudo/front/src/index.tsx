import React from 'react';
import ReactDOM from 'react-dom/client';
import Appp from "./App.tsx"

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Appp />
  </React.StrictMode>
);

