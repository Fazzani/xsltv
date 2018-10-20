/*eslint no-undef: "error"*/
/*eslint-env browser*/
import React from 'react'
import { render } from 'react-dom'
import registerServiceWorker from './registerServiceWorker'
import { ErrorBoundary } from './components/ErrorBoundary'
import App from './components/app'

render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById('app')
)

registerServiceWorker()

// Hot Module Replacement
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.dispose(function() {
    // module is about to be replaced
  })

  // @ts-ignore
  module.hot.accept(function() {
    // module or one of its dependencies was just updated
  })
}

// if (process.env.NODE_ENV !== 'production') {
//   const { whyDidYouUpdate } = require('why-did-you-update')
//   whyDidYouUpdate(React)
// }
