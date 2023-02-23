import React from "react";

export default function ReactButton({onClick, label}){
    console.log("button rendered")
    return(
        <button onClick={onClick}>
            {label}
        </button>
    )
}