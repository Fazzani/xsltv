import React, { FunctionComponent, useState } from 'react';
import "../../styles/loader.scss";

// our components props accept a number for the initial value
export const Loader: FunctionComponent<{ displayText: string }> = ({ displayText = 'loading...' }) => {
  const [text, setText] = useState(displayText);
  return  <>
    <div className="overlay">
      <div className="loading">
        <div className="spinner-wrapper">
          <span className="spinner-text">{text}</span>
          <span className="spinner" />
        </div>
      </div>
    </div>
  </>
}