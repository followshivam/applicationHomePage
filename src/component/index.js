import { lighten, makeStyles, withStyles } from '@material-ui/core/styles';
import fade from "@material-ui/core/Fade";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import FilterListIcon from "@material-ui/icons/FilterList";
import { TextField, Grid } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputBase from '@material-ui/core/InputBase';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import Radio from '@material-ui/core/Radio';
import SimpleCard from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import { InputBox, TextArea, CardRadioButton, SelectBox, SelectBox1, TemplateSelectBox, PickList, AssociatedPickList, PickListTable, MultiSelectBox } from './Form';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Input from "@material-ui/core/Input";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TableChartIcon from '@material-ui/icons/TableChart';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AppBar from '@material-ui/core/AppBar';
import Fab from '@material-ui/core/Fab';
import Slide from '@material-ui/core/Slide';
// import PickList from './PickList';
import Dropdown from './DropDown';
import DropdownFilter from './DropDownFilter';
import Header from './Header';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import { FixedFooter } from './Footer';
import { Spinner, IconLoader } from './Loader';
import Drawer, { CustomDrawer } from './Drawer';
import SearchBox from './GenericComponet/SearchBox';
import { IconImage, IconsButton } from './Icon';
import Wizard from './Wizard';
import Card from './Card';
import DynamicTable from "./DynamicTable";
import ExpandableFooter from "./ExpandableFooter";
import FullScreenDialog from "./FullScreenDialog";
import Sidebar from "./Sidebar";
import { SimplePopover, StyledTooltip } from "./Popover";
import Pagination from "./Pagination";
import CloseIcon from "@material-ui/icons/Close"

import Snackbar from '@material-ui/core/Snackbar';
import { Alert, AlertBox } from "./Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import CustomDialog from "./CustomDialog";
import { Dialog } from "@material-ui/core";
import Confirmation from "./Confirmation"
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import Select from "@material-ui/core/Select";
import NotFound from "./NotFound";
import RecentActivity from "./GenericComponet/RecentActivity";
import CustomDialogBox from "./GenericComponet/CustomDialog";
//added on 04-12-2020
import CardMedia from '@material-ui/core/CardMedia'
import { DialogTitle } from "@material-ui/core";
import DialogContent from '@material-ui/core/DialogContent';

//added on 09-12-2020
import CardHeader from '@material-ui/core/CardHeader'
import { FormGroup } from "@material-ui/core";
import DialogActions from '@material-ui/core/DialogActions'
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
//added on 16th Dec, 2020.
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SketchPicker } from "react-color";
import NotInterestedRoundedIcon from '@material-ui/icons/NotInterestedRounded';
import ColorPicker from "component/ColorPicker/colorPicker"
import AddIcon from '@material-ui/icons/Add'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import EnhancedTable from "component/EnhancedTableToolbar";
import TableComponent from 'component/Table';
import StyledTab from './StyledTabs'
import DynamicStyledTab from './DynamicStyledTab'
import MainHeader from './MainHeader'
import DynamicSidebar from "./DynamicSidebar";
import FrameCreator from "./FrameCreator";
import RecentTable from "./RecentTable";
import DashboardTile from './GenericComponet/DashboardTiles';
import { DatePickers } from 'component/GenericComponet/DatePickers'
import Pinned from './GenericComponet/Pinned';
import EmptyHome from "./EmptyHome"

// locale import
import { useTranslation } from 'react-i18next'

export {
    useTheme, useMediaQuery, EnhancedTable, AddIcon, DeleteOutlinedIcon, StyledTab, Autocomplete, SelectBox1,
    ColorPicker, SketchPicker, DynamicSidebar, CardHeader, CardMedia, MainHeader, NotInterestedRoundedIcon, DialogActions,
    FormGroup, DialogTitle, DialogContent, ArrowBackIos, ArrowForwardIos, Select, MuiDialogTitle, MuiDialogActions, MuiDialogContent, CloseIcon, Dialog,
    CustomDialog, InputBox, Button, IconLoader, DatePickers, PickList, Dropdown, DropdownFilter, Snackbar, DynamicStyledTab, Confirmation, MuiAlert,
    Header, AlertBox, Alert, List, ListItemSecondaryAction,ListSubheader, ListItem, ListItemText, FixedFooter, Spinner, TextArea, Drawer, lighten, makeStyles, Table,
    TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, FrameCreator, Toolbar, Typography, Paper, Checkbox,
    IconButton, Tooltip, fade, CircularProgress, Wizard, ListItemIcon, Container, CssBaseline, TextareaAutosize, Radio, RadioGroup, FormControl, FormLabel,
    CardRadioButton, Slide, SelectBox, IconImage, Popover, SimplePopover, Pagination, CustomDrawer,
    ExpandMoreIcon, AppBar, Sidebar, Fab, AccordionSummary, TableChartIcon, AccordionDetails, Accordion, clsx, Divider, Card, SimpleCard, ExpandableFooter,
    DeleteOutlineIcon, Input, Tab, Tabs, withStyles, DynamicTable, NotFound, FormHelperText, InputLabel, FullScreenDialog, AssociatedPickList, PickListTable, useTranslation,
    CardActions, CardContent, TableComponent, TemplateSelectBox, FormControlLabel, Switch, FilterListIcon, TextField, Grid, AccountCircle, InputAdornment,
    SearchBox, IconsButton, InputBase, MenuItem, Menu, MultiSelectBox, DashboardTile, StyledTooltip, RecentActivity, RecentTable,Pinned,
    CustomDialogBox, EmptyHome 

}

// export {InputBox as default } from './Form';