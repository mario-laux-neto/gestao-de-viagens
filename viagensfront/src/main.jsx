import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './styles/global.css'; // ← ESSA É A LINHA QUE FALTAVA!

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
