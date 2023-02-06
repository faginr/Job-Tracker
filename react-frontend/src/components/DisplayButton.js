import React from "react";

function DisplayButton({displayObject, displayTitle, setDisplay, setObjectToEdit}) {

    function handleClick() {
        setDisplay()

        if(displayObject!==undefined){
            setObjectToEdit(displayObject)
        }
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