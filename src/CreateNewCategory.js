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
            height:"35vh",
            width:"520px",
            background:"#fff",
            border:"1px solid #00000040",            
        },
        createNew_PopUp_header:{
            borderBottom:"1px solid #00000040",
            textAlign:"left",
            fontSize:"14px",
            fontWeight:"600",
            padding:"5px 24px", 
            height:"50px",
            lineHeight:"50px"         
        },
        createNew_PopUp_body:{
            padding:"10px 24px",
            '& div':{
                display:"flex",
                margin:"20px 0",
                justifyContent:"space-between"
            },
            '& label':{
                fontSize:"12px",
                color:"#606060",
                display:"block",
                textAlign:"left",
                // marginTop:"1em",
                minWidth:"100px",
                lineHeight:"30px"
            },
            '& input,& textarea':{
                display:"block",
                textAlign:"left",
                width:"-webkit-fill-available",
                resize:"none",
                padding:"5px"
            }    
        },
        createNew_PopUp_footer:{
            position:"absolute",
            bottom:"0",
            borderTop:"1px solid #00000040",
            width:"calc(100% - 50px )",
            textAlign:"right",
            background:"#F5F5F5",
            height:"49px",
            lineHeight:"49px",
            padding:"0 24px",
            '& button':{
                margin:"0 6px",
                fontSize:"12px",
                height:"28px",
                minWidth:"54px"
            }
        }
    }
))

function CreateNewCategory(props) {
    const classes=useStyle();

    const handleInput=(e) =>{
        props.setNewCategory((prev)=>{
            return{
                ...prev,[e.target.name]:e.target.value
            }
        })
    }

    const submitApplication=(e)=>{
        e.preventDefault();
        props.addCategory();
        props.setCreateCategory_PopUp("closed");
    }

    return (
        <>  
            <div className={classes.backShade}></div>
            <div className={classes.createNew_PopUp}>

                <div className={classes.createNew_PopUp_header} >
                    Create Category
                </div>

                <div className={classes.createNew_PopUp_body} >
                    
                    <div>
                        <label >Category Name <span style={{color:"red"}}>*</span> </label>
                        <input value={props.newCategory.name} onChange={(e)=>handleInput(e)} name="name"  />
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea value={props.newCategory.description} onChange={(e)=>handleInput(e)} name="description" />
                    </div>

                    {/* <label>Category</label>
                    <select onSelect={()=>{}} >
                        {}
                    </select> */}
                </div>

                <div className={classes.createNew_PopUp_footer}>
                    <DullButton onClick={()=>props.setCreateCategory_PopUp("closed")} >Cancel</DullButton>
                    <BlueButton onClick={(e)=>submitApplication(e)}>Create</BlueButton>
                </div>
            </div>
        </>
    )
}

export default CreateNewCategory
