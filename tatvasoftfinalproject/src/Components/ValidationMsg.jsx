import React from "react";

const ValidateMessage=(props)=>{
    return(
        <>{props.touched && <p className=" mb-1 text-danger">{props.message}</p>}</>
    )
}
export default ValidateMessage;