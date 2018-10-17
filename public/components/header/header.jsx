import React from 'react'
import PropTypes from 'prop-types'
import './style.scss'

const Header = ({ headerTitle }) => {
  return (
    <div className="row header">
      <h2 className="text-center text-capitalize">{headerTitle}</h2>
    </div>
  )
}

Header.propTypes = {
  headerTitle: PropTypes.string.isRequired,
}

export default Header
