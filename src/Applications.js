import React,{useState ,useEffect} from 'react'
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTranslation,Pinned,BlueButton,DullButton,EmptyHome,
    NotFound,SearchBox } from 'component';

import {GlobalSettings, LogoutDetails, SetRegexDetails} from "redux/action";
import {useDispatch, useSelector} from "react-redux";

const useStyles=makeStyles(()=>({
    main:{
        width:"100%",
        display:"flex",
        caretColor:"transparent",
        background:"#F8F8F8"
    },
    sideBar:{
        textAlign: "left",
        width: "270px",        
        background: "#FFFFFF",
        boxShadow: "0px 3px 6px #00000029",
        borderRadius: "0px 2px 2px 0px",        
        height:"93.8vh",
        padding:"10px 0"
    },
    sideBarTitle:{
        padding:"0 10px",
        font: "normal normal 600 14px/19px Open Sans",
        height:"43px",
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between"        
    },
    addButton:{
        color:"#0072C6",
        transform:"scale(2)",
        cursor:"pointer"
    },
    category:{
        textAlign: "left",
        font: "normal normal normal 12px/17px Open Sans",
        display:"flex",
        height: "33px",
        justifyContent:"space-between",
        alignItems:"center",
        textTransform:"capitalize",        
        padding:"0 10px",
        caretColor:"transparent",
        cursor:"pointer",
        '& div':{
            display:"flex"
        }
    },
    activeCategory:{
        background:"#0072C614",
        color:"#0072C6"
    },
    body:{
        width:"100%"
    },
    bodyBar:{
        height:"75px",
        background: "#FFFFFF",
        boxShadow: "0px 2px 6px #00000014",
        margin:"16px 10px",
        padding:"10px",
        width:"97%",
        '& h3':{
            textAlign: "left",
            font: "normal normal 600 16px/22px Open Sans",
            flex:"1",
            margin:"0",
            alignSelf:"center",
            textTransform:"capitalize"
        },
        '& p':{
            fontSize:"12px",textAlign: "left",
        },
        '& button':{
            margin:"4px"
        }
    },
    bodyMain:{
        boxShadow: "0px 2px 6px #00000014",
        padding:"16px",
        height:"100%",
        position:"relative",
        margin:"10px",
        background:"#fff"
    }
}))

function Applications(props) {
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings]
    })
    const {t} = useTranslation(globalSetting.locale_module
        ? globalSetting.locale_module
        : ['bam', 'omniapp'])

    const [active,setActive]=useState();
    const [activeType,setActiveType]=useState();

    const [groupByCategory, setGroupByCategory]=useState(false);

    const [allCategories,setAllCategories]=useState();

    useEffect(() => {
        if(props.allCategories && props.allCategories.length>0){
            setAllCategories(props.allCategories);
        }
    }, [props.allCategories])

    const classes=useStyles();
    const [categoryCountJson,setCategoryCountJson]=useState();

    // const countJson = () => {
    //     const json={}
    //     (props.allCategories).map(category=>{
            
    //     })
    // }
    // console.log(props);

    const statusName= (status) =>{
        switch (status){
            case "draft":
                return "Draft Applications"
                break;
            case "pending":
                return "Approval Pending Applications"
                break;
            case "approved":
                return "Published Applications"
                break;
            case "pinned":
                return "Pinned Application"
                break;                 
        }
    }

    const handleActive= (e) =>{
        const name=e.target.getAttribute("name");
        const value=e.target.getAttribute("value");
        console.log(name, value);
        setActive(name);
        setActiveType(value);
    }

    const getActiveJson=() =>{
        switch (activeType){
            case "category":
                return props.categoryWiseApps
                break;
            case "status":
                return props.statusWiseApps
                break;    
        }
    }

    const getGroupedJson=()=>{

    }

    const onSideBarSearch = (obj) => {
        let ar = [];

        // props.allCategories.map((category) => {

          let searchedVal = props.allCategories.filter((val) => {
            return val[props.searchProps.searchingKey].toLowerCase().includes(obj.searchString)
          })

        //   if (searchedVal.length > 0) {
        //     ar.push({
        //       ...category, value: searchedVal
        //     })
        //   }

        // })
        setAllCategories(searchedVal)
      }

      const onSideBarSearchClear = () => {
        setAllCategories(props.allCategories)
      }      

    return (
        <>
        {props?.statusWiseApps && Object.keys(props?.statusWiseApps).length>0 && allCategories && allCategories.length>0 ? 
        <div className={classes.main}>
            
            <div className={classes.sideBar}>

                {Object.keys(props.statusWiseApps).map(status=>{
                        return(
                            <div className={active===status? `${classes.category} ${classes.activeCategory}` : classes.category} name={status} value="status" onClick={handleActive}  >
                                <div name={status} value="status">{statusName(status)} </div>
                                <div name={status} value="status">
                                    <img style={{width:"auto",height:"18px",verticalAlign:"middle"}} src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/file.svg`} />
                                    {props.statusWiseApps[status].length}
                                </div>
                            </div>
                        )
                    })}
                <hr width="94%" color="#F0F0F0" />    

                <div className={classes.sideBarTitle}>
                    <span>Categories ({allCategories.length})</span>
                    <span className={classes.addButton} onClick={()=>props.setCreateCategory_PopUp("open")}>+</span>
                </div>

                <div className={classes.sideBarTitle}>

                    <SearchBox 
                    height="14px"
                    width="200px"
                    direction={props.direction}
                    onSearchSubmit={onSideBarSearch}
                    clearSearchResult={onSideBarSearchClear}
                    placeholder={props.searchProps.placeholder}
                    regex={props.searchProps.regex}
                    />

                    <span > a/z </span>
                </div>

                {allCategories.map(category=>{
                    return(
                        <div key={category.id} className={active===category.name? `${classes.category} ${classes.activeCategory}` : classes.category} name={category.name} value="category" onClick={handleActive} >
                            <div name={category.name} value="category">
                                <img style={{width:"auto",height:"16px",verticalAlign:"middle"}} src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/Categories-Projects.svg`} />
                                {category.name} 
                            </div>
                            <div name={category.name} value="category" >
                                <img style={{width:"auto",height:"18px",verticalAlign:"middle"}} src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/file.svg`} />
                                {props.categoryWiseApps[category.name]?.length}
                            </div>
                        </div>
                    )
                })}                
            </div>
            

            <div className={classes.body}>

                <div className={classes.bodyBar}>
                    
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <h3>{activeType==="status" ? statusName(active) : active|| "Select a category" } </h3>
                        <div style={{alignSelf:"center"}}>
                            <DullButton>Import Application</DullButton>
                            <BlueButton onClick={()=>props.setCreateNew_PopUp("open")}>Create Application</BlueButton>
                            <img style={{width:"auto",height:"25px",verticalAlign:"middle"}} src={`${process.env.REACT_APP_CONTEXT_PATH}/icons/more1.svg`} />
                        </div>
                        
                    </div>
                    
                    <p>This section contains all the draft processed across all projects created by you or shared with you.</p>
                    
                </div>
                
                <div className={classes.bodyMain} >

                {activeType==="status" && 
                <div style={{display:"flex", fontSize:"12px",alignItems:"center", position:"absolute", right:"24em", top:"2.3em"}}>
                        
                        {groupByCategory===true?
                        <input type="checkbox" checked onClick={()=>setGroupByCategory(false)} />
                        :
                        <input type="checkbox"  onClick={()=>setGroupByCategory(true)} /> }
                        <label> Group by Category </label>

                        &nbsp;&nbsp;

                        <input type="checkbox" />
                        <label> Show Pinned at top </label>
                        
                    
                </div>
                }

                {activeType && activeType.length>0 && active && active.length>0 &&

                    <Pinned
                        pinnedData={getActiveJson()[active]}
                        headerData={props.HeadCells}
                        action={props.Action}
                        defaultView={'tile'}
                        direction={`${t('bam:HTML_DIR')}`}
                        loading={false}
                        height={'182pt'}
                        isSearch={false}
                        pinnedSearch={true}
                        width={'180pt'}
                        imageInfo={{
                        path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
                        ext: '.svg'
                        }}
                        label={{
                        heading: active,
                        viewLess: `${t('bam:View Less')}`,
                        viewAll: `${t('bam:View All')}`,
                        last_modified: `${t('bam:Last Modified')}`,
                        lastOpened:`${t('bam:Last Opened')}`
                        }}
                        direction={`${t('bam:HTML_DIR')}`}
                        searchProps={{
                            searchingKey: 'name',
                            placeholder: `${t('bam:TITLE_SEARCH')}`,
                            regex: null
                        }}
                        />
                    }
                </div>
            </div>
            
        </div>
        :
        <div style={{width:"100%"}} >
                <NotFound />
                    
                <EmptyHome setActiveScreen={props.setActiveScreen}/>
        </div>  
        }
        </>
    )
}

export default Applications
