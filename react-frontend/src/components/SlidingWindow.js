// Sliding pane 
// Source: https://www.npmjs.com/package/react-sliding-pane?activeTab=readme

import React, { useState } from "react";
import SlidingPane from "react-sliding-pane";

function SlidingWindow({ Page, ClickableComponent }) {

  const [state, setState] = useState({isPaneOpen: false});
  
  function handleClick(e){
    e.preventDefault()
    setState({ isPaneOpen: true })
  }


  return (
    <div className="sliding-window">
        <span className="window-children" onClick={handleClick}>
          {ClickableComponent}
        </span>

        <SlidingPane
          className="some-custom-class"
          overlayClassName="some-custom-overlay-class"
          isOpen={state.isPaneOpen}
          title="Close"
          // subtitle="to ignore any changes"
          onRequestClose={() => {
            // triggered on "<" on left top click or on outside click
            setState({ isPaneOpen: false });
          }} >

          {Page}
          
        </SlidingPane>
      </div>
  )
};

export default SlidingWindow;