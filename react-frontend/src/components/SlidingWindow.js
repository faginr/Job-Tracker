// Sliding pane 
// Source: https://www.npmjs.com/package/react-sliding-pane?activeTab=readme

import React, { useState } from "react";
import SlidingPane from "react-sliding-pane";
import { MdEdit } from 'react-icons/md';

function SlidingWindow({ Page, buttonName, type }) {

  const [state, setState] = useState({isPaneOpen: false});

  let buttonElement;
  // options when called by Contact Pages
  if (buttonName === "AddNewContact") {
    buttonElement = (<button onClick={() => setState({ isPaneOpen: true })}>
                      Add New Contact
                    </button>);
  };

  // applications
  if (buttonName === "AddNewApplication") {
    buttonElement = (<button onClick={() => setState({ isPaneOpen: true })}>
    Add New Application
    </button>)
  }

  // shared
  if (buttonName === "EditIcon") {
    buttonElement = (<MdEdit onClick={() => setState({ isPaneOpen: true })} />);
  };

  return (
    <div>
        {buttonElement}

        <SlidingPane
          className="some-custom-class"
          overlayClassName="some-custom-overlay-class"
          isOpen={state.isPaneOpen}
          title="Close"
          subtitle="to ignore any changes"
          onRequestClose={() => {
            // triggered on "<" on left top click or on outside click
            setState({ isPaneOpen: false });
          }} >

          <Page typeToEdit={type} />
          
        </SlidingPane>
      </div>
  )
};

export default SlidingWindow;