import React, { useState, useEffect, Fragment } from 'react'

import { SelectBox, Spinner, makeStyles, Button } from 'component'

import { GetTableData } from 'global/bam/api/ApiMethods'

const useStyles = makeStyles(theme => ({
   report_container: {
      height: 290,
      background: theme.palette.backgroundContainer,
      padding: '0px 20px'
   },
   select_box: {
      width: '459px'
   }
}))

const FromTable = props => {
   const classes = useStyles()
   const [isLoading, setIsLoading] = useState({ msg: '', loading: true })
   const [reportData, setReportData] = useState([])
   const { loading, msg } = isLoading
   const [enableNext, setEnableNext] = useState(false)
   const [tableInput, setTableInput] = useState({
      opr: '1',
      opt: 0,
      sort_order: 'A',
      last_value: '',
      last_index: '',
      prefix: '',
      batch_size: 20,
      column_name: '',
      table_name: ''
   })

   useEffect(() => {
      getTableData()
   }, [tableInput])

   const getTableData = () => {
      setIsLoading({ ...isLoading, loading: true })
      GetTableData(tableInput)
         .then(response => {
            if (response != null) {
               let tableList = reportData.concat(response.data.tables)
               setReportData(tableList)
               setEnableNext(response.data.enable_next)
               setTimeout(
                  () => setIsLoading({ ...isLoading, loading: false }),
                  500
               )
            }
         })
         .catch(err => { })
   }

   const [columnData, setColumnData] = useState([])

   const changeHandler = res => {
      setColumnData([])
      GetTableData({
         opr: '2',
         opt: 0,
         sort_order: 'A',
         last_value: '',
         last_index: '',
         prefix: '',
         batch_size: 20,
         column_name: '',
         table_name: res.target.value
      })
         .then(response => {
            if (response != null) {
               setColumnData(response.data.fields)
            }
         })
         .catch(err => { })
   }

   return (
      <Fragment>
         {loading ? (
            <div style={{ height: 290 }}>
               <Spinner />
            </div>
         ) : (
            <div className={classes.report_container}>
               <div style={{ paddingTop: '10px' }}>
                  <SelectBox
                     type='custom'
                     label='Select Table'
                     className={classes.select_box}
                     name='field_type'
                     onChangeHandler={
                        changeHandler
                        // () =>
                        // setTableInput({ ...tableInput, opt: 1 })
                     }
                  >
                     {reportData.map((res, key) => (
                        <>
                           <option key={key} value={res.table_name}>
                              {res.table_name}
                           </option>
                        </>
                     ))}
                     {/* {enableNext ? <option>show more</option> : null} */}
                  </SelectBox>
               </div>
               <div style={{ paddingTop: '10px' }}>
                  <SelectBox
                     type='custom'
                     label='Select Column'
                     className={classes.select_box}
                     name='field_type'
                     disabled={columnData.length < 1}
                  >
                     {columnData.map((res, key) => (
                        <>
                           <option key={key} value={res.name}>
                              {res.name}
                           </option>
                        </>
                     ))}
                  </SelectBox>
               </div>
            </div>
         )}
      </Fragment>
   )
}

export default FromTable
