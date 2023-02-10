import React from "react";

function DisplayButton({displayObject, displayTitle, setFeaturePane}) {

    function handleClick() {
        setFeaturePane(displayObject)
    }

    return (
        <span>
            <button 
                className="displayButton" 
                onClick={handleClick}>
                {displayTitle}
            </button>
        </span>
    )
}

export default DisplayButton