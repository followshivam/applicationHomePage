import React from 'react'
import {
    makeStyles,
    BlueButton,DullButton
} from "component";


const useStyle=makeStyles(()=>(
    {   
        backShade:{
            position:"absolute",
            zIndex:"1000",
            height:"100%",
            width:"100%",
            background:"#00000060"
        },
        createNew_PopUp:{
            position:"absolute",
            zIndex:"1200",
            left:"40vw",top:"30vh",
            height:"40vh",
            minHeight:"max-content",
            width:"520px",
            background:"#fff",
            border:"1px solid #00000040",            
        },
        createNew_PopUp_header:{
            borderBottom:"1px solid #00000040",
            textAlign:"left",
            fontSize:"14px",
            padding:"5px"           
        },
        createNew_PopUp_body:{
            padding:"10px 60px",
            '& label':{
                fontSize:"12px",
                color:"#606060",
                display:"block",
                textAlign:"left",
                marginTop:"1em"
            },
            '& textarea, & select, & input':{
                display:"block",
                textAlign:"left",
                width:"100%",
                resize:"none"
            }
            

        },
        createNew_PopUp_footer:{
            position:"absolute",
            bottom:"0",
            borderTop:"1px solid #00000040",
            width:"100%",
            textAlign:"right",
            background:"#f9f3f3",
            padding:"5px 0",
            '& button':{
                margin:"0 5px",
                fontSize:"12px"
            }
        }
    }
))

function CreateNewPopup(props) {
    const classes=useStyle();

    const handleInput=(e) =>{
        console.log(e.target.name,e.target.value);
        props.setNewApplication((prev)=>{
            return{
                ...prev,[e.target.name]:e.target.value
            }
        })
    }

    const submitApplication=(e)=>{
        e.preventDefault();
        props.addApplication();
        props.setCreateNew_PopUp("closed");
        props.setActiveScreen("applications");
    }

    return (
        <>  
            <div className={classes.backShade}></div>
            <div className={classes.createNew_PopUp}>

                <div className={classes.createNew_PopUp_header} >
                    Application Details
                </div>

                <div className={classes.createNew_PopUp_body} >
                    
                    <label >Name</label>
                    <input value={props.newApplication.name} onChange={(e)=>handleInput(e)} name="name" autocomplete="off"  />

                    <label>Description</label>
                    <textarea value={props.newApplication.description} onChange={(e)=>handleInput(e)} name="description" autocomplete="off" />

                    <label>Category</label>
                    <select name="type" onChange={(e)=>{handleInput(e)}} >
                        {props.allCategories.map(category=>{
                            return(
                            <option value={category.name} name="type" >{category.name} </option>
                            )
                        })}
                    </select>

                    <label>Pinned</label>
                    <select name="pinned" onChange={(e)=>{handleInput(e)}} >
                            <option value={true} name="pinned" >TRUE </option>
                            <option value={false} name="pinned" >FALSE </option>
                    </select>

                    <label>Status</label>
                    <select name="status" onChange={(e)=>{handleInput(e)}} >
                            <option value="draft" name="status" >Draft </option>
                            <option value="pending" name="status" >Pending </option>
                            <option value="published" name="status" >Published </option>
                    </select>
                </div>

                <div className={classes.createNew_PopUp_footer}>
                    <DullButton onClick={()=>props.setCreateNew_PopUp("closed")} >Cancel</DullButton>
                    <BlueButton onClick={(e)=>submitApplication(e)}>Create Applications</BlueButton>
                </div>
            </div>
        </>
    )
}

export default CreateNewPopup
