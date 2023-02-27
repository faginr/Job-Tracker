import React from "react";

export default function ReactButton({onClick, label}){
    return(
        <button onClick={onClick}>
            {label}
        </button>
    )
}