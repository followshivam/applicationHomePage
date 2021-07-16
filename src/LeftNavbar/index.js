import React,{useState} from 'react'
import "./index.css"

function App() {

    const [activeTab,setActiveTab]=useState("Home");

    const tabs=["Home", "Applications", "Templates", "Audit Log"];

    return (
        <div className="LeftNavbar">

            {tabs.map((item)=>{
                return(
                    <div className={activeTab===item ? "activeTab tab" : "tab" } key={item} onClick={()=>{setActiveTab(item)}}>
                        {item}
                    </div>
                )
            })}
            
        </div>
    )
}

export default App
