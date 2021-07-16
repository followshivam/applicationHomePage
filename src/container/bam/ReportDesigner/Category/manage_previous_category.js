import React, { useEffect, useState } from "react";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { Divider, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Spinner, Typography, DialogActions, Button } from "component";
import { GetCategoryList } from "global/bam/api/ApiMethods";
const ManagePrevious = props => {

  const { t } = props

  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, setIsLoading] = useState({ msg: "", loading: true });
  const { loading, msg } = isLoading;
  useEffect(() => {
    getCategoryList();
  }, []);
  const getCategoryList = () => {
    GetCategoryList({ screenid: "ManageCategory" })
      .then(res => {
        let response = res.data
        if (response != null && res.status.maincode === "0") {
          setCategoryList(response.category)
          setTimeout(() => setIsLoading({ ...isLoading, loading: false }), 100);
        }
      })
      .catch(err => { });
  }
  return <div>
    <Typography variant="subtitle1">{t('bam:CATEGORY_LIST')}:</Typography>
    <Divider fullWidth />
    {isLoading.loading ? (
      <div style={{ height: "200px" }}>
        <Spinner msg={msg} />
      </div>
    ) : <Table>
        <TableHead>
          <TableCell width="30%">{t('bam:CATEGORY_NAME')}</TableCell>
          <TableCell width="65%">{t('bam:DESCRIPTION')}</TableCell>
          <TableCell width="5%"></TableCell>
        </TableHead>
        <TableBody>
          {categoryList.map((res, key) => (
            <TableRow key={key}>
              <TableCell>{res.category_name}</TableCell>
              <TableCell>{res.description}</TableCell>
              <TableCell><DeleteOutlineIcon onClick={() => props.action({ opr: 2, category_index: res.category_index })} /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>}

  </div >
}
export default ManagePrevious