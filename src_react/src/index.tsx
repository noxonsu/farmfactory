// @ts-nocheck
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import reportWebVitals from './reportWebVitals';

const widgets = document.querySelectorAll('.ff-farmfactory-widget')
widgets.forEach((widget) => {
  try {
    const props = {}
    Object.keys(widget.dataset).forEach((key) => {
      props[key] = widget.dataset[key]
    })
    const widgetRoot = ReactDOM.createRoot(widget)
    widgetRoot.render(
      <React.StrictMode>
        {/* @ts-ignore */}
        <App widgetOptions={props} />
      </React.StrictMode>
    );
  } catch (err) {
    console.log('FarmFactory - Fail init widget', widget)
  }
})

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
