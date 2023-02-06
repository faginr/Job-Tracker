import React from "react";

function DisplayButton({displayObject, displayTitle, setShowForm, setObjectToEdit}) {

    function handleClick() {
        setShowForm()

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