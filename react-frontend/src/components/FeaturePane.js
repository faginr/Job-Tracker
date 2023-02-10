import React from "react";

function FeaturePane({featureClass, setFeatureChild, child}) {

    return(
        <div className={featureClass}>
            <div className="feature-pane-header">
                <button onClick={()=>setFeatureChild()}>Cancel</button>
            </div>
            <div className="feature-child">
                {child}
            </div>
        </div>
    )
}

export default FeaturePane