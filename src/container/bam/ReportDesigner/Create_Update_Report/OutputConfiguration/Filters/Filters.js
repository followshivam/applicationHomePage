import React, { useState, Suspense, lazy, Fragment } from 'react'
import {
	Paper,
	SelectBox,
	CustomDialog,
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
	Spinner,
	withStyles,
	Typography,
	IconsButton, AssociatedPickList, clsx,
	Button,
	IconImage
} from "component";
import { useSelector } from "react-redux";
import InputProperties from './Filters_input_form'
// import PopOverAdvancedMenu from './PopoverAdvancedMenu.js';
const PopOverAdvancedMenu = lazy(() => import('./PopoverAdvancedMenu'))
const AssociatedDialog = lazy(() => import("../AssociatedComponent/associated_picklist"))

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		minHeight: "516px",
	},
	title: {
		display: 'flex',
		justifyContent: 'space-between',
		// marginTop: '5px'
		padding: '20px'
	},
	outlinedSelect: {
		minWidth: '80%',
	},
	outlinedSelectDynamic: {
		borderRadius: '0%',
		maxHeight: '23px',
		width: '209px',
	},
	outlinedSelectSecond: {
		width: '90%',
	},
	tableCellStyleFirst: {
		borderRight: `1px solid ${theme.palette.borderColor}`
	},
	selectStyle: {
		borderRadius: '0%',
		maxHeight: '23px',
	},
	tableCellStyle: {
		padding: '10px 5px 3px 5px',
		verticalAlign: 'top',
	},
	toolbar: {
		"& > *": {
			// marginRight:theme.spacing(15),
			marginLeft: theme.spacing(10)
		}
	},
	advancedOption: {
		color: '#0072C6',
		cursor: 'pointer'
	}

}));

const StyledFormControlLabel = withStyles((theme) => ({
	labelPlacementStart: {
		width: 'inherit'
	}
}))(FormControlLabel)

const StyledTableCell = withStyles(theme => ({

	sizeSmall: {
		padding: '6px 24px 6px 8px',
		color: '#767676'
	}
}))(TableCell)

const Filters = (props) => {
	const classes = useStyles();
	const { reportStore, onChangeState = null, t } = props;

	const INPUT_TYPE = [
		{
			label: `${t('bam:INTEGER')}`,
			value: 'integer'
		},
		{
			label: `${t('bam:TEXT')}`,
			value: 'text'
		},
		{
			label: `${t('bam:DECIMAL')}`,
			value: 'decimal'
		},
		{
			label: `${t('bam:DATE_TIME')}`,
			value: 'datetime'
		},
		{
			label: `${t('bam:TEXTAREA')}`,
			value: 'textarea'
		}
	]

	const OPERATOR_LIST = [
		{ value: "=", label: "=" },
		{ value: ">", label: ">" },
		{ value: "<", label: "<" },
		{ value: ">=", label: ">=" },
		{ value: "<=", label: "<=" },
		{ value: "<>", label: "<>" },
		{ value: "LIKE", label: `${t('bam:OP_LIKE')}` },
		{ value: "IN", label: `${t('bam:OP_IN')}` },
		{ value: "And", label: `${t('bam:OP_AND')}` },
		{ value: "Or", label: `${t('bam:OP_OR')}` },
		{ value: "NOT IN", label: `${t('bam:OP_NOT_IN')}` },
		{ value: "IS NULL", label: `${t('bam:OP_LIKE')}` },
		{ value: "IS NOT NULL", label: `${t('bam:OP_IS_NOT_NULL')}` },
	]


	const [toggle, setToggle] = useState(false)
	const dialogState = useSelector(state => {
		return state.normalDialogState;
	});

	const [normalDialog, snackbarState] = useSelector(state => {
		return [state.normalDialogState, state.snackbarState]
	});

	// const dummyData = {
	// 	id: 0,
	// 	"start_brace": "N",
	// 	"field": {},
	// 	"operator": "=",
	// 	"user_input_required": false,
	// 	hidden: false,
	// 	"value": {
	// 		"FieldType": "K",
	// 		"Name": "",
	// 		"DisplayName": "",
	// 		"Type": "",
	// 		"Length": ""
	// 	},
	// 	"end_brace": "N",
	// 	"join_condition": ""
	// }
	const dummyData = {
		id: 0,
		"start_brace": "",
		"end_brace": "",
		"operator": "",
		"join_condition": "",
		"type": "4",
		"display_name": "",
		"user_input_required": false,
		"field_name": "", //field
		"field_value": "", //selct box
		"field_type": "",
		"description": "",
		"show_default_in_output": true,
		"hide_from_output": false,
		"hidden_flag": true,
		"custom_picklist_flag": false,
		"all_option": false,
		"null_option": false,
		"not_null_option": false,
		"multi_selection": false,
		"in_type_input": false,
		"auto_gen": true,
		"delimited": false,
		"delimiter": "\"",
		"all_label": "",
		"null_label": "",
		"not_null_label": "",
		"custom_picklist_def": {
			// "assoc_report_id": "263",
			// "assoc_report_id":"",
			// "picklist_height": "56",
			// "picklist_width": "",
			// "show_header": false,
			// "show_filter": false,
			// "picklist_input_mapping": [
			// 	{
			// 		"picklist_input_field": "Process Name",
			// 		"mapped_field_type": "C",
			// 		"mapped_field_value": "",
			// 		"mapped_field_mandatory": false
			// 	},
			// 	{
			// 		"picklist_input_field": "ProcessDefId",
			// 		"mapped_field_type": "C",
			// 		"mapped_field_value": "",
			// 		"mapped_field_mandatory": false
			// 	},
			// 	{
			// 		"picklist_input_field": "From Date",
			// 		"mapped_field_type": "",
			// 		"mapped_field_value": "",
			// 		"mapped_field_mandatory": false
			// 	},
			// 	{
			// 		"picklist_input_field": "To Date",
			// 		"mapped_field_type": "",
			// 		"mapped_field_value": "",
			// 		"mapped_field_mandatory": false
			// 	}
			// ],
			// "picklist_output_mapping": [
			// 	{
			// 		"picklist_input_field": "ID",
			// 		"mapped_field_display": "ProcessDefId",
			// 		"mapped_field_name": "ProcessDefId"
			// 	}
			// ]
		},
		"default_value": "",
		"manadatory": false,
		"default_display": false,
		"read_only_input": false,
		"length": ""
	}

	const handleToggle = () => {
		setToggle(!toggle)
	}
	const addFilterHandler = () => {
		let newData = { ...dummyData }
		newData.id = new Date().getTime()
		onChangeState({ ...reportStore, filter: [...reportStore.filter, newData] })
	}

	const getFormValue = (e, key, res) => {
		let currentIndex = [...reportStore.filter];
		currentIndex[key] = { ...currentIndex[key], [e.target.name]: e.target.value }
		onChangeState({ ...reportStore, filter: currentIndex })
	}

	const advancedOptionHandler = (e, key) => {
		let currentIndex = [...reportStore.filter];
		if (e.target.checked) {
			currentIndex[key] = { ...currentIndex[key], [e.target.name]: true }
		} else {
			currentIndex[key] = { ...currentIndex[key], [e.target.name]: false }
		}
		onChangeState({ ...reportStore, filter: currentIndex })
	}

	const setInputRequired = (e, key) => {
		let currentIndex = [...reportStore.filter];
		currentIndex[key] = { ...currentIndex[key], user_input_required: !currentIndex[key].user_input_required }
		onChangeState({ ...reportStore, filter: currentIndex })
	}
	const getPickListValue = (e, key) => {
		let currentIndex = [...reportStore.filter];

		if (e.target.checked) {
			if (e.target.name == 'hidden_flag') {
				currentIndex[key] = {
					...currentIndex[key],
					hidden_flag: true,
					custom_picklist_flag: false
				}
			} else {
				if (currentIndex[key].display_name) {
					currentIndex[key] = {
						...currentIndex[key],
						custom_picklist_flag: true,
						hidden_flag: false
					}
				} else {
					snackbarState.openSnackbar(
						`${t('bam:EROR')}: ${t('bam:SPECIFY_ALIAS')}`,
						'error'
					)
				}
			}
		} else {
			if (e.target.name == 'hidden_flag') {
				currentIndex[key] = {
					...currentIndex[key],
					hidden_flag: false
				}
			} else {
				currentIndex[key] = {
					...currentIndex[key],
					custom_picklist_flag: false
				}
			}
		}
		let state = { ...reportStore }
		state.filter = currentIndex

		onChangeState(state)
	}

	const handleDialogClose = () => {
		dialogState.closeDialog()
	}

	const [deleteItem, setDeleteItem] = useState([])

	const handleSelectedRow = (e, res) => {
		if (e.target.checked && !deleteItem.includes(res.id)) {
			setDeleteItem([...deleteItem, res.id])
		} else {
			setDeleteItem(deleteItem.filter(el => el != res.id))
		}
	}

	const handleDeleteRows = () => {
		let valuesArr = reportStore.filter.filter(res => {
			return deleteItem.indexOf(res.id) == -1
		})
		onChangeState({ ...reportStore, filter: valuesArr })
		setDeleteItem([])
	}

	var FIELD_LIST = []
	var len = reportStore.field.length
	for (var i = 0; i < len; i++) {
		FIELD_LIST.push({
			value: reportStore.field[i].name,
			label: reportStore.field[i].name
		})
	}

	var VALUE_LIST = []
	let value_list_data = reportStore.field.filter(data => data.type == 4)
	let value_len = value_list_data.length

	for (var i = 0; i < value_len; i++) {
		VALUE_LIST.push({
			value: value_list_data[i].name,
			label: value_list_data[i].name
		})
	}



	const handleAdvancedOptionData = (data, key) => {
		let currentIndex = [...reportStore.filter]
		currentIndex[key] = data
		onChangeState({ ...reportStore, filter: currentIndex })
		normalDialog.closeDialog()
	}

	const handleAddAction = (index, data) => {
		let currentIndex = [...reportStore.filter]
		currentIndex[index].custom_picklist_def = data
		onChangeState({ ...reportStore, filter: currentIndex })
		normalDialog.closeDialog()
	}


	return (
		<div className={classes.root}>
			<Paper elevation={0} >
				<div className={classes.title}>
					<Typography variant='h5'>
						{t('bam:FILTERS')}
					</Typography>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<Button
							variant='outlined'
							onClick={addFilterHandler}
							color='primary'
							startIcon={
								<IconImage
									className={classes.icon}
									url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/plus_blue.svg`}
									height={15}
								/>
							}
						>
							{t('bam:ADD_CONDITION')}
						</Button>
						<Button
							disabled={deleteItem.length < 1}
							style={{ marginTop: '8px' }}
							variant='outlined'
							onClick={handleDeleteRows}
							color='primary'
							startIcon={
								<IconsButton
									type='DeleteIcon'
									color='primary'
									disabled={deleteItem.length < 1}
								/>
							}
						>
							{t('bam:BUTTON_DELETE')}
						</Button>
					</div>

				</div>
				{/* <div className={classes.title}>
					<div></div>
					<Button
						disabled={deleteItem.length < 1}
						variant='outlined'
						onClick={handleDeleteRows}
						color='primary'
						startIcon={
							<IconsButton
								type='DeleteIcon'
								color='primary'
								disabled={deleteItem.length < 1}
							/>
						}
					>
						Delete
            </Button>
				</div> */}
				<TableContainer style={{ minHeight: '80vh' }}>
					{reportStore.filter.length > 0 && <Table>
						<TableHead>
							<TableRow>
								<TableCell align='left'>{' '}</TableCell>
								<TableCell align='left'>{' '}</TableCell>
								<TableCell align='left'><span style={{ marginLeft: '25px' }}></span>{t('bam:LABEL_FIELDS')}</TableCell>
								<StyledTableCell align='left'>{t('bam:OPERATOR')}</StyledTableCell>
								<TableCell align='left'><span style={{ marginLeft: '25px' }}></span>{t('bam:VALUE')}</TableCell>
								<TableCell align='left'>{' '}</TableCell>
								<TableCell align='left'>{' '}</TableCell>
								<TableCell align='left'>{' '}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{reportStore.filter.map((res, key) => {
								return (
									<TableRow key={res.id}>
										<TableCell align='left' width='3%' className={classes.tableCellStyle}>
											<Checkbox
												size='small'
												color="primary"
												disableRipple={true}
												disableFocusRipple={true}

												onChange={e =>
													handleSelectedRow(e, res, key)
												}
												style={{ marginTop: '-7px' }}
											/>
										</TableCell>
										<TableCell align='left' width='6%' className={clsx(classes.tableCellStyle, classes.tableCellStyleFirst)} >
											<SelectBox list={[{ value: "(", label: "(" }]} style={{ width: '100%' }} value={res.start_brace} name="start_brace" onChangeHandler={(e) => getFormValue(e, key, res)} />

										</TableCell>
										<TableCell align='left' width='24%' className={classes.tableCellStyle} style={{ backgroundColor: '#F1F1F1', textAlign: 'right', paddingRight: '30px' }}>
											<SelectBox name='field_name'
												style={{ width: "90%" }} list={FIELD_LIST}
												value={res.field_name}
												onChangeHandler={(e) => getFormValue(e, key, res)} />



										</TableCell>
										<TableCell align='left' width='15%' className={classes.tableCellStyle} style={{ backgroundColor: '#F1F1F1' }}>
											<SelectBox list={OPERATOR_LIST} value={res.operator} style={{ width: "90%" }} name="operator" onChangeHandler={(e) => getFormValue(e, key, res)} />
										</TableCell>
										<TableCell align='left' width='40%' className={clsx(classes.tableCellStyle, classes.tableCellStyleFirst)} >
											<div style={{ float: 'left', marginLeft: '35px' }}>
												<FormControlLabel
													style={{ marginTop: '-7px' }}
													value="inputProperties"
													control={<Checkbox
														color="primary"
														checked={res.user_input_required}
														name="user_input_required"
														onChange={(e) => setInputRequired(e, key)}
													/>}
													label={t('bam:INPUT_REQUIRED')}
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
											<div style={{ float: 'right', display: 'flex', marginRight: '42px' }}>
												{res.user_input_required ?
													<InputBox form={false} name='display_name' value={res.display_name} label={t('bam:STR_ALIAS')} labelMinWidth='35px' labelMaxWidth='35px' style={{ width: '210px', }} onChangeHandler={(e) => getFormValue(e, key, res)} />


													:
													<SelectBox list={VALUE_LIST} name="field_value" value={res.field_value} onChangeHandler={(e) => getFormValue(e, key, res)} className={classes.outlinedSelectDynamic} />
												}
											</div>
											{res.user_input_required ?
												<div style={{ display: 'flex', width: '100%', marginLeft: '30px' }}>
													<div style={{ marginTop: '15px', }}>
														<StyledFormControlLabel
															value="hidden"
															name="hidden_flag"
															control={<Checkbox color="primary" checked={res.hidden_flag} onChange={(e) => getPickListValue(e, key)} />}
															label={t('bam:LABEL_HIDDEN')}
															labelPlacement="start"
														/>
													</div>
													<div style={{ marginTop: '15px', }}>
														<StyledFormControlLabel
															value="customPicklist"
															name="custom_picklist_flag"
															control={<Checkbox color="primary" checked={res.custom_picklist_flag} onChange={(e) => getPickListValue(e, key)} />}
															label={t('bam:CUSTOM_PICKLIST')}
															labelPlacement="start"
														/></div>
												</div>

												: null}
											{(res.user_input_required && res.custom_picklist_flag) ?
												<div style={{ margin: '15px 0px 10px 32px' }}>
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
															<AssociatedPickList label={t('bam:ASSOCIATED_PICKLIST_COLUMN')} labelMinWidth="200px" labelMaxWidth="200px"
																disabled={false}
																style={{ width: '140px', marginRight: '40px' }}
																action={() => dialogState.openDialog(
																	<Suspense fallback={<div style={{ height: "450px", minWidth: "600px" }}><Spinner msg="" /></div>}>
																		<AssociatedDialog
																			store={reportStore}
																			picklistInputData={
																				res.custom_picklist_def
																			}
																			currentData={res}
																			fromFilter={true}
																			index={key}
																			action_button={[
																				{ id: 1, label: `${t('bam:BUTTON_CLOSE')}`, type: "button", variant: "outlined", color: "primary", action: handleDialogClose },
																				{ id: 2, label: `${t('bam:BUTTON_SAVE')}`, type: "submit", variant: "contained", color: "primary", action: handleAddAction }]} />
																	</Suspense>, "Associated Picklist")}
															/>
														</div>
														<div>

															<SelectBox label={t('bam:INPUT_FIELD_TYPE')} list={INPUT_TYPE} style={{ width: '75px', marginRight: '40px' }} className={classes.selectStyle} name='type' value={res.type} onChangeHandler={(e) => getFormValue(e, key, res)} />

														</div>
														<div>
															<InputBox label={t('bam:DEFAULT_VALUE')} value={res.default_value} name='default_value' onChangeHandler={(e) => getFormValue(e, key, res)} style={{ width: '110px' }} className={classes.selectStyle} />

														</div>
													</Grid>
													<div style={{ marginTop: '15px' }}>
														<Grid
															container
															direction="row"
															justify="flex-start"
															alignItems="flex-start"
														>
															<Typography variant="subtitle1" className={classes.advancedOption}
																onClick={() => normalDialog.openDialog(<Suspense fallback={<div style={{ height: "200px", minWidth: "600px" }}><Spinner msg="" /></div>}>
																	<PopOverAdvancedMenu
																		// closeDialog={normalDialog.closeDialog}
																		advancedOptionData={res}
																		getFormValue={getFormValue}
																		handleAdvancedOptionData={handleAdvancedOptionData}
																		index={key}
																		advancedOptionHandler={advancedOptionHandler}
																	/></Suspense>,
																	"AdvancedOptions")}
															>{t('bam:ADVANCED_OPTIONS')}</Typography>
														</Grid>
													</div>
												</div>
												: null}
										</TableCell>
										<TableCell align='left' width='7%' className={classes.tableCellStyle}>
											<SelectBox name="end_brace" value={res.end_brace} onChangeHandler={(e) => getFormValue(e, key, res)} list={[{ value: ")", label: ")" }]} className={classes.outlinedSelect} style={{ marginLeft: '20px' }} />

										</TableCell>
										<TableCell align='left' width='5%' className={classes.tableCellStyle}>
											<SelectBox name="join_condition" value={res.join_condition} onChangeHandler={(e) => getFormValue(e, key, res)} list={[{ value: "And", label: "And" }, { value: "Or", label: "Or" }]} className={classes.outlinedSelect} style={{width:"100%", marginLeft: '10px' }} />
										</TableCell>
										<TableCell align='left' className={classes.tableCellStyle}>{''}</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>}
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