import React from 'react'
import {BlueButton} from "../GetButtons"

function index(props) {
    return (
        <div style={{transform:"translate(0,-3em)"}}>
            {/* <h3>
                No Applications are available
            </h3> */}
            <p style={{fontSize:"14px"}}>
                {/* You don't have any Applications created by you or share with you in your workspace.<br/> */}
                Create a new Application to view it in your Home.
            </p>
            <BlueButton onClick={()=>props.setActiveScreen("newApplication")} >
                + Create New Application
            </BlueButton>
        </div>
    )
}
export default index
