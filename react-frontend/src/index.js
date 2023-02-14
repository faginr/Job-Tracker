import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {Auth0Provider} from "@auth0/auth0-react";
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider 
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        authorizationParams={{redirect_uri: process.env.REACT_APP_AUTH0_CALLBACK_URL}}>
        <App />
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);