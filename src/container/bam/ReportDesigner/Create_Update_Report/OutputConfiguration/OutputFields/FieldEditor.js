import React, { useState, Fragment, useEffect } from 'react'
import {
   Grid,
   DialogTitle,
   DialogActions,
   InputBox,
   Button,
   makeStyles,
   Typography,
   Tabs,
   Tab,
   List,
   ListItem,
   StyledTab
} from 'component'
import { useSelector, useDispatch } from 'react-redux'
import { CreateReport } from "redux/action";
import { ValidateQuery, GetTableData } from 'global/bam/api/ApiMethods'
const tabHeight = '20px'

const useStyles = makeStyles(theme => ({
   root_main: {
      backgroundColor: theme.palette.backgroundContainer,
      width: '75vw',
      '& .MuiTabs-root': {
         background: 'transparent'
      },
      '& .MuiTab-root': {
         padding: '6px 5px'
      },
   },
   upperContainer: {
      margin: '10px 0'
   },
   fieldNameContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      //   width: '950px',
      margin: '0 15px'
   },
   lowerContainer: {
      display: 'flex',
      height: '242px'
   },
   child: {
      border: '1px solid lightgrey',
      width: '33.333%',
      paddingLeft: '10px',
      overflow: 'auto'
   },
   tabs: {
      minHeight: tabHeight,
      height: tabHeight,
      background: '#F7F7F7',
      borderBottom: '1px solid #707070',
   },
   tab: {
      fontSize: '12px',
      minWidth: '10px',
      textTransform: 'none',
      minHeight: tabHeight,
      height: tabHeight
   },
   labelLowerContainer: {
      paddingBottom: '10px',
      color: '#767676',
      fontWeight: '600'
   },
   reportedFieldsListContainer: {
      height: '190px',
      overflow: 'auto'
   },
   listItem: {
      fontSize: '12px',
      padding: '0',
      marginBottom: '5px',
      cursor: 'pointer'
   },
   buttonWrapper: {
      display: 'grid',
      placeItems: 'center',
      backgroundColor: theme.palette.common.white,
      minWidth: '40px',
      height: '40px',
      borderColor: '#CDCDCD'
   },
   tab_container: {
      marginTop: theme.spacing(1),
      overflow: 'hidden'
   }
}))

const RenderButton = props => {
   const classes = useStyles();
   const { type } = props;
   return (
      <Fragment>
         <Grid container spacing={2}>
            {props.data
               ? props.data.map((obj, key) => (
                  <Grid item key={key}>
                     <Button variant='outlined' className={classes.buttonWrapper}
                        onClick={() => props.onClickHandler(obj)}>
                        {type == "function" ? obj.value.split('(')[0] : obj.value}
                     </Button>
                  </Grid>
               ))
               : null
            }
         </Grid>
      </Fragment>
   )
}

const FieldEditor = props => {
   const { data, displayData, t } = props;
   const classes = useStyles()
   const [dialogState, store, snackbarState] = useSelector(state => {
      return [
         state.normalDialogState,
         state.createReportState,
         state.snackbarState
      ]
   })
   const dispatch = useDispatch();

   const [dbFunctions, setDBFunctions] = useState([])
   const [dbOperators, setDBOperators] = useState([])
   const [funcTab, setFuncTab] = useState([])
   const [oprTab, setOprTab] = useState([])
   const [configValue, setconfigValue] = useState(0)
   const [config, setConfig] = useState(0)
   const [table, setTable] = useState([])
   const [values, setValues] = useState({
      field_name: data ? data.name : "",
      expression: data ? data.function_value : "",
      description: data ? data.function_description : ""
   })

   const handleConfig = (e, val) => {
      setConfig(val)
   }

   const handleConfigurations = (e, val) => {
      setconfigValue(val)
   }

   useEffect(() => {
      getFunctionData()
   }, [])

   const getFunctionData = () => {
      let inputJson = {
         opr: '3',
         opt: 0,
         sort_order: 'A',
         last_value: '',
         last_index: '',
         prefix: '',
         batch_size: '',
         column_name: '',
         table_name: ''
      }
      GetTableData(inputJson)
         .then(response => {
            if (response != null) {
               const { db_functions, db_operators } = response.data;
               let func = [], opr = [];
               let a = {}

               db_functions.mssql.category.map((item, index) => {
                  a = {
                     label: item.category_name,
                     index: index,
                     component: RenderButton,
                     componentProps: {
                        onClickHandler: onFunctionButtonClickHandler,
                        data: item.function,
                        type: 'function'
                     }
                  }
                  func.push(a)
               })

               db_operators.mssql.category.map((item, index) => {
                  a = {
                     label: item.category_name,
                     index: index,
                     component: RenderButton,
                     componentProps: {
                        onClickHandler: onFunctionButtonClickHandler,
                        data: item.operator,
                        type: 'operator'
                     }
                  }
                  opr.push(a)
               })

               setFuncTab(func)
               setOprTab(opr)

               setDBFunctions(db_functions.mssql.category)
               setDBOperators(db_operators.mssql.category)
            }
         })
         .catch(err => { })
   }

   const onCloseHandler = () => {
      dialogState.closeDialog()
   }

   const onFunctionButtonClickHandler = (obj, type) => {
      let value = type === 'feild' ? obj.name : obj.value
      setValues(prevState => {
         return {
            ...prevState,
            expression: prevState.expression + value
         }
      })

      if (type === 'feild') {
         let ar = table;
         let table_name = obj.name.split('.')[0]
         let checkTableNameExists = ar.filter(item => item === table_name)
         if (checkTableNameExists.length == 0) {
            ar.push(table_name)
         }
         setTable(ar)
      }
   }

   const onSubmitHandler = e => {
      e.preventDefault()
      let description = e.target.description.value.trim()
      let expression = e.target.expression.value.trim()
      let fieldName = e.target.field_name.value.trim()
      let inputJson = {
         flag: '1',
         execution_type: "Q",
         query_xml: {
            report_query_xml: {
               query_type: 'F',
               t_info_xml: {
                  tables: table
               },
               f_info_xml: [
                  {
                     name: `(${expression})`,
                     d_name: fieldName
                  }
               ]
            }
         }
      }

      const param = {
         "name": fieldName,
         "display_name": fieldName,
         'function_type': 'F',
         'function_name': fieldName,
         'function_value': expression,
         'function_description': description
      }

      // Done by Sandeep Singh
      ValidateQuery(inputJson)
         .then(res => {
            if (res != null && res.status.maincode === '0') {
               let updatedField = store.field
               let ar = [];
               if (data) {
                  updatedField.map((item) => {
                     if (item.display_name == data.display_name)
                        ar.push(param)
                     else
                        ar.push(item)
                  })
                  dispatch(CreateReport({ ...store, field: ar }));
               } else {
                  updatedField.push(param)
                  dispatch(CreateReport({ ...store, field: updatedField }));
               }
               onCloseHandler();
            } else {
               snackbarState.openSnackbar(
                  `${t('bam:ERROR')}: ${res.status.errormsg}`,
                  'error'
               )
            }
         })
         .catch(err => { })
   }


   const actionButton = [
      {
         label: `${t('bam:LABEL_CANCEL')}`,
         action: onCloseHandler,
         variant: 'outlined',
         color: 'secondary',
         type: 'button'
      },
      {
         label: `${t('bam:ADD')}`,
         // action: onSubmitHandler,
         variant: 'contained',
         color: 'primary',
         type: 'submit'
      }
   ]

   return (
      <div className={classes.root_main}>
         <form onSubmit={onSubmitHandler}>
            <div className={classes.upperContainer}>
               <Typography variant='h6' style={{ margin: '15px' }}>
                  <strong>{t('bam:CALCULATED_FIELD_EDITOR')}</strong>
               </Typography>
               <div className={classes.fieldNameContainer}>
                  <InputBox
                     id='notquie'
                     label={t('bam:FIELD_NAME')}
                     name='field_name'
                     form={false}
                     style={{ width: '187px' }}
                     value={values.field_name}
                     injectLiveValue={true}
                     onChange={(e) => setValues({
                        ...values,
                        'field_name': e.target.value
                     })}
                  />
                  <Button color='primary' style={{ fontSize: '12px' }} onClick={() => setValues({
                     field_name: "",
                     expression: '',
                     description: ''
                  })}>{t('bam:CLEAR_ALL')}</Button>
               </div>
               <div style={{ margin: '0 15px' }}>
                  <InputBox
                     label={`${t('bam:EXPRESSION')} :`}
                     multiline={true}
                     fullWidth={true}
                     form={true}
                     rows={4}
                     injectLiveValue={true}
                     value={values.expression}
                     name='expression'
                     onChange={(e) => setValues({
                        ...values,
                        expression: e.target.value
                     })}
                  />
                  <InputBox
                     id='unqie'
                     label={t('bam:DESCRIPTION')}
                     fullWidth={true}
                     form={true}
                     name='description'
                     injectLiveValue={true}
                     value={values.description}
                     onChange={(e) => setValues({
                        ...values,
                        'description': e.target.value
                     })}
                  />
               </div>
            </div>

            <div className={classes.lowerContainer}>
               <div className={classes.child}>
                  <Typography
                     className={classes.labelLowerContainer}
                     variant='subtitle1'
                  >
                     {t('bam:FUNCTIONS')}
                  </Typography>

                  <StyledTab
                     container={true}
                     tabsArray={funcTab}
                     tabHeight={'32px'}
                  />
               </div>
               <div className={classes.child}>
                  <Typography
                     className={classes.labelLowerContainer}
                     variant='subtitle1'
                  >
                     {t('bam:REPORTED_FIELDS')}
                  </Typography>
                  <List className={classes.reportedFieldsListContainer}>
                     {displayData.map(item => (
                        <ListItem className={classes.listItem} key={item}
                           onClick={() => onFunctionButtonClickHandler(item, 'feild')}>
                           {item.name}
                        </ListItem>
                     ))}
                  </List>
               </div>
               <div className={classes.child}>
                  <Typography
                     className={classes.labelLowerContainer}
                     variant='subtitle1'
                  >
                     {t('bam:OPERATORS')}
                  </Typography>
                  <StyledTab
                     container={true}
                     tabsArray={oprTab}
                     tabHeight={'32px'}
                  />
               </div>
            </div>
            <DialogActions>
               {actionButton.map((res, key) => (
                  <Button
                     key={res.key}
                     type={res.type}
                     variant={res.variant}
                     color={res.color}
                     onClick={res.action}
                  >
                     {res.label}
                  </Button>
               ))}
            </DialogActions>
         </form>
      </div>
   )
}

export default FieldEditor
