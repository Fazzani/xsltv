import React from 'react'

const SnackBar = ({ snackMessage }) => 
!snackMessage ? (
  <div id="snackbar">
    A new version of this app is available. Click{' '}
    <a id="reload" href="_self">
      here
    </a>{' '}
    to update.
  </div>
) : (
  <div id="snackbar" className="show">{snackMessage}</div>
)
export default SnackBar
