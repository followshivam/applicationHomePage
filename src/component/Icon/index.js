import React from 'react'
import { IconButton, makeStyles } from 'component'
import SearchIcon from '@material-ui/icons/Search'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import CachedIcon from '@material-ui/icons/Cached'
import LaunchIcon from '@material-ui/icons/Launch'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import GetAppSharpIcon from '@material-ui/icons/GetAppSharp'
import PrintOutlinedIcon from '@material-ui/icons/PrintOutlined'
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom'
import FilterListIcon from '@material-ui/icons/FilterList'
import Filter1Icon from '@material-ui/icons/Filter1'
import BarChartIcon from '@material-ui/icons/BarChart'
import DehazeIcon from '@material-ui/icons/Dehaze'
import CancelIcon from '@material-ui/icons/Cancel'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import CloseIcon from '@material-ui/icons/Close'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckIcon from '@material-ui/icons/Check'
import SyncAltIcon from '@material-ui/icons/SyncAlt'
import FormatAlignJustifyIcon from '@material-ui/icons/FormatAlignJustify'
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft'
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight'
import Language from '@material-ui/icons/Language'
import Settings from '@material-ui/icons/Settings'
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import PhoneAndroidIcon from '@material-ui/icons/PhoneAndroid'
import LaptopMacOutlinedIcon from '@material-ui/icons/LaptopMacOutlined'
import TabletAndroidOutlinedIcon from '@material-ui/icons/TabletAndroidOutlined'

const components = {
   SearchIcon: SearchIcon,
   AddIcon: AddIcon,
   EditIcon: EditIcon,
   DeleteIcon: DeleteIcon,
   LaunchIcon: LaunchIcon,
   CachedIcon: CachedIcon,
   ArrowBackIosIcon: ArrowBackIosIcon,
   ArrowForwardIosIcon: ArrowForwardIosIcon,
   MoreVertIcon: MoreVertIcon,
   MoreHorizIcon: MoreHorizIcon,
   ExpandMoreIcon: ExpandMoreIcon,
   LockOutlinedIcon: LockOutlinedIcon,
   GetAppSharpIcon: GetAppSharpIcon,
   PrintOutlinedIcon: PrintOutlinedIcon,
   VerticalAlignBottomIcon: VerticalAlignBottomIcon,
   FilterListIcon: FilterListIcon,
   Filter1Icon: Filter1Icon,
   BarChartIcon: BarChartIcon,
   Language: Language,
   DehazeIcon: DehazeIcon,
   CancelIcon: CancelIcon,
   AccountTreeIcon: AccountTreeIcon,
   DragIndicatorIcon: DragIndicatorIcon,
   CloseIcon: CloseIcon,
   CheckBoxIcon: CheckBoxIcon,
   CheckBoxOutlineBlankIcon: CheckBoxOutlineBlankIcon,
   CloseIcon: CloseIcon,
   CheckIcon: CheckIcon,
   FormatAlignJustifyIcon: FormatAlignJustifyIcon,
   FormatAlignLeftIcon: FormatAlignLeftIcon,
   FormatAlignRightIcon: FormatAlignRightIcon,
   SyncAltIcon: SyncAltIcon,
   Settings: Settings,
   RefreshOutlinedIcon: RefreshOutlinedIcon,
   ArrowBackIcon: ArrowBackIcon,
   PhoneAndroidIcon: PhoneAndroidIcon,
   LaptopMacOutlinedIcon,
   TabletAndroidOutlinedIcon
}

const useStyles = makeStyles(theme => ({
   selected: {
      //  border:"1px solid grey",
      borderRadius: 1
   }
}))

export const IconsButton = ({
   type,
   disabled = false,
   color = '',
   ...rest
}) => {
   const TagName =
      components[type] == null ? components['AddIcon'] : components[type]
   return (
      <IconButton disabled={disabled} color={color}>
         <TagName disabled={disabled} {...rest} />
      </IconButton>
   )
}
export const IconImage = ({
   url,
   width = 15,
   height = 10,
   disabled = false,
   selected = false,
   ...rest
}) => {
   const classes = useStyles()
   return (
      <IconButton
         disabled={disabled}
         {...rest}
         classes={{ root: selected ? classes.selected : '' }}
         style={{ backgroundColor: selected ? '#ffffff' : '', ...rest?.style }}
      >
         <img src={`${url}`} width={width} height={height} />
      </IconButton>
   )
}
