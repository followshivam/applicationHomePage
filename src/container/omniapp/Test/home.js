import React from "react";
import {
    makeStyles, IconImage,
    Dropdown, Typography, useTranslation, TableComponent, InputBox, Checkbox
} from "component";
import { useSelector } from "react-redux";


const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        display: "flex",
        flexDirection: "column"
    },
    container: {
        height: "750px", width: "320px", top: 0,
        display: "flex", justifyContent: "center",
        alignItems: "center", background: "white",
        fontSize: "27px", position: "fixed", right: 0
    },

}));


const Home = props => {
    const classes = useStyles();
    const [globalSetting] = useSelector(state => {
        return [state.globalSettings];
    });
    const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"]);
    const tile_data = [
        {
            title: "209",
            description: { label: 'Health', value: 'Good' },
            img_info: {
                background_color: "#0d6f0829",
                url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_good.svg`,
            },
            hover_border_color: "#0d6f0880"
        },
        {
            title: 107,
            description: { label: 'Health', value: 'Average' },
            img_info: {
                background_color: "#0072c629",
                url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_average.svg`,
            },
            hover_border_color: "#0072C666"
        },
        {
            title: 10,
            description: { value: 'Critical', subLabel: "Pending" },
            img_info: {
                background_color: "#d53d3d26",
                url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/report_critical.svg`,
            },
            hover_border_color: '#d53d3d80'
        },
        {
            title: 12,
            description: { label: '', value: 'Blocked' },
            img_info: {
                background_color: "#d53d3d26",
                url: `${process.env.REACT_APP_CONTEXT_PATH}/icons/blocked.svg`,
            },
            hover_border_color: '#d53d3d80'
        }
    ];

    const RecentHeadCells = [
        {
            category: `${t('bam:NAME')}`,
            component: (item) =>
                <div style={{ display: "flex", flexWrap: "wrap", height: "45px", padding: t('bam:HTML_DIR') === 'rtl' ? '0 0 0 20px' : '0 20px 0 0' }}>
                    <Typography variant="subtitle1" noWrap={true}>
                        {item.name}
                        <Typography variant="subtitle1" noWrap={true} style={{ fontSize: "11px", color: "#606060" }}>
                            {item.version}  {item.type}
                        </Typography>
                    </Typography>
                </div>
        },


        {
            category: `${t('bam:STATUS')}`,
            component: (item) => <div>
                <div style={{ display: "flex" }}>
                    {(item.status === 'Good' || item.status === 'Enable') ?
                        <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/good.svg`} height={10} />
                        : (item.status === 'Running') ? <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/running.svg`} height={10} />
                            : <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/block.svg`} height={10} />}
                    <Typography variant="subtitle1" noWrap={true} style={{ fontSize: "11px", color: "#606060", marginLeft: "2px" }}>
                        {item.status}
                    </Typography>
                </div>
                <Typography variant="subtitle1" noWrap={true} style={{ fontSize: "11px", color: "#606060", marginLeft: "2px" }}>
                    {(item.status === 'Running') ? `Next Run:` : `Average Time :`} {item.average_time}
                </Typography>
            </div>
        },


        {
            category: `Last opened on`,
            component: (item) => <div>
                <Typography variant="subtitle1" noWrap={true} >
                    {item.last_opened || item.last_modified}
                    <Typography variant="subtitle1" noWrap={true} style={{ fontSize: "11px", color: "#606060", marginLeft: "2px" }}>
                        Edited by {item.user} at {item.time}
                    </Typography>
                </Typography>
            </div>
        },

        {
            category: ``,
            type: `action`,
            component: (item) =>
                <div style={{ display: "flex", width: "100px", flexWrap: "wrap" }}>
                    <div style={{ marginRight: "8px" }}> <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/launch.svg`} height={17} width={17} onClick={() => console.log("2")} /> </div>
                    <div style={{ marginRight: "8px" }}>  <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/home_edit.svg`} height={17} width={17} onClick={() => console.log("1")} /> </div>
                    <div style={{ marginRight: "8px" }}>  <Dropdown type="icons" endIcon="MoreHorizIcon" list={[
                        { id: 1, value: "Show Query", label: `Show Query`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg` },
                        { id: 2, value: "Exports", label: `Exports`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg` },
                        { id: 3, value: "Trends", label: `Trends`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/trends.svg` }
                    ]} />
                    </div>
                </div>
        },
    ];

    const HHeadCells = [
        {
            category: `${t('bam:NAME')}`,
            component: (item) =>
                <div style={{ display: "flex", flexWrap: "wrap", height: "45px", padding: t('bam:HTML_DIR') === 'rtl' ? '0 0 0 20px' : '0 20px 0 0' }}>
                    <Typography variant="subtitle1" noWrap={true}>
                        {item.name}
                        <Typography variant="subtitle1" noWrap={true} style={{ fontSize: "11px", color: "#606060" }}>
                            {item.version}  {item.type}
                        </Typography>
                    </Typography>
                </div>
        },


        {
            category: `${t('bam:STATUS')}`,
            component: (item) => <div>
                <div style={{ display: "flex" }}>
                    {(item.status === 'Good' || item.status === 'Enable') ?
                        <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/good.svg`} height={10} />
                        : (item.status === 'Running') ? <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/running.svg`} height={10} />
                            : <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/block.svg`} height={10} />}
                    <Typography variant="subtitle1" noWrap={true} style={{ fontSize: "11px", color: "#606060", marginLeft: "2px" }}>
                        {item.status}
                    </Typography>
                </div>
                <Typography variant="subtitle1" noWrap={true} style={{ fontSize: "11px", color: "#606060", marginLeft: "2px" }}>
                    {(item.status === 'Running') ? `Next Run:` : `Average Time :`} {item.average_time}
                </Typography>
            </div>
        },


        {
            category: `Last opened on`,
            component: (item) => <div>
                <Typography variant="subtitle1" noWrap={true} >
                    {item.last_opened || item.last_modified}
                    <Typography variant="subtitle1" noWrap={true} style={{ fontSize: "11px", color: "#606060", marginLeft: "2px" }}>
                        Edited by {item.user} at {item.time}
                    </Typography>
                </Typography>
            </div>
        },

        {
            category: ``,
            type: `action`,
            component: (item) =>
                <div style={{ display: "flex", width: "100px", flexWrap: "wrap" }}>
                    <div style={{ marginRight: "8px" }}> <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pinned.svg`} height={17} width={17} onClick={() => console.log("2")} /> </div>
                    <div style={{ marginRight: "8px" }}> <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/launch.svg`} height={17} width={17} onClick={() => console.log("2")} /> </div>
                    <div style={{ marginRight: "8px" }}>  <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/home_edit.svg`} height={17} width={17} onClick={() => console.log("1")} /> </div>
                    <div style={{ marginRight: "8px" }}>  <Dropdown type="icons" endIcon="MoreHorizIcon" list={[
                        { id: 1, value: "Show Query", label: `Show Query`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg` },
                        { id: 2, value: "Exports", label: `Exports`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg` },
                        { id: 3, value: "Trends", label: `Trends`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/trends.svg` }
                    ]} />
                    </div>
                </div>
        },
    ];

    const eadCells = [
        {
            id: "report_name",
            sort_id: "report_name",
            numeric: false,
            disable_padding: true,
            sort: false,
            className: "",
            // onClick: (res) => { window.open(`/oapweb/bam/generate/${res.report_index}`, "_blank", "top=400,left=400,width=850,height=590") },
            label: `${t('bam:REPORT_NAME')}`,
            typographyProps: { className: classes.title }
        },
        {
            id: "description",
            sort_id: "description",
            numeric: false,
            disable_padding: false,
            status: false,
            sort: false,
            label: `${t('bam:DESCRIPTION')}`
        },
        {
            id: "",
            sort_id: "average_execution_time",
            numeric: true,
            disable_padding: true,
            status: false,
            sort: false,
            label: `${t('bam:AVERAGE_TIME')}`
        },
        {
            id: "",
            numeric: false,
            sort: false,
            status: false,
            disablePadding: false,
            label: `${t('bam:HEALTH_STATUS')}`
        },


    ];
    const Action = [
        {
            component: () =>
                <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "8px" }}> <IconImage url={`${process.env.REACT_APP_CONTEXT_PATH}/icons/pinned.svg`} height={17} width={17} onClick={() => console.log("pin clicked")} /> </div>
                    <div >  <Dropdown type="icons" endIcon="MoreHorizIcon" list={[
                        { id: 1, value: "Demo Data", label: `Demo Data`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg` },
                        { id: 2, value: "Demo Data", label: `Demo Data`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg` },
                    ]} />
                    </div>
                </div>
        },
    ];

    const headCells = [
        {
            id: "title_1",  //   name fetching from API data
            numeric: false,
            disablePadding: true,
            label: "Title 1",  // label of head
            align: "left"  
        },
        {
            id: "title_2",
            numeric: false,
            disablePadding: true,
            label: "Title 2",
            align: "left"
        },
        {
            id: "title_3",
            numeric: true,
            disablePadding: true,
            label: "Title 3",
            align: "left"
        },

        {
            id: "title_x",
            numeric: true,
            disablePadding: true,
            label: "Title x",
            align: "left"
        },
        {
            id: "title_x",
            numeric: true,
            disablePadding: true,
            label: "Title x",
            align: "left"
        },
        {
            id: "title_x",
            numeric: true,
            disablePadding: true,
            label: "Title x",
            align: "left"
        },
        {
            id: "title_x",
            numeric: true,
            disablePadding: true,
            label: "Title x",
            align: "left"
        },
        {
            id: "title_x",
            numeric: true,
            disablePadding: true,
            label: "Title x",
            align: "left"
        },
        
        {
            id: "",  // to pass compinent id should be blank
            component: (res) => { return (<InputBox form={true} />) },  // can pass any component
            numeric: false,
            disablePadding: true,
            label: "Input Box",
            align: "center"
        },
        {
            id: "",
            component: (res) => { return (<Checkbox />) },
            numeric: false,
            disablePadding: true,
            label: "Checkbox",
            align: "center"
        },
        {
            id: "",
            component: (res) => { return (
                <Dropdown type="icons" endIcon="MoreHorizIcon" list={[
                    { id: 1, value: "Demo Data", label: `Demo Data`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/show_query.svg` },
                    { id: 2, value: "Demo Data", label: `Demo Data`, "startIcon": `${process.env.REACT_APP_CONTEXT_PATH}/icons/grey_export.svg` },
                ]} />
            ) },
            numeric: false,
            disablePadding: true,
            label: "",
            align: "center"
        }
    ];


    const tableData =
        [
            {
                title_1: "Test",
                title_2: "XYZ",
                title_3: "5451",
                title_x: "No Component is available. Would you like to create new component?",
            },
            {
                title_1: "Test",
                title_2: "XYZ",
                title_3: "5451",
                title_x: "46456",
            },
            {
                title_1: "Test",
                title_2: "XYZ",
                title_3: "5451",
                title_x: "46456",
            },
            {
                title_1: "Test",
                title_2: "XYZ",
                title_3: "5451",
                title_x: "46456",
            },
            {
                title_1: "Test",
                title_2: "XYZ",
                title_3: "5451",
                title_x: "46456",
            },
            {
                title_1: "Test",
                title_2: "XYZ",
                title_3: "5451",
                title_x: "46456",
            },
            {
                title_1: "Test",
                title_2: "XYZ",
                title_3: "5451",
                title_x: "46456",
            },
            {
                title_1: "Test",
                title_2: "XYZ",
                title_3: "5451",
                title_x: "46456",
            },
            {
                title_1: "Test",
                title_2: "XYZ",
                title_3: "5451",
                title_x: "46456",
            },
           
        ]
const checkBoxHandler=()=>{
    console.log("jj")
}
    return (
        <div className={classes.root}>
            {
                <TableComponent
                    tableData={tableData}
                    headerData={headCells}
                    loading={false}
                    multiLine={false}
                    minWidth={"200px"}
                    selectType={'img'}   //checkbox , Radio
                    disableFirstCell={false}
                    onChangeCheckbox={checkBoxHandler} // if select type is checkbox/radio
                    headerColor={'#fff'}
                    direction=   {`${t('bam:HTML_DIR')}`}
                    imageInfo={{
                        path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
                        ext: '.svg',
                        img_type: 'report'
                    }}
                    notFound={{
                        iconUrl: 'icons/info.svg',
                        messageColor: '#828282',
                        messageFontSize: '12px',
                        backgroundColor: 'white',
                        iconSize: 30,
                        message: `${t('omniapp:NO_COMPONENT_AVAILABLE')}`
                     }}
                    action={[
                        {
                            action_type: 'icon',
                            icon_url: 'icons/trash_2.svg',
                            height: '15',
                            onClick: null
                        },
                        {
                            action_type: 'icon',
                            icon_url: 'icons/audit.svg',
                            height: '15',
                            onClick: () => { console.log("hi") }
                        },
                        {
                            action_type: 'icon',
                            icon_url: 'icons/edit.svg',
                            height: '15',

                        }

                    ]}
                />
            }
        </div>
    );
};
export default Home;