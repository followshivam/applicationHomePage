import React, { Fragment, useEffect, useState } from 'react'
import {
   Paper,
   Typography,
   makeStyles,
   TableCell,
   Button,
   TableHead,
   useTranslation,
   Table,
   TableBody,
   TableRow,
   TableContainer,
   Toolbar,
   Spinner,
   IconImage,
   DynamicTable,
   IconsButton,
   NotFound
} from 'component'
import { useDispatch, useSelector } from 'react-redux'
import Chart from 'react-apexcharts'
import RowDragger from 'component/RowDragger'
import { ChartDataSync, ChartApiData } from 'global/json'
import { lazy } from 'react'
const ReportGenerator = lazy(() => import("container/bam/ReportDesigner/ReportGenerator/report_generate.js"));
const useStyles = makeStyles(theme => ({
   root: {
      flexGrow: 1
   },
   topBar: {
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'white',
      height: 'auto',
      padding: '.4rem 0 .4rem 0'
      // borderBottom: `1px solid ${theme.palette.borderColor}`
   },
   paperLeft: {
      textAlign: 'center',
      backgroundColor: theme.palette.backgroundContainer,
      minHeight: '82.5vh',
      maxHeight: '82.5vh',
      // minHeight: '620px',
      // maxHeight: '620px',
      paddingRight: '.2rem',
      paddingLeft: '.2rem',
      borderRight: `1px solid ${theme.palette.borderColor}`,
      borderLeft: `1px solid ${theme.palette.borderColor}`
   },
   outlinedSelect: {
      // marginLeft:"300px",
      width: '188px'
   },
   refresh_button: {
      fontSize: '20px',
      marginLeft: '1.3rem'
   },
   leftContent: {
      margin: '4px 0',
      backgroundColor: 'white',
      textAlign: 'left',
      // padding:40,
      minHeight: '76.5vh'
      // borderTop: `1px solid ${theme.palette.borderColor}`,
      // borderBottom: `1px solid ${theme.palette.borderColor}`
   },
   table: {
      width: 550,
      marginLeft: 'auto',
      marginRight: 'auto',
      border: `1px solid ${theme.palette.borderColor}`
   },
   tableHeader: {
      backgroundColor: 'lightgray'
   },
   borderRight: {
      // borderRight: `1px solid ${theme.palette.borderColor}`,
      color: 'inherit'
   },


}))
const useToolbarStyles = makeStyles(theme => ({
   root: {
      height: '24px',
      borderRadius: '5px'
   },
   buttonWrapper: {
      marginRight: '12px',
      padding: '2px 9px',
      // borderRadius: "3px",
      backgroundColor: theme.palette.common.white
   },
   graphContainer: {
      padding: theme.spacing(0, 1, 0, 1),
      // minHeight: props => props.dynamicHeight,
      // height:"280px",
      // overflow: props => (props.type !== '' ? 'auto' : undefined)
   },
   heading_toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px',
      direction:props=>props.direction
   },
   child_toolbar1: {
      display: 'flex',
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '30px'
   },
 
   child1_toolbar_left: {
      fontSize: '14px !important',
      fontWeight: '700 !important',
      whiteSpace: 'nowrap',
      color: '#000000 !important',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '4px 0px 4px 8px'
   },
   h6: {
      fontSize: '14px !important',
      fontWeight: '700 !important',
      whiteSpace: 'nowrap',
      color: '#000000 !important',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center'
   },
   child1_toolbar_right: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-end',
      marginRight: '5px',
      alignItems: 'center'
   },
   child_toolbar2: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      height: '30px'
   },
   child2_toolbar_right: {
      display: 'flex',
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingRight: '12px'
   },
   button: {
      marginRight: '8px'
   },
   toggle: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2px 1px 2px 1px',
      backgroundColor: '#e4e4e4',
      borderRadius: '3px',
      marginRight: '8px'
   },
   deleteButton: {
      margin: '0 8px'
      // paddingBottom: '3px'
   }
}))

export const LeftContainer = props => {
   const classes = useStyles()
   const { type = 'table', t } = props

   const [chartData, setChartData] = useState({})
   const [state, setState] = useState(props.state)
   const [isLoading, setIsLoading] = useState(true)
   const [reportState] = useSelector(state => {
      return [state.createReportState]
   })

   useEffect(() => {
      //setIsLoading(true)
      setState(props?.state)
      setTimeout(() => setIsLoading(false), 500)

      setTimeout(() => {
         setChartData(ChartDataSync(props?.state?.chart_properties))
      }, 100)
   }, [props?.state])

   return (
      <Fragment>
         <Paper className={classes.paperLeft} elevation={0} component='div'>
            <div className={classes.topBar}>
               <div
                  style={{
                     border: '1px solid gray',
                     borderRadius: '5px',
                     padding: '10px 14px'
                  }}
               >
                  <IconImage
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/mobile_icon.png`}
                     height={25}
                     width={25}
                  />
               </div>
               <div
                  style={{
                     border: '1px solid gray',
                     borderRadius: '5px',
                     padding: '10px 14px',
                     marginLeft: '10px'
                  }}
               >
                  <IconImage
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/tablet_icon.png`}
                     height={25}
                     width={25}
                  />
               </div>
               <div
                  style={{
                     border: '1px solid gray',
                     borderRadius: '5px',
                     padding: '10px',
                     marginLeft: '10px'
                  }}
               >
                  <IconImage
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/laptop_icon.png`}
                     height={20}
                     width={30}
                  />
               </div>
            </div>
            <div className={classes.leftContent}>
               {type === 'graph' ? (
                  <div
                     id='chart'
                     style={{
                        padding: 45,
                        maxHeight: '67vh',
                        minHeight: '67vh'
                     }}
                  >
                     <span style={{ fontWeight: 'bold' }}>
                        {reportState.report_name}
                     </span>
                     {isLoading === false ? state.chart_properties.chart_type !== '' ? (
                        <Chart
                           options={chartData ? chartData.options : null}
                           series={chartData ? chartData.series : null}
                           type={state.chart_properties.chart_type}
                           height={450}
                        />
                     ) : (<div style={{ margin: 'auto', width: '100%', paddingTop: '100px' }}>
                        <NotFound message="It looks like you haven't added any Chart yet, Please select from drop down ! " />
                     </div>) : (
                        <div style={{ height: '400px' }}>
                           <Spinner />
                        </div>
                     )}
                  </div>
               ) : (
                  <Tabular t={t} {...props} />
               )}
            </div>
         </Paper>
      </Fragment>
   )
}

const Tabular = props => {
   const{t}=props;
   const classes = useStyles()
   const [isLoading, setIsLoading] = useState({ msg: '', loading: true });
   const [tableProperties, setTableProperties] = useState({});
   const [tableData, setTableData] = useState();

   useEffect(() => {
      // console.log(props.state)
      const tableHeaderStyle = {
         color: props.state.table_properties.header_font_color,
         backgroundColor: props.state.table_properties.header_background_color,
         border: props.state.table_properties.table_border_type ? `1px solid ${props.state.table_properties.table_border_color}` : undefined,
      }
      const tableBodyStyle = {
         backgroundColor: props.state.table_properties.table_background_color,
         border: props.state.table_properties.table_border_type ? `1px solid ${props.state.table_properties.table_border_color}` : undefined,
         // borderCollapse: 'collapse'
      }
      const tableRowStyle = {
         color: props.state.table_properties.row_font_color,
         backgroundColor: props.state.table_properties.row_background_color
      }

      const tableCellStyle = (isLastRow, isLastColumn) => {
         // borderTop: `1px solid ${props.state.table_properties.RowOutlineColor}`,
         return {
            color: props.state.table_properties.row_font_color,
            fontFamily: props.state.table_properties.row_font_family,
            fontWeight: props.state.table_properties.row_font_family_variant,
            fontSize: `${props.state.table_properties.row_font_size}px`,
            borderRight:
               props.state.table_properties.show_column_outline === 'Y' && !isLastColumn
                  ? `1px solid ${props.state.table_properties.column_outline_color}`
                  : undefined,
            borderBottom:
               props.state.table_properties.show_row_outline === 'Y' && !isLastRow
                  ? `1px solid ${props.state.table_properties.row_outline_color}`
                  : undefined
         }
      }

      const tableStyles = {
         border: `1px solid ${props.state.table_properties.table_border_color}`
      }

      const tableCellHeadStyle = isLast => ({
         color: props.state.table_properties.header_font_color,
         backgroundColor: props.state.table_properties.header_background_color,
         fontFamily: props.state.table_properties.header_font_family,
         borderBottom: undefined,
         fontWeight: props.state.table_properties.header_font_family_variant,
         borderRight:
            props.state.table_properties.show_column_outline === 'Y' && !isLast
               ? `1px solid ${props.state.table_properties.column_outline_color}`
               : undefined,
         fontSize: `${props.state.table_properties.header_font_family_size}px`
      })

      setTableProperties({
         tableHeaderStyle: tableHeaderStyle,
         tableCellHeadStyle: tableCellHeadStyle,
         tableStyles: tableStyles,
         tableBodyStyle: tableBodyStyle,
         tableRowStyle: tableRowStyle,
         tableCellStyle: tableCellStyle,
         header_font_alignment: props.state.table_properties.header_font_alignment,
         row_font_alignment: props.state.table_properties.row_font_alignment
      })

   }, [props.state.table_properties])

   const getTableData = () => {
      return {
         "data": {
            "table": {
               "row_arr": [{
                  "r_type": "H",
                  "c_arr": props.state.field.map(field => {
                     return {
                        "val": field.display_name,
                        "c_type": "T",
                        "sort": true
                     }
                  }),
                  "d_col_no": props.state.field.length,
                  "obj_row": ""
               }, ...[0, 1, 2, 3, 4].map(_ => {
                  return {
                     "r_type": "D",
                     "c_arr": props.state.field.map(field => {
                        return {
                           "val": field.type === '16' ? field.display_name.toLowerCase() === 'year' ? [2019, 2020, 2018, 2021, 2017][Math.floor(Math.random() * 5)] : ['Grocery', 'Furniture', 'Office Supply', 'Technology', 'Household', 'Apparel'][Math.floor(Math.random() * 5)] : Math.floor(Math.random() * 1000),
                           "custom_style": ""
                        }
                     }),
                     "obj_row": ""
                  }
               })],
               "s_no": true,
               "e_sorting": true,
               "rpt": "TG",
               "all_option": true,
               "all_label": "",
               "r_category": "",
               "batch_values_xml": {
                  "batch_val": {
                     "field": []
                  }
               },
               "batch_info": {
                  "b_show_batching": false,
                  "b_enable_next": false,
                  "b_enable_prev": false
               }
            },
            "table_properties": tableProperties,
            "report_title": "Department Trend",
            "report_type": "T",
            "base_report_type": "TG"
         }
      }
   }
   useEffect(() => {

      setTableData(getTableData())
      setTimeout(() => {
         setIsLoading({ ...isLoading, loading: false });
      }, 1000);
   }, [tableProperties])

   const onRefresh = () => {
      //dummy refresh to show loader just
      setIsLoading({ ...isLoading, loading: true });
      setTableData(getTableData());
      setTimeout(() => {
         setIsLoading({ ...isLoading, loading: false });
      }, 1000);
   }
   console.log('tableData',t('bam:HTML_DIR'))
   return (
      <div style={{ width: '90%', margin: 'auto', paddingTop: '10%' }}>
         {isLoading.loading ? (
            <div style={{ height: '300' }}>
               <Spinner />
            </div>) : (<><EnhancedTableToolbar direction={`${t('bam:HTML_DIR')}`} onRefresh={onRefresh} />
               <DynamicTable
                  divId={'1'}
                  direction= {`${t('bam:HTML_DIR')}`}
                  showBatching={tableData.data?.table?.batch_info?.b_show_batching}
                  data={tableData.data}
               /></>)}
      </div>
   )
}

export const EnhancedTableToolbar = (props) => {
   const store = useSelector(state => {
      return state.createReportState
   })
   const { report_title, onRefresh,direction } = props;
   const classes = useToolbarStyles({direction});

   return (
      <div className={classes.heading_toolbar}>
         <div className={classes.child_toolbar1}>
            <div className={classes.child1_toolbar_left}>
               <label className={classes.h6}>{store.report_name}</label>
               <div style={{ marginLeft: '8px' }}>
                  <IconImage
                     style={{ marginRight: '8px' }}
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/refresh.svg`}
                     height={16}
                     width={16}
                     onClick={() => onRefresh('refresh')}
                  />
               </div>
            </div>
         </div>
         <div className={classes.child_toolbar2}>
            <div className={classes.child2_toolbar_right}>
               <IconsButton
                  className={classes.button}
                  type='PrintOutlinedIcon'
                  onClick={props.printHandler}
               />
               <div className={classes.deleteButton}>
                  <IconImage
                     height={16}
                     width={16}
                     url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/modify.svg`}
                  />
               </div>
            </div>
         </div>
      </div>
   )
}

export const DraggerComponent = props => {
   const classes = useStyles()
   const { selectedData = [], changeListOrder = null } = props
   return (
      <React.Fragment>
         <Paper className={classes.paperRight} elevation={0}>
            <div className={classes.app_root}>
               <Toolbar variant='dense' className={classes.toolbar}>
                  <Typography variant='h6'>
                     <b>Field Name</b>
                  </Typography>
                  <Typography variant='h6'>
                     <b>Type</b>
                  </Typography>
                  <Typography variant='h6'>
                     <b>Alias</b>
                  </Typography>
               </Toolbar>
            </div>

            <RowDragger items={selectedData} onChange={changeListOrder} />
         </Paper>
      </React.Fragment>
   )
}

{/* <Typography variant='h6'>
            <b>Report 001</b>
         </Typography> */}
// <div style={tableBodyStyle}>
//             <TableContainer>
//                <Table className={classes.table} style={tableStyles}>
//                   <TableHead>
//                      <TableRow
//                         className={classes.tableHeader}
//                         style={tableHeaderStyle}
//                      >
//                         <TableCell
//                            className={classes.borderRight}
//                            style={tableCellHeadStyle(false)}
//                            align={
//                               props.state.table_properties.header_font_alignment
//                            }
//                         >
//                            Sales Type
//                         </TableCell>
//                         <TableCell
//                            className={classes.borderRight}
//                            style={tableCellHeadStyle(false)}
//                            align={
//                               props.state.table_properties.header_font_alignment
//                            }
//                         >
//                            UK Sales
//                         </TableCell>
//                         <TableCell
//                            className={classes.borderRight}
//                            style={tableCellHeadStyle(false)}
//                            align={
//                               props.state.table_properties.header_font_alignment
//                            }
//                         >
//                            US Sales
//                         </TableCell>
//                         <TableCell
//                            className={classes.borderRight}
//                            style={tableCellHeadStyle(false)}
//                            align={
//                               props.state.table_properties.header_font_alignment
//                            }
//                         >
//                            Total Sales
//                         </TableCell>
//                         <TableCell
//                            className={classes.borderRight}
//                            style={tableCellHeadStyle(true)}
//                            align={
//                               props.state.table_properties.header_font_alignment
//                            }
//                         >
//                            Profit%
//                         </TableCell>
//                      </TableRow>
//                   </TableHead>
//                   <TableBody>
//                      {tableData.map((row, i) =>
//                         tableData.length - 1 !== i ? (
//                            <TableRow key={i} style={tableRowStyle}>
//                               <TableCell
//                                  className={classes.borderRight}
//                                  style={tableCellStyle(false, false)}
//                                  scope='row'
//                                  align={
//                                     props.state.table_properties
//                                        .row_font_alignment
//                                  }
//                               >
//                                  Direct
//                               </TableCell>
//                               <TableCell
//                                  className={classes.borderRight}
//                                  style={tableCellStyle(false, false)}
//                                  align={
//                                     props.state.table_properties
//                                        .row_font_alignment
//                                  }
//                               >
//                                  2400
//                               </TableCell>
//                               <TableCell
//                                  className={classes.borderRight}
//                                  style={tableCellStyle(false, false)}
//                                  align={
//                                     props.state.table_properties
//                                        .row_font_alignment
//                                  }
//                               >
//                                  2400
//                               </TableCell>
//                               <TableCell
//                                  className={classes.borderRight}
//                                  style={tableCellStyle(false, false)}
//                                  align={
//                                     props.state.table_properties
//                                        .row_font_alignment
//                                  }
//                               >
//                                  3000
//                               </TableCell>
//                               <TableCell
//                                  className={classes.borderRight}
//                                  style={tableCellStyle(false, true)}
//                                  align={
//                                     props.state.table_properties
//                                        .row_font_alignment
//                                  }
//                               >
//                                  28%
//                               </TableCell>
//                            </TableRow>
//                         ) : (
//                            <TableRow key={i} style={tableRowStyle}>
//                               <TableCell
//                                  className={classes.borderRight}
//                                  style={tableCellStyle(true, false)}
//                                  scope='row'
//                                  align={
//                                     props.state.table_properties
//                                        .row_font_alignment
//                                  }
//                               >
//                                  Direct
//                               </TableCell>
//                               <TableCell
//                                  className={classes.borderRight}
//                                  style={tableCellStyle(true, false)}
//                                  align={
//                                     props.state.table_properties
//                                        .row_font_alignment
//                                  }
//                               >
//                                  2400
//                               </TableCell>
//                               <TableCell
//                                  className={classes.borderRight}
//                                  style={tableCellStyle(true, false)}
//                                  align={
//                                     props.state.table_properties
//                                        .row_font_alignment
//                                  }
//                               >
//                                  2400
//                               </TableCell>
//                               <TableCell
//                                  className={classes.borderRight}
//                                  style={tableCellStyle(true, false)}
//                                  align={
//                                     props.state.table_properties
//                                        .row_font_alignment
//                                  }
//                               >
//                                  3000
//                               </TableCell>
//                               <TableCell
//                                  className={classes.borderRight}
//                                  style={tableCellStyle(true, true)}
//                                  align={
//                                     props.state.table_properties
//                                        .row_font_alignment
//                                  }
//                               >
//                                  28%
//                               </TableCell>
//                            </TableRow>
//                         )
//                      )}
//                   </TableBody>
//                </Table>
//             </TableContainer>
//          </div>