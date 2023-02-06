import React from "react";

function FeaturePane({featureObj}) {
    return (
        <div className="feature-pane">
            <ul>
                {Object.keys(featureObj).map((key) => {
                    return(<li key={key}>{key}: {featureObj[key]}</li>)
                })}
            </ul>
        </div>
    )
}

export default FeaturePane