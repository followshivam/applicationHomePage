import React, {useState, Fragment} from 'react'
import {
    Paper,
    SelectBox,
	CustomDialog,
	Select,
	Table,
    TableBody,
    TableCell,
    TableRow,
    TableHead,
    TableContainer,
    FormControlLabel,
	Checkbox,
	Grid,
	InputBox,
	makeStyles,
	withStyles,
	Typography,
	PickList
  } from "component";
import clsx from 'clsx'
import InputProperties from './Filters_input_form'
import PopOverAdvancedMenu from './components/PopoverAdvancedMenu.js'

const useStyles = makeStyles((theme) => ({
    root: {
	  flexGrow: 1,
	  minHeight:'80vh'
	},
	outlinedSelect: {
        borderRadius: '0%',
        maxHeight: '23px',
		minWidth: '80%',
		backgroundColor: 'white'
	},
	outlinedSelectDynamic:{
		borderRadius: '0%',
		maxHeight: '23px',
		width: '209px',
	},
	outlinedSelectSecond: {
		borderRadius: '0%',
		maxHeight: '23px',
		width: '90%',
		backgroundColor: 'white'
	},
	tableCellStyleFirst: {
		borderRight: `1px solid ${theme.palette.borderColor}`
	},
	selectStyle : {
		borderRadius: '0%',
		maxHeight: '23px',
	},
	tableCellStyle: {
		padding: '7px 5px 0px 5px',
		verticalAlign: 'top', 
	},
	toolbar:{
        "& > *":{
           // marginRight:theme.spacing(15),
            marginLeft:theme.spacing(10)
        }
	},
	advancedOption:{
		color: '#0072C6'
	}

  }));

const StyledSelect = withStyles((theme) => ({
root: {
	borderRadius: '0px !important',
	padding: 3
}
}))(Select)

const StyledFormControlLabel = withStyles((theme) => ({
    label: {
        fontSize: theme.typography.pxToRem(12),
        paddingLeft: 'none'
    },
    labelPlacementStart: {
        marginLeft: '10px',
        marginRight: '0px'
    }
}))(FormControlLabel)

const dummy = [ 
	{id: 0, isRowChecked: false, inputPropertiesChecked: false, isHidden: true, customPicklist: false, isPopupDataFilled:false, togglePopup: false},
	{id: 1, isRowChecked: false, inputPropertiesChecked: false, isHidden: true, customPicklist: false, isPopupDataFilled:false, togglePopup: false},
	{id: 2, isRowChecked: false, inputPropertiesChecked: false, isHidden: true, customPicklist: false, isPopupDataFilled:false, togglePopup: false},
	{id: 3, isRowChecked: false, inputPropertiesChecked: false, isHidden: true, customPicklist: false, isPopupDataFilled:false, togglePopup: false}
]

const Filters = () => {
	const classes = useStyles();
	const [rowData, setRowData] = useState(dummy)
	const [toggle, setToggle] = useState(false)
	const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }
    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleToggle = () => {
        setToggle(!toggle)
	}
	
	const handlePopupClose = id => {
		const newRowData = [...rowData]
		newRowData[id].isPopupDataFilled = !newRowData[id].isPopupDataFilled
		newRowData[id].togglePopup = !newRowData[id].togglePopup
		setRowData(newRowData)
	}
	
	const handleRowChecked = (id) => {
        const newRowData = [...rowData]
        newRowData[id].isRowChecked = !newRowData[id].isRowChecked
        setRowData(newRowData)
    }

	const handleIPButtonChange = id => {
        const newRowData = [...rowData]
		newRowData[id].inputPropertiesChecked = !newRowData[id].inputPropertiesChecked
		newRowData[id].isPopupDataFilled = !newRowData[id].isPopupDataFilled
		newRowData[id].isHidden = true
		newRowData[id].customPicklist = false
        setRowData(newRowData)
	}
	
	const handleHideShowPicklist = id => {
		const newRowData = [...rowData]
		newRowData[id].isHidden = !newRowData[id].isHidden
		newRowData[id].customPicklist = !newRowData[id].customPicklist
        setRowData(newRowData)
	}

    return(
        <div className={classes.root}>
            <Paper elevation={0} >
					<Grid justify="space-between" container spacing={18}>
						<Grid item>
							<Typography variant="h6"  style={{ marginLeft: '10px' }}>
								<b>Filters</b>
							</Typography>
						</Grid>

						<Grid item>
							<Typography variant='h6' color='primary' style={{ marginRight: '10px' }}>
								+ Conditions
							</Typography>
						</Grid>
					</Grid>
				<TableContainer style={{ minHeight:'80vh' }}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell align='left'>{' '}</TableCell>
								<TableCell align='left'>{' '}</TableCell>
								<TableCell align='left'><span style={{ marginLeft: '25px' }}></span>Fields</TableCell>
								<TableCell align='left'>Operator</TableCell>
								<TableCell align='left'><span style={{ marginLeft: '25px' }}></span>Input Required<span style={{ marginLeft: '125px' }}>Value</span></TableCell>
								<TableCell align='left'>{' '}</TableCell>
								<TableCell align='left'>{' '}</TableCell>
								<TableCell align='left'>{' '}</TableCell>
							</TableRow>
                        </TableHead>
						<TableBody>
							{ rowData.map((data, i) => {
								return(
									<TableRow key={data.id}>
										<TableCell align='left' width='3%' className={classes.tableCellStyle}>
											<Checkbox
													size= 'small'
													color="primary"
													disableRipple= {true}
													disableFocusRipple = {true} 
													checked={data.isRowChecked}
													onChange={() => handleRowChecked(data.id)}
													style={{ marginTop: '-7px' }}
													/>	
										</TableCell>
										<TableCell align='left' width='6%' className={clsx(classes.tableCellStyle, classes.tableCellStyleFirst)} >					
											<StyledSelect className={classes.outlinedSelect} variant="outlined" >
												<option value='1'>10</option>
												<option>10</option>
												<option>10</option>
											</StyledSelect>
										</TableCell>
										<TableCell align='left' width='24%' className={classes.tableCellStyle} style={{ backgroundColor: '#F1F1F1', textAlign: 'right', paddingRight: '30px' }}>
											<StyledSelect className={classes.outlinedSelectSecond} variant="outlined" >
												<option value='1'>10</option>
												<option>10</option>
												<option>10</option>
											</StyledSelect>
										</TableCell>
										<TableCell align='left' width='15%' className={classes.tableCellStyle} style={{ backgroundColor: '#F1F1F1' }}>
												<StyledSelect className={classes.outlinedSelect} variant="outlined" >
													<option value='1'>hhhhhhhhhhhh</option>
													<option>10</option>
													<option>10</option>
												</StyledSelect>
										</TableCell>
										<TableCell align='left' width='40%' className={clsx(classes.tableCellStyle, classes.tableCellStyleFirst)} >
												<div style={{ float:'left', marginLeft: '35px' }}>
												<StyledFormControlLabel
														style={{ marginTop: '-7px' }}
														value="inputProperties"
														control={<Checkbox 
																color="primary" 
																checked={data.inputPropertiesChecked}
																onChange={() => handleIPButtonChange(data.id)}
																/>}
														label=" Input Required"
														labelPlacement="end"
														/>
													{/* <Checkbox
													size= 'small'
													color="primary"
													onChange={() => handleIPButtonChange(data.id)}
													disableRipple= {true}
													checked={data.inputPropertiesChecked}
													disableFocusRipple = {true}
													style={{ marginTop: '-7px' }}/>
													{ data.inputPropertiesChecked ? 
													<Button onClick={handleToggle} style={{ marginTop: '-7px' }}> Input Properties </Button>
													: null } */}
													</div>
												<div style={{ float:'right', display: 'flex', marginRight: '42px'}}>
													{!data.inputPropertiesChecked ? 
													<StyledSelect className={classes.outlinedSelectDynamic} style={{  marginLeft: '10px' }} variant="outlined" >
															<option value='1'>10</option>
															<option>10</option>
															<option>10</option>
													</StyledSelect>
													: 
													<InputBox form={false} label='Alias' style={{ width: '210px', marginLeft: '10px' }} />
													}
												</div>
												{ data.isPopupDataFilled ? 
											<div>
											<Grid
												container
												direction="row"
												justify="flex-start"
												alignItems="flex-start"
												style={{ marginLeft: '24px' }}
												>
													<StyledFormControlLabel
														value="hidden"
														control={<Checkbox color="primary" checked={data.isHidden} onChange={() => handleHideShowPicklist(data.id)}/>}
														label="Hidden"
														labelPlacement="start"
														/>
													<StyledFormControlLabel
														value="customPicklist"
														control={<Checkbox color="primary" checked={data.customPicklist} onChange={() => handleHideShowPicklist(data.id)}/>}
														label="Custom Picklist"
														labelPlacement="start"
														/>
													</Grid>
											</div>
											: null}
											{ !data.isHidden ? 
											<div style={{ margin: '0px 0px 10px 32px' }}>
											<Grid
												container
												direction="row"
												justify="flex-start"
												alignItems="flex-start"
												>
												<div >
											
												{/* <StyledSelect style={{ width:'140px', marginRight: '40px' }} className={classes.selectStyle} variant="outlined" >
															<option value='1'>10</option>
															<option>10</option>
															<option>10</option>
													</StyledSelect> */}
													<PickList label="Associated PickList" style={{width: '140px',marginRight: '40px' }}/>
													</div>
													<div>
													
													<SelectBox label="Input Type" list={[{value:1,label:"Test"}]}  style={{ width:'75px', marginRight: '40px' }} className={classes.selectStyle}/>
												
													</div>
													<div>
													{/*<Typography variant="subtitle1"><b>Default Value</b></Typography>*/}
													<SelectBox label="Default Value" list={[{value:1,label:"Test"},{value:2,label:"Test1"}]} style={{ width:'110px'}} className={classes.selectStyle}/>
													{/*<StyledSelect style={{ width:'110px'}} className={classes.selectStyle} variant="outlined" >
															<option value='1'>10</option>
															<option>10</option>
															<option>10</option>
													</StyledSelect>*/}
													</div>
												</Grid>
												<div style={{ marginTop: '10px' }}>
												<Grid
												container
												direction="row"
												justify="flex-start"
												alignItems="flex-start"
												>
													<Typography variant="subtitle1" className={classes.advancedOption} onClick={handleClick}>Advanced Option</Typography>	
													<PopOverAdvancedMenu handleClick={handleClick} anchorEl={anchorEl} handleClose={handleClose} />
												</Grid>
												</div>
											</div>
											: null  }
										</TableCell>
										<TableCell align='left' width='7%' className={classes.tableCellStyle}>
											<StyledSelect className={classes.outlinedSelect} variant="outlined" style={{ marginLeft: '20px' }}>
												<option value='1'>10</option>
												<option>10</option>
												<option>10</option>
											</StyledSelect>
										</TableCell>
										<TableCell align='left' width='5%' className={classes.tableCellStyle}>
											<StyledSelect className={classes.outlinedSelect} variant="outlined" style={{ marginLeft: '10px' }}>
												<option value='1'>10</option>
												<option>10</option>
												<option>10</option>
											</StyledSelect>
										</TableCell>
											<TableCell align='left' className={classes.tableCellStyle}>{''}</TableCell>
									</TableRow>
								)
							}) }
                        </TableBody>
					</Table>
				</TableContainer>
            </Paper>
			{toggle ? 
                <CustomDialog open={true} handleClose={handleToggle} maxWidth='md' title='Input Proerties'>
					<InputProperties />
                    {/* <Grid conatiner justify="flex-end">
                        <Button onClick={handleToggle} color="primary">Close</Button>{' '}
                        <Button >Submit</Button>
                    </Grid> */}
                </CustomDialog>
                : null
                }
        </div>
    )

}

export default Filters