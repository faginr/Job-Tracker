import React from "react";

function DisplayButton({displayObject, displayTitle, handleClickAction, className="display-button"}) {

    function handleClick() {
        handleClickAction(displayObject)
    }

    return (
        <span>
            <button 
                className={className}
                onClick={handleClick}>
                {displayTitle}
            </button>
        </span>
    )
}

export default DisplayButton