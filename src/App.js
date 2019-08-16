import React from "react";
import {HashRouter, BrowserRouter as Router, Route, Link } from "react-router-dom";
import specs from './specs.openapi.json';
   import SwaggerUI from "swagger-ui-react"
  import "swagger-ui-react/swagger-ui.css"
import { RedocStandalone } from 'redoc';



function App() {
  return (
    <HashRouter basename='/' >
      <div>
        <Header />
        <Route exact path="/" component={Home} />
        <Route path="/openapiui" component={OpenApiUi} />
        <Route path="/redoc" component={Redoc} />
      </div>
    </HashRouter>
  );
}

function Home() {
  return <pre style={{background: "#dfdfdf", padding: "10px"}} >{JSON.stringify(specs, null, '  ')} </pre>;
}

function OpenApiUi() {

  return <SwaggerUI spec={specs} />;
}

function Redoc() {
  return <RedocStandalone spec={specs} />;
}


function Header() {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/openapiui">Open api ui</Link>
      </li>
      <li>
        <Link to="/redoc">Redoc</Link>
      </li>
      <li>
        <a href="https://github.com/jurgob/conversation-service-docs">Git hub project</a>
      </li>
    </ul>
  );
}

export default App;