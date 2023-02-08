import React from "react";

function DisplayButton({displayObject, displayTitle, handleClickAction}) {

    function handleClick() {
        handleClickAction(displayObject)
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