import moment from "moment";

export const GetReportListInput = {
  category_id: 0,
  category: "GR",
  filter: "",
  opr: "0",
  last_index: "",
  last_name: "",
  type: "Design",
  last_blockedstatus: "",
  hide_blocked: false,
  showblocked_top: false,
  healthstatus_code: "0"
};

export const template_data = {
  id: "0",
  name: "workitem Dashboard",
  column_count: "4",
  row_count: "4",
  row_heights: [
    "150px", "200px", "200px", "200px"
  ],
  template_def: [
    {
      colspan: "3",
      rowspan: "1",
      colStart: "1",
      rowStart: "1",
      container_id: "1"
    },
    {
      colspan: "1",
      rowspan: "4",
      colStart: "4",
      rowStart: "1",
      container_id: "2"
    },
    {
      colspan: "3",
      rowspan: "3",
      colStart: "1",
      rowStart: "2",
      container_id: "3"
    }
  ],
  components: {
    "1": {
      "id": "18",
      "name": "Criteria Widget",
      "load_url": "criteria_mgmt",
      "c_input_info": {
      },
      "c_load_json": {
        "app_context": "wd-web",
        "app_Domain": "",
        "app_id": "2",
        "app_loc": "1",
        "app_name": "MDM",
        "app_port": "",
        "app_ssl": false,
        "custom_js": "",
        "ins_type": "1",
        "refresh": true
      }
    },
    "2": {
      "id": "18",
      "name": "Search Box",
      "load_url": "WD_SearchBox",
      "c_input_info": {
      },
      "c_load_json": {
        "app_context": "wd-web",
        "app_Domain": "",
        "app_id": "2",
        "app_loc": "1",
        "app_name": "MDM",
        "app_port": "",
        "app_ssl": false,
        "custom_js": "",
        "ins_type": "1",
        "refresh": true
      }
    },
    "3": {
      "id": "18",
      "name": "Work Item List",
      "load_url": "WD_WorkItemList",
      "c_input_info": {
      },
      "c_load_json": {
        "app_context": "wd-web",
        "app_Domain": "",
        "app_id": "2",
        "app_loc": "1",
        "app_name": "MDM",
        "app_port": "",
        "app_ssl": false,
        "custom_js": "",
        "ins_type": "1",
        "refresh": true
      }
    }
  }
};
export const GetDashboardInput = {
  user_id: "3",
  type: "LIST",
  all: "Y",
  node_id: ""
};
export const AddTabInput = {
  opr: "1",
  group_id: "",
  user_id: "",
  tab_name: "",
  template_id: "",
  togglable: "N",
  dashboard_id: "",
  tab_id: "",
  tab_name: "",
  radio: "Manual assignment"
};
export const AddDashboardInput = {

  opr: "0",
  group_id: "",
  dashboard_name: "",
  user_id: "",
  tab_name: "",
  template_id: "",
  togglable: "N",
  dashboard_id: "",
  contoller_id: ""
};
export const GetDownloadInput = {
  act: "7",
  sub_action: "0",
  report_index: "",
  type: "T",
  current_type: "T",
  order_by: "",
  sort_order: "D",
  batch_info: {
    order_by: "0",
    batch_size: "5",
    batch_val: {
      field: []
    }
  },
  save_flag: "Y",
  save_format: "PDF",
  buffer: "",
  param_info: {
    params: [

    ]
  }
};
export const GetTemplateInput = {
  template_id: 0,
};
export const UserPreferenceListInput = {
  opr: "0",
  user_id: "",
  home_tab_id: "",
  tab_switch_interval: "",
  alerts_refresh_interval: "",
  batch_size: "",
  default_dashboard: "0",
  is_tab_switch: "",
  refresh_interval: ""
};
export const GetTabInput = {
  user_id: "",
  group_id: "0"
};
export const FieldsInput = [
  {
    field_type: "",
    name: "username",
    display_name: "username",
    type: "16",
    length: "64",
    min_char_length: "",
    pdf_col_length: "",
    show_total: "false",
    hidden_flag: "false",
    link_flag: "false",
    sort_flag: false,
    sort_order: ""
  },
  {
    field_type: "",
    name: "userindex",
    display_name: "userindex",
    type: "4",
    length: "11",
    min_char_length: "",
    pdf_col_length: "",
    show_total: "false",
    hidden_flag: "false",
    link_flag: "false",
    sort_flag: false,
    sort_order: ""
  }
];

export const PicklistInputJson = {
  opr: "0",
  column_name: "",
  table_name: "",
  type: "8",
  prefix: "",
  data_flag: "Y",
  sort_order: "A",
  batch_size: "50",
  last_value: "",
};
export const UserListInput = {
  opr: "0",
  zip_buffer: "N",
  group_index: "4",
  order_by: "2",
  sort_order: "A",
  last_sort_field: "",
  previous_index: "0",
  prefix: "",
  last_value: "",
  last_name: "",
  no_of_records_to_fetch: "5"
};
export const report_input_field_structure = {
  display_name: 'Id',
  name: '',
  description: '',
  show_default_in_output: true,
  hide_from_output: false,
  hidden_flag: true,
  custom_picklist_flag: false,
  all_option: true,
  null_option: true,
  not_null_option: false,
  multi_selection: false,
  in_type_input: false,
  auto_gen: false,
  delimited: false,
  delimiter: '"',
  all_label: '',
  null_label: '',
  not_null_label: '',
  custom_picklist_def: {
    // assoc_report_id: '46',
    // picklist_height: '',
    // picklist_width: '',
    // show_header: false,
    // show_filter: false,
    // picklist_input_mapping: [],
    // picklist_output_mapping: [
    //    {
    //       picklist_input_field: 'Id',
    //       mapped_field_display: 'userindex',
    //       mapped_field_name: 'userindex'
    //    }
    // ]
  },
  default_value: '',
  mandatory: false,
  default_display: true,
  read_only_input: false,
  type: '8',
  length: ''
};

export const ruleJson = {
  "rule_id": "",
  "rule_name": "",
  "rule_operation": "I",
  "rule_order": "1",
  "rule_enabled": true,
  "rule_conditions": [
    //   {
    //   "opening_brace": false,
    //   "operand1": {
    //     "name": "",
    //     "type": "",
    //     "length": "11"
    //   },
    //   "operator": "",
    //   "operand2": {
    //     "value": "",
    //     "type": "K"
    //   },
    //   "closing_brace": false,
    //   "logical_op": "0"
    // }
  ],
  "tabular": {
    "custom_style": "",
    "enabled": true,
    "style_type": "D",
    "field_name": "",
    "label_color": "",
    "do_color_complete_cell": false,
    "color_complete_cell": "",
    "do_color_complete_row": false,
    "color_complete_row": ""
  },
  "graphical": {
    "custom_style": "",
    "enabled": true,
    "style_type": "D",
    "field_name": "",
    "label_color": "",
    "do_color_complete_area": false,
    "color_complete_area": ""
  },
  "alert": {
    "enabled": true,
    "mail_id": "",
    "user": [],
    "group": []
  }
}

export const ruleConditionJson = {
  "opening_brace": false,
  "operand1": {
    "name": "",
    "type": "",
    "length": ""
  },
  "operator": "",
  "operand2": {
    "value": "",
    "type": ""
  },
  "closing_brace": false,
  "logical_op": ""
}
export const ReportInputPropertiesJson = {
  display_name: "Id",
  name: "Custom Picklist",
  description: "",
  show_default_in_output: "Y",
  hide_from_output: "N",
  hidden_flag: "N",
  custom_picklist_flag: "Y",
  all_option: "N",
  null_option: "N",
  not_null_option: "N",
  multi_selection: "N",
  in_type_input: "N",
  auto_gen: "Y",
  delimited: "N",
  delimiter: '"',
  all_label: "",
  null_label: "",
  not_null_label: "",
  custom_picklist_def: {
    assoc_report_id: "46",
    picklist_height: "",
    picklist_width: "",
    show_header: false,
    show_filter: false,
    picklist_input_mapping: [],
    picklist_output_mapping: [
      {
        picklist_input_field: "Id",
        mapped_field_display: "userindex",
        mapped_field_name: "userindex"
      }
    ]
  },
  default_value: "",
  manadatory: "N",
  default_display: "N",
  read_only_input: "N",
  type: "8",
  length: ""
};
export const GetSchedulerListInput = {
  opr: "0",
  report_id: "",
  scheduler_type: "RS",
  sort_order: "A",
  last_index: "",
  last_value: "",
  prefix: "",
  status: "0"
};
export const ReportGenerateJson = {
  act: "0",
  sub_action: "0",
  report_index: "",
  type: "T",
  current_type: "T",
  order_by: "",
  sort_order: "D",
  batching_req: "Y",
  batch_info: {
    order_by: "0",
    batch_size: "15",
    batch_val: {
      field: []
    }
  },
  new_sort_field: "",
  new_sort_order: "A",
  save_flag: "N",
  save_format: "HTML",
  buffer: "",
  param_info: {}
};

export const ReportDefinitionInput = {
  option: "2",
  report_index: "",
  previous_annotation_index: "0",
  no_of_records_to_fetch: "100",
  sort_order: "D"
};
export const InputPropertiesJson = {
  hidden: false,
  custom_picklist: true,
  associated_picklist: {},
  input_type: 0,
  default_value: 0,
  alias: "",
  advanced_options: {
    show_all_options: false,
    show_all_options_label: "",
    null_label: false,
    null_label_value: "",
    multiple_selection: false,
    multiple_values: false,
    show_default: false,
    hide_from_output: false,
    mandatory: false,
    disable_manual_output: false
  }
};

export const ChartProperties = {
  chart_title: 'Chart',
  chart_title_color: '#000000',
  chart_type: 'line',
  // added by rishu.trivedi@newgen.co.in
  is_stacked: false,
  chart_title_font_family: 'Open Sans',
  chart_title_font_family_variant: '400',
  chart_title_font_size: '14',
  chart_title_font_alignment: 'center',
  chart_width: '',
  chart_height: '',

  legend_background_color: 'red',
  legend_font_family: 'Open Sans',
  legend_font_family_variant: '400',
  legend_font_size: '14',
  legend_font_alignment: 'center',

  show_values: 'H', // H->Hover, C-> Cumulitive, B -> Both hover and cumulitive
  show_values_position: 'bottom',
  show_values_bg_color: '',
  show_values_font_family: 'Open Sans',
  show_values_font_family_variant: '400',
  show_values_font_size: '12',
  show_values_font_alignment: 'center',
  show_values_font_color: '',

  axis_label_font_family: 'Open Sans',
  axis_label_font_family_variant: '400',
  axis_label_font_size: '12',
  axis_label_font_color: '#000000',
  axis_label_font_alignment: 'center',

  label_sub_x_axis: '',
  label_sub_y_axis: '',
  label_sub_x_axis_slant: true,
  label_sub_x_axis_slant_value: '45',
  label_sub_y_axis_slant: false,
  label_sub_y_axis_slant_value: '',

  sub_axis_label_font_family: '',
  sub_axis_label_font_family_variant: '',
  sub_axis_label_font_size: '',
  sub_axis_label_font_color: '#000000',

  show_x_grid: false,
  show_y_grid: false,

  // till here
  label_x_axis: 'X-Axis',
  label_y_axis: 'Y-Axis',
  key_field: "",
  bg_color: '#FFFFFF',
  x_label_color: '#000000',
  x_label_font_size: '0',
  y_label_color: '#000000',
  y_label_font_size: '0',
  x_tick_color: '#000000',
  x_tick_font_size: '',
  y_tick_color: '#000000',
  y_tick_font_size: '0',
  marker_range_value: '',
  marker_color: '',
  marker_label: '',
  marker_label_color: '#000000',
  chart_l_range_bound: '',
  chart_def_width: '',
  char_def_height: '',
  legend_position: 'bottom',
  upper_range: '',
  show_grid: false,
  show_legend: false,
  chart_orientation: 'vertical',
  is_3d: false,
  chart_display_fields: []
};
export const TableProperties = {
  table_border_type: "oulined",
  table_border_color: "#000000",
  table_background_color: "#ffffff",
  show_column_outline: "N",
  column_outline_color: "#000000",
  show_row_outline: "N",
  row_outline_color: "#000000",
  header_background_color: "#f8f8f8",
  header_font_family: "Open Sans",
  header_font_family_variant: "400",
  header_font_family_size: "12",
  header_font_color: "#000000",
  header_font_alignment: "left",
  dual_row_color: "N",
  row_background_color: "#ffffff",
  row_font_family: "Open Sans",
  row_font_family_variant: "400",
  row_font_size: "12",
  row_font_alignment: "left",
  row_font_color: "#000000"
};

export const CreateUpdateReportInput = {
  custom_report: {
    report_id: "",
    rpt_category_index: '-1',
    rpt_category_name: 'General',
    rpt_category_type: 'GR',
    report_name: '',
    report_description: '',
    validate_query_flag: true,
    batching_required: false,
    batch_size: '10',
    output_format: 'HTML',
    show_serial_no: true,
    enable_sorting: true,
    save_batch_wise: false,
    extra_graphical_field_flag: false,
    table_list: [],
    joined_list: [],
    report_report_query_type: 'F',
    // report_constraints: {
    //   report_availability: true,
    //   report_view: true,
    //   report_download: false
    // },
    "report_availabilty_constraint": {
      "report_available": false,
      "from_time": "00:00",
      "to_time": "0:00"
    },
    "report_view_constraint": {
      "report_view": false,
      "report_delay_interval": ""
    },
    "report_download_constraint": {
      "report_download": false,
      "report_download_interval": "0"
    },
    field: [],
    output_fields: {
      field: []
    },

    ////batch mapping
    proc_batching_info: {
      key_field_info: [],
      sort_field: '',
      sort_order: 'A'
    },

    report_input_fields: {
      field: []
    },
    report_sort_on: {
      field: []
    },
    report_group_by: {
      field: []
    },
    batch_key_fields: {
      field: []
    },
    filter: [],
    complex_query: '',
    execution_type: 'Q',
    report_display_type: 'TG',
    matrix_properties: '',
    blocked: false,
    creation_date_time: '2020-12-21 15:14:41.14',
    staging_cabinet: false,
    execute_rules: true,
    rules: [],
    download_config: {
      html: {
        date_format: "DD/MM/YYYY",
        show_header: true,
        show_footer: true,
        header_notes: "",
        footer_notes: ""
      },
      xlsx: {
        date_format: "DD/MM/YYYY",
        show_header: true,
        show_footer: true,
        header_notes: "",
        footer_notes: ""
      },
      txt: {
        date_format: "DD/MM/YYYY",
        show_header: true,
        show_footer: true,
        header_notes: "",
        footer_notes: ""
      },
      csv: {
        date_format: "DD/MM/YYYY",
        show_header: true,
        show_footer: true,
        header_notes: "",
        footer_notes: ""
      },
      pdf: {
        date_format: "DD/MM/YYYY",
        show_header: true,
        show_footer: true,
        header_notes: "",
        footer_notes: ""
      },
      show_download_setting: false
    }

  }
};
export const ScatterChartData = (data, param) => {
  let val = param?.average_time.split(" ")[0];
  let dataVal = data &&
    data.map(item => {
      if (item.action_date_time != null)
        return {
          x: item.action_date_time, //moment(item.action_date_time.split(" ")[0], 'YYYY-MM-DD').format('DD/MM/YYYY'),
          y: item.api_execution_time
        }
    })
  // console.log("val", dataVal)
  return (
    {

      series: [
        {
          name: "",
          data: dataVal
        }
      ],
      options: {
        chart: {
          // height: 480,
          type: "scatter",
          zoom: {
            enabled: true,
            type: "xy",
            autoScaleYaxis: true
          },
          // foreColor: '#686868',
          // background: '#fff',
          id: "scatterchart-2",
          dropShadow: {
            enabled: false,
            // color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true
            },
            autoSelected: "zoom"
          },
          animations: {
            enabled: false,
            easing: "easeinout",
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          }
        },
        annotations: {
          yaxis: [
            {
              y: val,
              borderColor: 'orange',
              label: {
                borderColor: '#00E396',
                style: {
                  color: '#fff',
                  background: '#00E396'
                },
                // text: 'Y-axis annotation'
              }
            }
          ]
        },
        colors: ["blue"],

        dataLabels: {
          enabled: false,
          allowOverlap: false,
          offsetY: 0,
          background: {
            enabled: true
          }
          // formatter: function (val, opts) {
          //   return Math.round(val / 1000) + 'k'
          // },
        },

        // title: {
        //   text: 'Scatter Chart',
        //   align: 'left',
        //   style: {
        //     color: "#000000",
        //     fontSize: "16px",
        //   }
        // },

        grid: {
          borderColor: "#e7e7e7",
          row: {
            colors: ["transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          },
          padding: {
            right: 30,
            left: 20
          }
        },

        markers: {
          size: 7,
          colors: ["blue"],
          strokeColors: "#fff",
          strokeWidth: 2,
          hover: {
            size: 10,
            sizeOffset: 4
          }
        },

        xaxis: {
          type: "category",
          categories: [],
          labels: {
            show: false,
          },
          title: {
            text: "Date",
            style: {
              color: "#686868"
            }
          },
          borderColor: "#775DD0",
          label: {
            borderColor: "#775DD0",
            style: {
              color: "#fff",
              background: "#775DD0",
              rotate: -45,
              hideOverlappingLabels: true,
              showDuplicates: false,

              fontSize: "10px"
            }
            // style: {
            //   colors: "#686868",
            // },
          },
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#686868"
          },
          tickAmount: undefined,
          tickPlacement: "between",
          min: undefined,
          max: undefined,
          range: undefined,
          floating: false,
          position: "bottom",
        },

        yaxis: {
          tickAmount: 7,
          //   min:0,
          //   max:1000,
          //tickAmount: 7,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#686868",
            offsetX: 7
          },
          labels: {
            minWidth: 40,
            style: {
              colors: "#686868",
              fontSize: "6px"
            }
          },
          title: {
            text: "Execution Time",
            style: {
              color: "#686868"
            }
          }
        },

        tooltip: {
          enabled: true,
          offsetY: 0,
          // style: {
          //   fontSize: 0,
          //   fontFamily: 0
          // },
          y: {
            formatter: function (value, opts) {
              return (
                "Execution Time: " + opts?.series[opts?.seriesIndex][opts?.dataPointIndex]
              )
            }
          }
        },

        fill: {
          type: "gradient", // / 'solid' / 'pattern' / 'image'
          gradient: {
            shade: "dark",
            gradientToColors: ["#0072c6"],
            shadeIntensity: 1,
            type: "horizontal",
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          }
        },

        legend: {
          position: "bottom"
          // horizontalAlign: 'right',
          // verticalAlign: "bottom",
          // floating: true,
          // offsetY: -25,
          // offsetX: -5,
          // containerMargin: {
          //     left: 35,
          //     right: 60
          // }
        },

        responsive: [
          {
            breakpoint: 450,
            options: {
              yaxis: {
                labels: {
                  style: {
                    fontSize: "8px"
                  },
                  formatter: function (label, index) {
                    var val = label / 1000;
                    return val === 0 ? 0 : val + "k";
                  }
                }
              },
              xaxis: {
                tickAmount: 5,
                labels: {
                  style: {
                    fontSize: "8px"
                  }
                }
              },

              chart: {
                toolbar: {
                  position: "bottom",
                  show: false
                }
              },

              title: {
                style: {
                  color: "#000000",
                  fontSize: "10px"
                }
              }

              //   dataLabels: {
              //     formatter: function (val) {
              //       return Math.round(val/100000) + "L";
              //     }
              //   },
            }
          }
        ]
      }
    });
}


export const ChartApiData = {
  LegendPosition: "",
  ChartXLabel: "",
  UpperRangeBound: "",
  TotalArray: [
    {
      ShowTotal: false,
      Total: 0,
      FieldName: "Customer Complaint"
    },
    {
      ShowTotal: false,
      Total: 0,
      FieldName: "Lawsuit"
    },
    {
      ShowTotal: false,
      Total: 0,
      FieldName: "Non Complaint"
    },
    {
      ShowTotal: false,
      Total: 0,
      FieldName: "Other Complaint"
    }
  ],
  ChartHeight: "",
  Format: "en-US",
  BaseReportType: "G",
  ChartColors: [
    "#1f77b4",
    "#aec7e8",
    "#ff7f0e",
    "#98df8a",
    "#ffbb78",
    "#2ca02c"
  ], // need array
  MarkerLabel: "",
  XLabelColor: "#000000",
  ChartKLOrientation: "0",
  FormatValues: false,
  ChartTitle: "Volume",
  XTickColor: "#000000",
  ReportType: "G",
  ChartKeyField: "Type",
  MarkerColor: "#000000",
  ShowGrid: true,
  ChartDisplayFields: [
    "Customer Complaint",
    "Lawsuit",
    "Non Complaint",
    "Other Complaint"
  ], // need array
  XTickFontSize: "0",
  ChartWidth: "",
  LinkData: [],
  MarkerLabelColor: "#000000",
  LowerRangeBound: "",
  Data: [
    [
      {
        RuleColor: "",
        Value: 0,
        KeyField: "July",
        enabled: true
      },
      {
        RuleColor: "",
        Value: 0,
        KeyField: "August",
        enabled: true
      },
      {
        RuleColor: "",
        Value: 0,
        KeyField: "September",
        enabled: true
      }
    ],
    [
      {
        RuleColor: "",
        Value: 0,
        KeyField: "July",
        enabled: true
      },
      {
        RuleColor: "",
        Value: 0,
        KeyField: "August",
        enabled: true
      },
      {
        RuleColor: "",
        Value: 0,
        KeyField: "September",
        enabled: true
      }
    ],
    [
      {
        RuleColor: "",
        Value: 0,
        KeyField: "July",
        enabled: true
      },
      {
        RuleColor: "",
        Value: 0,
        KeyField: "August",
        enabled: true
      },
      {
        RuleColor: "",
        Value: 0,
        KeyField: "September",
        enabled: true
      }
    ],
    [
      {
        RuleColor: "",
        Value: 63,
        KeyField: "July",
        enabled: true
      },
      {
        RuleColor: "",
        Value: 4799,
        KeyField: "August",
        enabled: true
      },
      {
        RuleColor: "",
        Value: 89,
        KeyField: "September",
        enabled: true
      }
    ]
  ],
  ChartYLabel: "",
  ChartType: "bar", // stacked:true (for column)
  YTickFontSize: "0",
  BatchValuesXML: "",
  XLabelFontSize: "0",
  YLabelFontSize: "0",
  ChartTitleColor: "#000000",
  YTickColor: "#000000",
  ChartOrientation: "vertical",
  MarkerRangeValue: "",
  YLabelColor: "#000000",
  BatchInfo: {
    bShowBatching: "false",
    bEnableNext: "false",
    bEnablePrev: "false"
  },
  ShowLegend: true,
  ChartBgColor: "#FFFFFF",

  data: {
    total_array: [
      {
        show_total: false,
        total: "0.0",
        field_name: "Volume"
      }
    ],
    data: [
      {
        rule_color: "",
        value: "0.0",
        key_field: "0",
        enabled: "true"
      }
    ],
    base_report_type: "G",
    chart_title: "Daily Volume Of Completed Cases",
    chart_title_color: "#000000",
    chart_key_field: "Volume",
    chart_height: "",
    chart_width: "",
    chart_orientation: "vertical",
    chart_bg_color: "#FFFFFF",
    chart_k_l_orientation: "0",
    chart_colors: "",
    chart_display_fields: "Volume",
    chart_x_label: "",
    x_label_color: "#000000",
    x_label_font_size: "0",
    x_tick_color: "#000000",
    x_tick_font_size: "0",
    chart_y_label: "",
    y_label_color: "#000000",
    y_label_font_size: "0",
    y_tick_color: "#000000",
    y_tick_font_size: "0",
    show_grid: true,
    legend_position: "",
    show_legend: true,
    upper_range_bound: "",
    marker_color: "#000000",
    marker_label: "",
    marker_label_color: "#000000",
    marker_range_value: "",
    chart_type: "meter",
    lower_range_bound: "",
    batch_values_xml: "",
    batch_info: {
      b_show_batching: false,
      b_enable_next: false,
      b_enable_prev: false
    },
    range_from: "0",
    range_to: "50",
    normal_range_from: "0",
    normal_range_to: "30",
    warning_range_from: "30",
    warning_range_to: "40",
    critical_range_from: "40",
    critical_range_to: "50",
    interval: "5",
    units: "Cases"
  }
};

export const ChartData = (data) => {

  let dataValue = [...data?.data];
  // let scatterData = dataValue.map(item =>
  //   item?.map(val => {
  //     if (val.value != null)
  //       return [+val.key_field, +val.value]

  //   }))
  let newSeries = dataValue[0]?.map((res, key) => { return (res?.key_field) })
  let series = data?.total_array?.map((res, key) => { return ({ name: res?.field_name, data: dataValue[key]?.map((result) => result?.value) }) })
  return (
    {
      options: {
        chart: {
          id: "basic-bar",
          // width: data && data.chart_width ? data.chart_width : '',
          // height: data && data.chart_height ? data.chart_height : '',
          type: data && data.chart_type ? data.chart_type : "bar",
          stacked: data && data.is_stacked ? true : false,
          background: data && data.chart_bg_color ? data.chart_bg_color : "#ffffff",
          toolbar: {
            show: false,
          },
          dropShadow: {
            enabled: false, // (data.chart_type === "pie") ? true : false,
            color: "#111",
            top: -1,
            left: 3,
            blur: 3,
            opacity: 0.2
          },
          events: {
            ...data.events,
          }
        },

        plotOptions: {
          bar: {
            distributed: false,
            horizontal: data && data.chart_orientation === 'horizontal' ? true : false,
            dataLabels: {
              position: 'top', // top, center, bottom

            },
          },
          pie: {
            startAngle: data && data.is_half ? -90 : 0,
            endAngle: data && data.is_half ? 90 : 360,
            donut: {
              size: '55%',
              labels: {
                show: (data.chart_type === "donut") ? true : false,
                name: {
                  show: (data.chart_type === "donut") ? true : false,
                  offsetY: data.is_half ? 0 : -10,
                },
                value: {
                  show: (data.chart_type === "donut") ? true : false,
                  offsetY: data.is_half ? -50 : 10,
                },
                total: {
                  showAlways: false,
                  show: (data.chart_type === "donut") ? true : false,
                }
              }
            }
          }
        },

        dataLabels: {
          enabled: (data && data.chart_type && data.chart_type === 'bar' || data.chart_type === "scatter" || data.chart_type === "area") ? false : true,
          dropShadow: {
            enabled: false,
          }
        },

        colors: data && (!(data.chart_type === "pie" || data.chart_type === "donut" || data.chart_type === "ring"))
          && data.chart_colors ? data.chart_colors.split(",")
          : ["#168EDD", "#39C1FD", "#1DB7CF", "#3CA591", "#41CF74", "#A3D143"],
        labels: data && (data.chart_type === "pie" || data.chart_type === "donut" || data.chart_type === "ring")
          && newSeries ? newSeries : [],

        // title: {
        //   text: data && data.chart_title ? data.chart_title : "Chart ",
        //   floating: false,
        //   offsetY: 10,
        //   align: "center",
        //   style: {
        //     color: data && data.chart_title_color ? data.chart_title_color : "#444"
        //   }
        // },

        legend: {
          show: true, // data && data.show_legend !== undefined ? data.show_legend : true,
          position: data && data.legend_position ? data.legend_position : "right",
          fontSize: '10px',
          offsetY: 5,
        },

        responsive: [

          {
            breakpoint: 370,

            options: {
              chart: {
                height: data.report_id && data.report_id !== '466' ? window.innerHeight : window.innerHeight - 20,
              },
              plotOptions: {
                bar: {
                  horizontal: data && data.chart_orientation === 'horizontal' ? true : false,
                },
                pie: {
                  offsetY: -5,
                  donut: {
                    labels: {
                      show: (data.chart_type === "donut") ? true : false,
                      total: {
                        showAlways: (data.chart_type === "donut") ? true : false,
                        show: (data.chart_type === "donut") ? true : false
                      }
                    }
                  }
                }

              },
              legend: {
                show: true, // data.report_id && data.report_id !== '466' ? true : false,
                position: "bottom",
                fontSize: '10px',
                offsetY: -4,

              },
              xaxis: {
                labels: {
                  show: true,
                  rotate: -90,
                  trim: true
                }

              },
              dataLabels: {
                enabled: (data.chart_type === "pie" || data.chart_type === "donut") ? true : false,
              },
            }
          }
        ],

        xaxis: {
          categories: (data?.chart_type !== "scatter") ? data && series ? (data.total_array >= 1) ? series.map((res) => res.name) : newSeries : [] : [],
          labels: {
            show: true,
            rotate: -65,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            minHeight: undefined,
            maxHeight: 120,
            style: {
              // colors: data && data.x_label_color ? data.x_label_color : 'red',
              // fontSize: data && data.x_label_font_size ? data.x_label_font_size : "12px",
              // fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              cssClass: "apexcharts-xaxis-label"
            },
            offsetX: 0,
            offsetY: 0,
            format: data && data.format ? data.format : undefined,
            formatter: undefined,
            datetimeUTC: true,

          },
          axisTicks: {
            show: false,
            borderType: "solid",
            color: data && data.x_tick_color ? data.x_tick_color : "#78909C",
            fontSize: data && data.x_tick_font_size ? data.x_tick_font_size : "12px",
            width: 6,
            offsetX: 0,
            offsetY: 0
          },
          axisBorder: {
            show: true,
            color: "#606060",
            // offsetX: -10,
            offsetY: 0
          },
          title: {
            text: data && data.chart_key_field ? data.chart_key_field : undefined,
            rotate: -90,
            offsetX: 0,
            offsetY: 10,
            style: {
              color: data && data.x_label_color ? data.x_label_color : "aqua",
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-xaxis-title"
            }
          },
        },

        yaxis: {
          show: true,
          showAlways: true,
          showForNullSeries: true,
          seriesName: undefined,
          opposite: false,
          reversed: false,
          logarithmic: false,
          tickAmount: 6,
          //   min: data && data.lower_range_bound ? data.lower_range_bound : 0, 
          //   max: data && data.upper_range_bound? data.upper_range_bound :1500000, 
          forceNiceScale: false,
          floating: false,
          decimalsInFloat: undefined,
          labels: {
            show: true,
            align: "right",
            minWidth: 0,
            maxWidth: 160,
            // style: {
            //   colors: data && data.y_label_color ? data.y_label_color : "black",
            //   fontSize: data && data.y_label_font_size ? data.y_label_font_size : "12px",
            //   fontFamily: "Helvetica, Arial, sans-serif",
            //   fontWeight: 400,
            //   cssClass: "apexcharts-yaxis-label"
            // },
            offsetX: -11,
            offsetY: 0,
            rotate: 0
          },
          axisBorder: {
            show: true,
            color: "#606060",
            // offsetX: -10,
            offsetY: 0
          },
          axisTicks: {
            show: false,
            borderType: "solid",
            color: data && data.y_tick_color ? data.y_tick_color : "#78909C",
            fontSize: data && data.y_tick_font_size ? data.y_tick_font_size : "12px",
            width: 6,
            offsetX: 0,
            offsetY: 0
          },

          title: {
            text: data && data.chart_y_label ? data.chart_y_label : undefined,
            rotate: -90,
            offsetX: data && data.chart_orientation === 'horizontal' ? -4 : 4,
            offsetY: 0,
            style: {
              color: data && data.y_label_color ? data.y_label_color : "aqua",
              fontSize: "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-title"
            }
          },

          tooltip: {
            enabled: true,
            offsetX: 0
          }

        },
        markers: {
          size: 5,
          colors: data && data.marker_color ? data.marker_color : undefined,
          strokeColors: "#fff",
          strokeWidth: 2,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          discrete: [],
          shape: "circle",
          radius: 2,
          offsetX: 0,
          offsetY: 0,
          onClick: undefined,
          onDblClick: undefined,
          showNullDataPoints: true,
          hover: {
            size: undefined,
            sizeOffset: 3
          }
        },

        grid: {
          show: data && data.chart_type === "scatter" ? true : data.show_grid ? data.show_grid : false,
          borderColor: "#90A4AE",
          strokeDashArray: data && data.chart_type === "scatter" ? 0 : 10,
          position: "back",

          xaxis: {
            lines: {
              show: data && data.chart_type === "scatter" ? false : true
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          },

          row: {
            colors: undefined,
            opacity: 0.5
          },
          column: {
            colors: undefined,
            opacity: 0.5
          },

          padding: {
            top: data && data.is_half ? 50 : 0,
            right: 0,
            bottom: data && data.is_half ? -100 : 15,
            left: 0
          }
        },
      },

      series: data && (data.chart_type === "pie" || data.chart_type === "donut" || data.chart_type === "ring") ? series[0].data.map((res) => parseInt(res))
        : data && data.chart_type === "scatter" ?
          // [
          //   {
          //     name: "",
          //     data: scatterData,
          //   }
          // ]
          [{
            name: "Furniture",
            data: [[2014, 559], [2015, 293], [2016, 231], [2017, 528], [2018, 95], [2019, 515], [2020, 444]]
          },
          {
            name: "Household",
            data: [[2014, 633], [2015, 172], [2016, 321], [2017, 428], [2018, 44], [2019, 612], [2020, 398]]
          }
          ]
          : series
    }
  )
};
const chartArr =
  [
    {
      name: "Installation",
      data: [934, 503, 571, 696, 970, 1199, 1371, 1541]
    },
    {
      name: "Manufacturing",
      data: [249, 240, 297, 298, 324, 302, 381, 404]
    },
    {
      name: "Sales & Distribution",
      data: [117, 177, 160, 197, 185, 277, 321, 393]
    },
    {
      name: "Project Development",
      data: [117, 175, 790, 121, 151, 224, 344, 342]
    }
  ];

export const ChartDataSync = (data) => {

  return (
    {
      options: {
        chart: {
          width: data && data.chart_width ? data.chart_width : '',
          height: data && data.chart_height ? data.chart_height : '',
          type: data && data.chart_type ? data.chart_type : "bar",
          stacked: data && data.is_stacked ? true : false,
          background: data && data.bg_color ? data.bg_color : "#ffffff",
          toolbar: {
            show: false,
          },

          dropShadow: {
            enabled: (data.chart_type === "pie"),
            color: "#111",
            top: -1,
            left: 3,
            blur: 3,
            opacity: 0.2
          }
        },
        stroke: {
          width: 2,
          curve: 'smooth'
        },

        plotOptions: {
          bar: {
            horizontal: data && data.chart_orientation === 'horizontal' ? true : false,
            dataLabels: {
              position: data && data.show_values_position ? data.show_values_position : 'top', // top, center, bottom
            },
          },

          pie: {
            startAngle: data && data.is_half ? -90 : 0,
            endAngle: data && data.is_half ? 90 : 360,
            donut:
            {
              labels: {
                show: (data.chart_type === "donut") ? true : false,
                total: {
                  showAlways: (data.chart_type === "donut") ? true : false,
                  show: (data.chart_type === "donut") ? true : false
                }
              }
            }
          }
        },

        dataLabels: {
          enabled: (data && data.show_values && data.show_values === 'H') ? false : true,
          offsetY: data && data.chart_type === "bar" && data.show_values_position && data.show_values_position === "top" ? -20 : 0,
          style: {
            fontSize: data && data.show_values_font_size ? data.show_values_font_size : "12px",
            fontWeight: data && data.show_values_font_family_variant ? data.show_values_font_family_variant : "400",
            fontFamily: data && data.show_values_font_family ? data.show_values_font_family : "400",
            colors: data && data.show_values_bg_color ? [data.show_values_bg_color] : undefined,
          },
          background: {
            enabled: data && data.show_values_font_color ? true : false,
            foreColor: data && data.show_values_font_color ? data.show_values_font_color : "#fff",
          }
        },

        colors: data && (data.chart_type === "pie" || data.chart_type === "donut" || data.chart_type === "ring") && data.chart_colors ? data.chart_colors : ["#1f77b4", "#aec7e8", "#ff7f0e", "#98df8a", "#ffbb78", "#2ca02c"],
        labels: data && (data.chart_type === "pie" || data.chart_type === "donut" || data.chart_type === "ring") && data.chart_display_fields ? data.chart_display_fields.map(item => item.display_name) : [["Food", "Apparels", "Electronics", "Household", "HouseRent", "Transport"][Math.floor(Math.random() * 5)]],

        title: {
          text: data && data.chart_title ? data.chart_title : "Chart ",
          floating: false,
          offsetY: 10,
          align: data && data.chart_title_font_alignment ? data.chart_title_font_alignment : "center",
          style: {
            color: data && data.chart_title_color ? data.chart_title_color : "#444",
            fontSize: data && data.chart_title_font_size ? data.chart_title_font_size : "12px",
            fontFamily: data && data.chart_title_font_family ? data.chart_title_font_family : "Open Sans",
            fontWeight: data && data.chart_title_font_family_variant ? data.chart_title_font_family_variant : "",
          }
        },

        legend: {
          show: data && data.show_legend ? data.show_legend : true,
          horizontalAlign: data && data.legend_font_alignment ? data.legend_font_alignment : "center",
          position: data && data.legend_position ? data.legend_position : "bottom",
          fontSize: data && data.legend_font_size ? data.legend_font_size : "10px",
          fontFamily: data && data.legend_font_family ? data.legend_font_family : "Open Sans",
          fontWeight: data && data.legend_font_family_variant ? data.legend_font_family_variant : "10px",
          offsetY: 4,
        },

        responsive: [
          {
            breakpoint: 780,

            options: {
              chart: {
                height: 380,

              },
              plotOptions: {
                bar: {
                  horizontal: false,
                }
              },
              legend: {
                position: "bottom",
                fontSize: '10px',
                offsetY: 4,

              },
              xaxis: {
                labels: {
                  show: true,
                  rotate: -90,
                  trim: true
                }

              },
              dataLabels: {
                enabled: false,
              },
            }
          }
        ],

        xaxis: {
          categories: data && data.chart_x_label ? data.chart_x_label : ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"],
          labels: {
            show: true,
            rotate: -65,
            rotateAlways: false,
            hideOverlappingLabels: true,
            showDuplicates: false,
            trim: false,
            align: data && data.axis_label_font_alignment ? data.axis_label_font_alignment : "center",
            minHeight: undefined,
            maxHeight: 120,
            style: {
              colors: data && data.x_label_color ? data.x_label_color : 'red',
              fontSize: data && data.x_label_font_size ? data.x_label_font_size : "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              cssClass: "apexcharts-xaxis-label"
            },
            axisTicks: {
              show: true,
              borderType: "solid",
              color: data && data.x_tick_color ? data.x_tick_color : "#78909C",
              fontSize: data && data.x_tick_font_size ? data.x_tick_font_size : "12px",
              width: 6,
              offsetX: 0,
              offsetY: 0
            },
            offsetX: 0,
            offsetY: 0,
            format: data && data.format ? data.format : undefined,
            formatter: undefined,
            datetimeUTC: true,

          },
          title: {
            text: data && data.label_x_axis ? data.label_x_axis : "",
            rotate: -90,
            offsetX: 0,
            offsetY: 0,
            // align: "left",
            // labels: {
            //   align: "left",
            // },
            style: {
              color: data && data.axis_label_font_color ? data.axis_label_font_color : "aqua",
              fontSize: data && data.axis_label_font_size ? data.axis_label_font_size : "12px",
              fontFamily: data && data.axis_label_font_family ? data.axis_label_font_family : "Helvetica, Arial, sans-serif",
              fontWeight: data && data.axis_label_font_family_variant ? data.axis_label_font_family_variant : 600,
              cssClass: "apexcharts-xaxis-title"
            }
          },
        },

        yaxis: {
          show: true,
          showAlways: true,
          showForNullSeries: true,
          seriesName: undefined,
          opposite: false,
          reversed: false,
          logarithmic: false,
          tickAmount: 6,
          //   min: data && data.lower_range_bound ? data.lower_range_bound : 0, 
          //   max: data && data.upper_range_bound? data.upper_range_bound :1500000, 
          forceNiceScale: false,
          floating: false,
          decimalsInFloat: undefined,
          labels: {
            show: true,
            align: "right",
            minWidth: 0,
            maxWidth: 160,
            style: {
              colors: data && data.chart_y_label ? data.chart_y_label : "black",
              fontSize: data && data.y_label_font_size ? data.y_label_font_size : "12px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              cssClass: "apexcharts-yaxis-label"
            },
            offsetX: 0,
            offsetY: 0,
            rotate: 0
          },
          axisBorder: {
            show: true,
            color: "#78909C",
            offsetX: 0,
            offsetY: 0
          },
          axisTicks: {
            show: true,
            borderType: "solid",
            color: data && data.y_tick_color ? data.y_tick_color : "#78909C",
            fontSize: data && data.y_tick_font_size ? data.y_tick_font_size : "12px",
            width: 6,
            offsetX: 0,
            offsetY: 0
          },

          title: {
            text: data && data.LabelYaxis ? data.LabelYaxis : "",
            rotate: -90,
            offsetX: 0,
            offsetY: 0,
            style: {
              color: data && data.axis_label_font_color ? data.axis_label_font_color : "aqua",
              fontSize: data && data.axis_label_font_size ? data.axis_label_font_size : "12px",
              fontFamily: data && data.axis_label_font_family ? data.axis_label_font_family : "Helvetica, Arial, sans-serif",
              fontWeight: data && data.axis_label_font_family_variant ? data.axis_label_font_family_variant : 600,
              cssClass: "apexcharts-yaxis-title"
            }
          },

          tooltip: {
            enabled: true,
            offsetX: 0
          }

        },

        markers: {
          size: 4,
          colors: data && data.marker_color ? data.marker_color : undefined,
          strokeColors: "#fff",
          strokeWidth: 2,
          strokeOpacity: 0.9,
          strokeDashArray: 0,
          fillOpacity: 1,
          discrete: [],
          shape: "circle",
          radius: 2,
          offsetX: 0,
          offsetY: 0,
          onClick: undefined,
          onDblClick: undefined,
          showNullDataPoints: true,
          hover: {
            size: undefined,
            sizeOffset: 3
          }
        },

        grid: {
          show: data && (data.show_x_grid === "Y" || data.show_y_grid === "Y") ? true : false,
          borderColor: "#90A4AE",
          strokeDashArray: 0,
          position: "back",
          xaxis: {
            lines: {
              show: data && data.show_x_grid === "Y" ? true : false,
            }
          },
          yaxis: {
            lines: {
              show: data && data.show_y_grid === "Y" ? true : false,
            }
          },

          row: {
            colors: undefined,
            opacity: 0.2
          },
          column: {
            colors: undefined,
            opacity: 0.2,
          },
        },

      },

      series: data && (data.chart_type === "pie" || data.chart_type === "donut" || data.chart_type === "ring")
        ? [[5040, 6330, 5070, 8900, 9100, 7100][Math.floor(Math.random() * 5)]]
        : data && data.chart_type === "scatter" ?
          [{
            name: "Account",
            data: [[3, 559], [5, 293], [7, 231], [8, 528], [3, 95], [12, 515], [11, 444], [14, 592], [33, 229], [22, 238], [2, 285], [33, 524], [4, 422], [25, 344], [12, 510], [35, 132], [14, 381]]
          }
          ]
          : data.chart_display_fields.length > 0 ? data.chart_display_fields.map((item, index) => {
            return {
              ...chartArr[index], name: item.display_name
            }
          })
            : [
              {
                name: "Installation",
                data: [934, 503, 571, 696, 970, 1199, 1371, 1541]
              },
              {
                name: "Manufacturing",
                data: [249, 240, 297, 298, 324, 302, 381, 404]
              },
              {
                name: "Sales & Distribution",
                data: [117, 177, 160, 197, 185, 277, 321, 393]
              },
              {
                name: "Project Development",
                data: [117, 175, 790, 121, 151, 224, 344, 342]
              }
            ]
    }
  )
};

export const FontSettings = {
  fontFamily: [
    { value: "Open Sans", label: "Open Sans" },
    { value: "Verdana", label: "Verdana" },
    { value: "Helvetica", label: "Helvetica" }
  ],
  fontVariant: [
    { value: "600", label: "Bold" },
    { value: "400", label: "Normal" }
  ],
  fontSize: [
    { value: 10, label: "10px" },
    { value: 12, label: "12px" },
    { value: 14, label: "14px" },
    { value: 16, label: "16px" },
    { value: 18, label: "18px" },
    { value: 20, label: "20px" }
  ]
};

export const QueryLayoutCodeView = {
  conditonDummy: [
    "AND",
    "OR",
    "NOT",
    "LIKE",
    "IN",
    "BETWEEN",
    "ANY",
    "ALL",
    "ON"
  ],
  expressionDummy: [
    "SELECT",
    "FROM",
    "WHERE",
    "ORDER BY",
    "INSERT INTO",
    "GROUP BY",
    "HAVING",
    "EXISTS"
  ],
  joinDummy: ["INNER", "LEFT", "RIGHT", "FULL"]
};

export const BlankTrendStateJson = {
  opr: "0", // 0 create  document
  scheduler_property: {
    instance_title: "",
    user_id: "",
    description: "",
    created_date_time: "", // save
    scheduler_status: "",
    scheduler_state: "",
    start_date_time: "",
    next_run_time: ""
  },
  report_instance_list: {
    scheduler_type: "TA",
    report_instance: {
      instance_type: "R",
      report_instance_id: "",
      report_instance_name: "",
      report_id: "",
      default_display: "",
      refresh_interval: "",
      alert_delay_interval: "",
      is_rule_defined: "N",
      input_fields: {
        extra_info_xml: []
      },
      rules: ""
    }
  },
  deleted_report_instances: [],
  file_option: "", //
  split_size: "", //
  output_format: "TABLE", //
  retry_interval: "0", //
  no_of_trials: "0", //
  recurrence: {
    occurrence: "D", ///
    time_gap: "1", ///
    days: "A", ///
    hour_gap: "",
    hours: "15",
    minutes: "12",
    start_hour: "",
    start_minute: "",
    end_hour: "",
    end_minute: "",
    start_date: "",
    end_date: "",
    week: "",
    week_days: "",
    month: "",
    description: ""
  },
  destination: {
    destination_type: ""
  }
};

export const filterJsonTrendsAuditLog = {
  opr: "0", //static
  screen_id: "trend", // static
  from_date: "",
  to_date: "",
  action_id: "", //
  batch_size: "5", //static
  selected_tab: "1", // tbd, vivek
  object_id: "", // object id of last element
  action_by: "", //
  sort_order: "d", //
  last_value: "", // history_id
  type: "TA", //done
  i_action: "0" // opr next 1 previous 2 first hit 0
};


export const DummyJson1 = {
  data: {
    dashboard_info: {
      default_dashboard_id: 1,
      default_tab_id: 1,
      default_navigation: "C",
      navigation_type: 1,
      dashboards: [
        {
          id: 1,
          name: "Dashboard1",
          tabs: [
            {
              id: 1,
              name: "Home",
              template_id: "10",
              template_def: [
                {
                  container_id: "102",
                  X: 1,
                  Y: 1,
                  colspan: 1,
                  rowspan: 1,
                  dimension: {
                    width: 100,
                    height: 400
                  }
                },
                {
                  container_id: "103",
                  X: 1,
                  Y: 1,
                  colspan: 1,
                  rowspan: 1,
                  dimension: {
                    width: 100,
                    height: 400
                  }
                },
                {
                  container_id: "104",
                  X: 1,
                  Y: 1,
                  colspan: 1,
                  rowspan: 1,
                  dimension: {
                    width: 100,
                    height: 400
                  }
                }
              ],
              instances: {
                "102": {
                  id: "11",
                  name: "report1",
                  load_url:
                    "192.168.38.66:9000",
                  c_input_info: {
                    OpenReportInNewWindow: false,
                    ShowSearchbar: true,
                    Type: "Design"
                  },
                  c_load_json: {
                    app_context: "bam",
                    app_Domain: "",
                    app_id: "2",
                    app_loc: "1",
                    app_name: "BAM",
                    app_port: "",
                    app_ssl: false,
                    custom_js: "",
                    ins_type: "1",
                    refresh: true
                  }
                },
                "103": {
                  id: "68",
                  name: "report2",
                  load_url:
                    "192.168.38.66:9000",
                  c_input_info: {
                    OpenReportInNewWindow: false,
                    ShowSearchbar: true,
                    Type: "Design"
                  },
                  c_load_json: {
                    app_context: "bam",
                    app_Domain: "",
                    app_id: "2",
                    app_loc: "1",
                    app_name: "BAM",
                    app_port: "",
                    app_ssl: false,
                    custom_js: "",
                    ins_type: "1",
                    refresh: true
                  }
                },
                "104": {
                  id: "64",
                  name: "report3",
                  load_url:
                    "192.168.38.66:9000",
                  c_input_info: {
                    OpenReportInNewWindow: false,
                    ShowSearchbar: true,
                    Type: "Design"
                  },
                  c_load_json: {
                    app_context: "bam",
                    app_Domain: "",
                    app_id: "2",
                    app_loc: "1",
                    app_name: "BAM",
                    app_port: "",
                    app_ssl: false,
                    custom_js: "",
                    ins_type: "1",
                    refresh: true
                  }
                }
              }
            },
            {
              id: 2,
              name: "Tab2"
            }
          ]
        },
        {
          id: 2,
          name: "Dashboard2",
        },
        {
          id: 3,
          name: "Dashboard2",
        }
      ]
    }
  }
};

export const DummyJson2 = {
  data: {
    dashboard_info: {
      default_dashboard_id: 1,
      default_tab_id: 1,
      default_navigation: "C",
      navigation_type: 1,
      dashboards: [
        {
          id: 1,
          name: "Dashboard1",
          tabs: [
            {
              id: 1,
              name: "Tab1",
              template_id: "10",
              template_def: [
                {
                  container_id: "102",
                  X: 1,
                  Y: 1,
                  colspan: 1,
                  rowspan: 1,
                  dimension: {
                    width: 100,
                    height: 400
                  }
                }
              ],
              instances: {
                "102": {
                  id: "12",
                  name: "Report View",
                  load_url:
                    "http://ibps5aurora.newgendocker.com/bam/components/reportlist",
                  c_input_info: {
                    OpenReportInNewWindow: false,
                    ShowSearchbar: true,
                    Type: "Design"
                  },
                  c_load_json: {
                    app_context: "bam",
                    app_Domain: "",
                    app_id: "2",
                    app_loc: "1",
                    app_name: "BAM",
                    app_port: "",
                    app_ssl: false,
                    custom_js: "",
                    ins_type: "1",
                    refresh: true
                  }
                }
              }
            },
            {
              id: 2,
              name: "Tab2"
            }
          ]
        }
      ]
    }
  }

}
export const DummyJson3 = {
  data: {
    dashboard_info: {
      default_dashboard_id: 1,
      default_tab_id: 1,
      default_navigation: "C",
      navigation_type: 1,
      dashboards: [
        {
          id: 1,
          name: "Dashboard1",
          tabs: [
            {
              id: 1,
              name: "Home",
              template_id: "10",
              template_def: [
                {
                  container_id: "102",
                  X: 1,
                  Y: 1,
                  colspan: 1,
                  rowspan: 1,
                  dimension: {
                    width: 100,
                    height: 400
                  }
                }
              ],
              instances: {
                "102": {
                  id: "12",
                  name: "Report View",
                  load_url:
                    "http://ibps5aurora.newgendocker.com/bam/components/reportlist",
                  c_input_info: {
                    OpenReportInNewWindow: false,
                    ShowSearchbar: true,
                    Type: "Design"
                  },
                  c_load_json: {
                    app_context: "bam",
                    app_Domain: "",
                    app_id: "2",
                    app_loc: "1",
                    app_name: "BAM",
                    app_port: "",
                    app_ssl: false,
                    custom_js: "",
                    ins_type: "1",
                    refresh: true
                  }
                }
              }
            }
          ]
        }
      ]
    }
  }
}

export const getloginconf = {
  "data": {
    "cabinets": [
      {
        "name": "ibps5sp1p2",
        "alias": "ibps5sp1p2"
      },
      {
        "name": "ibps5sp1aug17",
        "alias": "ibps5sp1aug17"
      },
      {
        "name": "ibps5sp1lang8oct",
        "alias": "ibps5sp1lang8oct"
      }
    ],
    "locales": [
      {
        "name": "ar",
        "value": "Arabic [ar]",
        "display_string": "عربى"
      },
      {
        "name": "ar_SA",
        "value": "Arabic (Saudi Arabia) [ar_SA]",
        "display_string": "العربية (السعودية)"
      },
      {
        "name": "en",
        "value": "English [en]",
        "display_string": "English"
      },
      {
        "name": "en_US",
        "value": "English (United States) [en_US]",
        "display_string": "English (United States)"
      },
      {
        "name": "es_DO",
        "value": "Spanish (Spain International Sort) [es_DO]",
        "display_string": "Español (Spain International Sort)"
      },
      {
        "name": "vi",
        "value": "Vietnamese  [vi]",
        "display_string": "Tiếng Việt"
      },
      {
        "name": "th",
        "value": "Thai [th]",
        "display_string": "ไทย"
      },
      {
        "name": "zh_CN",
        "value": "Chinese (Simplified) (China) [zh_CN]",
        "display_string": "中文（简体）（中国）"
      },
      {
        "name": "zh_TW",
        "value": "Chinese (Traditional) (Taiwan) [zh_TW]",
        "display_string": "中文（繁體）（台灣）"
      },
      {
        "name": "zh_HK",
        "value": "Chinese (Traditional) (Hongkong) [zh_HK]",
        "display_string": "中文（繁體）（香港）"
      },
      {
        "name": "fr_FR",
        "value": "French [fr_FR]",
        "display_string": "Française"
      }
    ]
  },
  "status": {
    "maincode": "0",
    "suberrorcode": "0",
    "subject": "",
    "description": "",
    "errormsg": ""
  },
  "inis": {
    "PWDENCRYPT": "Y",
    "ForgetPasswordLink": "Y",
    "URLENCRYPT": "N",
    "DisableCabinetInfo": "N",
    "DisableMultilingaulForAdmin": "Y",
    "EnableMultiLingual": "Y",
    "ShowLangSelection": "Y",
    "RemeberUidCab": "Y",
    "CaptchaAuthentication": "N",
    "IsFirstTimeLoginOd": "N",
    "ShowBanner": "Y"
  }
}

export const cabData = {
  "data": {
    "cabinets": [{
      "name": "ibps5sp1p2",
      "alias": "ibps5sp1p2"
    }, {
      "name": "ibps5sp1aug17",
      "alias": "ibps5sp1aug17"
    }, {
      "name": "ibps5sp1lang8oct",
      "alias": "ibps5sp1lang8oct"
    }]
  },
  "status": {
    "maincode": "0",
    "suberrorcode": "0",
    "subject": "",
    "description": "",
    "errormsg": ""
  },
  "inis": {
    "PWDENCRYPT": "Y"
  }
}
export const appServerData = {
  "data": {
    serverTypes: [
      {
        label: "JBossEAP",
        value: "JBossEAP"
      },
      {
        label: "WebLogic",
        value: "WebLogic"
      },
      {
        label: "WebSphere",
        value: "WebSphere"
      },
      {
        label: "Wrapper",
        value: "JTS"
      }
    ]
  }
}

export const registeredCabinetsData = {
  "data": {
    "tableHeader": [
      { id: 'name', label: 'Cabinet' },
      { id: 'alias', label: 'Cabinet Alias' },
      { id: 'server_ip', label: 'AppServer IP' },
      { id: 'server_port', label: 'Port' },
      { id: 'site', label: 'Site' },
      { id: 'volume', label: 'Volume' },
    ],
    "cabinets": [
      { cabinet: 'ibps5sp1p2', cabinetAlias: 'ibps5sp1p2', appServerIP: '127.0.0.1', port: '8080', site: 'ibps5sp1p2Site', volume: 'ibps5sp1p2Vol' },
      { cabinet: 'ibps5sp1p2', cabinetAlias: 'ibps5sp1p2', appServerIP: '127.0.0.1', port: '8080', site: 'ibps5sp1p2Site', volume: 'ibps5sp1p2Vol' },
      { cabinet: 'ibps5sp1lang29oct', cabinetAlias: 'ibps5sp1lang29oct', appServerIP: '127.0.0.1', port: '8080', site: 'ibps5sp1lang29octSite', volume: 'ibps5sp1lang29octVol' },
      { cabinet: 'ibps5sp1p2', cabinetAlias: 'ibps5sp1p2', appServerIP: '127.0.0.1', port: '8080', site: 'ibps5sp1p2Site', volume: 'ibps5sp1p2Vol' },
      { cabinet: 'nemf12nov', cabinetAlias: 'nemf12nov', appServerIP: '127.0.0.1', port: '8080', site: 'nemf12novSite', volume: 'nemf12novVol' },
      { cabinet: 'ibps5sp1lang8oct', cabinetAlias: 'ibps5sp1lang8oct', appServerIP: '127.0.0.1', port: '8080', site: 'ibps5sp1lang8octSite', volume: 'ibps5sp1lang8octVol' },
      { cabinet: 'ibps5sp1p2', cabinetAlias: 'ibps5sp1p2', appServerIP: '127.0.0.1', port: '8080', site: 'ibps5sp1p2Site', volume: 'ibps5sp1p2Vol' },
      { cabinet: 'ibps5sp1p2', cabinetAlias: 'ibps5sp1p2', appServerIP: '127.0.0.1', port: '8080', site: 'ibps5sp1p2Site', volume: 'ibps5sp1p2Vol' },
      { cabinet: 'ibps5sp1p2', cabinetAlias: 'ibps5sp1p2', appServerIP: '127.0.0.1', port: '8080', site: 'ibps5sp1p2Site', volume: 'ibps5sp1p2Vol' },
    ]
  }
}

export const workspacesData = {
  "data": {
    "tableHeader": [
      { id: 'workspaceName', label: 'Workspace Name' },
      { id: 'description', label: 'Description' },
      { id: 'modifiedOn', label: 'Modified On' },
    ],
    "workspaces": [
      { workspaceName: "Report Designer", description: "A short description", modifiedOn: "28 Dec 2020 15:10 PM" },
      { workspaceName: "Data  Modeler", description: "A short description", modifiedOn: "28 Dec 2020 15:10 PM" },
      { workspaceName: "Report Creator", description: "A short description", modifiedOn: "28 Dec 2020 15:10 PM" },
      { workspaceName: "Process Designer", description: "A very short description", modifiedOn: "28 Nov 2020 11:10 PM" },
      { workspaceName: "RPA Designer", description: "A long description", modifiedOn: "28 Nov 2020 11:10 PM" },
      { workspaceName: "iFrame Designer", description: "A short description", modifiedOn: "29 Jan 2020 15:10 PM" },
      { workspaceName: "Data Designer", description: "A short description", modifiedOn: "31 Dec 2020 10:10 PM" },

    ]
  }
}

export const viewsData = {
  "data": {
    "tableHeader": [
      { id: 'viewName', label: 'View Name' },
      { id: 'description', label: 'Description' },
      { id: 'modifiedOn', label: 'Modified On' },
    ],
    "views": [
      { viewName: "Report", description: "A short description", modifiedOn: "28 Dec 2020 15:10 PM" },
      { viewName: "Scheduler", description: "A short description", modifiedOn: "28 Dec 2020 15:10 PM" },
      { viewName: "Audit Logs", description: "A short description", modifiedOn: "28 Dec 2020 15:10 PM" },
      { viewName: "Report", description: "A very short description", modifiedOn: "28 Nov 2020 11:10 PM" },
      { viewName: "Scheduler", description: "A long description", modifiedOn: "28 Nov 2020 11:10 PM" },
      { viewName: "Designer", description: "A short description", modifiedOn: "29 Jan 2020 15:10 PM" },
      { viewName: "Scheduler", description: "A short enough description", modifiedOn: "31 Dec 2020 10:10 PM" },

    ]
  }
}


export const inputsComponentsData = {
  "data": {
    "tableHeader": [
      { id: 'name', label: 'Name' },
      { id: 'type', label: 'Type' },
      { id: 'defautValue', label: 'Default Value' },
      { id: 'description', label: 'Description' },
    ],
  }
}

export const GroupListInput = {
  opr: "0",
  order_by: "1",
  sort_order: "A",
  last_index: "5",
  last_value: "",
  prefix: "",
  no_of_records_to_fetch: "5"
};

export const AddOtherAppInput = {
  opr: "",
  tab_id: "",
  instance_type: "E",
  container_id: "",
  report_instance_name: "",
  app_url: "",
  input_fields: [
    {
      sys_var_name: "SessionId",
      alias: "UserIndex"
    },
  ]
};

export const applist = {
  "data": {
    "apps": [{
      "app_id": "3",
      "app_name": "BAM",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": false,
      "app_context": "bam",
      "app_location": "1",
      "default": "Y"
    },
    {
      "app_id": "1001",
      "app_name": "BRMS",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": false,
      "app_context": "brms",
      "app_location": "1",
      "default": "Y"
    },
    {
      "app_id": "6",
      "app_name": "Group Chat",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": false,
      "app_context": "chat",
      "app_location": "1",
      "default": "Y"
    },
    {
      "app_id": "7",
      "app_name": "MDM",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": "N",
      "app_context": "mdm",
      "app_location": "1",
      "default": "Y"
    },
    {
      "app_id": "4",
      "app_name": "Omniforms",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": false,
      "app_context": "omniforms",
      "app_location": "1",
      "default": "Y"
    },
    {
      "app_id": "8",
      "app_name": "OTMS",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": false,
      "app_context": "otms",
      "app_location": "1",
      "default": "Y"
    },
    {
      "app_id": "1",
      "app_name": "Process Modeler",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": false,
      "app_context": "pmweb",
      "app_location": "1",
      "default": "Y"
    },
    {
      "app_id": "5",
      "app_name": "Rights Management",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": true,
      "app_context": "orm",
      "app_location": "1",
      "default": "Y"
    },
    {
      "app_id": "2",
      "app_name": "Webdesktop",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": false,
      "app_context": "webdesktop",
      "app_location": "1",
      "default": "Y"
    },
    {
      "app_id": "245",
      "app_name": "Test Pagination 1",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": false,
      "app_context": "Test Pagination",
      "app_location": "1",
      "default": "Y"
    },
    {
      "app_id": "245",
      "app_name": "Test Pagination 2",
      "app_domain": "",
      "app_port": "0",
      "ssl_secured": false,
      "app_context": "Test Pagination",
      "app_location": "1",
      "default": "Y"
    }
    ]
  },
  "status": {
    "maincode": "0",
    "suberrorcode": "0",
    "subject": "",
    "description": "",
    "errormsg": ""
  }
}

export const extapplist = {
  "data": {
    "apps": [
      {
        "app_id": "1",
        "app_name": "Google",
        "app_type": "",
        "app_url": "https://www.goibibo.com/",
        "app_sys_var": "Y"
      },
      {
        "app_id": "2",
        "app_name": "facebook",
        "app_type": "",
        "app_url": "https://www.facebook.com/",
        "app_sys_var": "N"
      },
      {
        "app_id": "3",
        "app_name": "Instagram",
        "app_type": "",
        "app_url": "https://www.Instagram.com/",
        "app_sys_var": "N"
      },
      {
        "app_id": "4",
        "app_name": "omnidesk",
        "app_type": "",
        "app_url": "https://omnidesk.newgen.co.in/home",
        "app_sys_var": "Y"
      }
    ]
  },
  "status": {
    "maincode": "0",
    "suberrorcode": "0",
    "subject": "",
    "description": "",
    "errormsg": ""
  }
}

export const omniappAuditLogs = {
  "data": {
    "history_items": [
      {
        "history_id": "4338",
        "object_id": "1025",
        "description": "User 'vkp' logged in on cabinet 'ibps5sp1p2[192.168.60.164]'",
        "date": "01/Jan/2021 02:08:05"
      },
      {
        "history_id": "4339",
        "object_id": "1025",
        "description": "User 'vkp' logged in on cabinet 'ibps5sp1p2[192.168.60.164]'",
        "date": "01/Jan/2021 09:28:07"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
      {
        "history_id": "4340",
        "object_id": "1023",
        "description": "User 'niraj' logged in on cabinet 'ibps5sp1p2[192.168.57.63]'",
        "date": "01/Jan/2021 09:41:45"
      },
    ],
    "first_history_id": "4338",
    "first_object_id": "1025",
    "last_history_id": "4340",
    "last_object_id": "1023",
    "enable_next": true,
    "enable_prev": false
  },
  "status": {
    "maincode": "0",
    "suberrorcode": "0",
    "subject": "",
    "description": "",
    "errormsg": ""
  }
}

export const AlertListInput = {
  "opr": "0",
  "order_by": "A",
  "last_index": "",
  "last_value": ""
}

export const GetSchedulerActionInput =
{
  "opr": "0",
  "scheduler_list": [],
  "scheduler_property": {
    "scheduler_title": "",
    "scheduler_id": null,
    "user_id": "",
    "description": "",
    "created_date_time": "",
    "scheduler_status": "",
    "scheduler_state": "",
    "start_date_time": "",
    "next_run_time": ""
  },
  "scheduler_type": "RS",
  "report_instance_list": [

  ],

  "deleted_report_instances": [],
  "file_option": "",
  "split_size": "128",
  "output_format": "CSV",
  "retry_interval": "0",
  "no_of_trials": "0",
  "recurrence": {
    "occurrence": "D",
    "time_gap": "1",
    "days": "A",
    "hour_gap": "",
    "hours": "15",
    "minutes": "12",
    "start_hour": "",
    "start_minute": "",
    "end_hour": "",
    "end_minute": "",
    "start_date": moment(new Date()).format("YYYY-MM-DD"),
    "end_date": "",
    "week": "",
    "week_days": "",
    "month": "",
    "description": "Occurs once on"
  },
  "destination": {
    "destination_type": "1",
    "folder_location": "",
    "drive_location": "",
    "from": "",
    "to": "",
    "cc": "",
    "subject": "",
    "message": ""
  }
}
export const GetCustomFilterInput = {
  "opr": 0,
  "report_id": "",
  "report_instance_id": "",
  "dashboard_id": "",
  "tab_id": "",
  "filter_name": "",
  "pinned": false,
  "is_local": false,
  "object_type": "RCF",
  "report_input_fields": []
}


export const ActReportInstanceInput = {
  "opr": "0",
  "tab_id": "",
  "instance_type": "R",
  "container_id": "",
  "report_instance_name": "",
  "report_id": "",
  "default_display": "T",
  "refresh_interval": "",
  "alert_delay_interval": "",
  "is_rule_defined": true,
  "input_fields": [],
  "rules": []
}
export const GetWDQueueList = {
  my_queue: "Y",
  auth_queue: "N",
  all_queue: "N",
  list_type: "QL",
  open_for: "PM",
  opr: 0,
  process_def_id: "",
  user_id: "",
  sort_order: "A",
  last_queue_id: "",
  last_queue_name: "",
  orderby: "2",
  queue_filter: ""
}
export const GetWDWorkItemList = {
  opr: "0",
  option: "1",
  process_def_id: "",
  queue_type: "",
  queue_id: "",
  queue_reassign:false,
  order_by: "2",
  sort_order: "A",
  last_value: "",
  last_pid: "",
  last_wid: "",
  batch_num: "0",
  client_sorting: false,
  mode: "PM",
  search: false,
  filter: {
    search_flag:"",
    search_prefix: "",
    search_prev_version: true,
    queue_id: "",
    process_def_id: "",
    process_name:"",
    search_attributes: [{
      operator: "3",
      join_condition: "AND",
      var_alias: "",
      type:"",
      value: ""
    }]
  },

}
export const categories = [
  {
    "id": "1",
    "name": "Retail Banking",
    "description": "New description",
    "count": "8"
  },
  {
    "id": "2",
    "name": "Expense Reporting",
    "description": "New description",
    "count": "9"
  },
  {
    "id": "3",
    "name": "Departmental Approval",
    "description": "New description",
    "count": "5"
  },
  {
    "id": "4",
    "name": "Expense Authorization",
    "description": "New description",
    "count": "2"
  },
  {
    "id": "5",
    "name": "Corporate Reporting",
    "description": "New description",
    "count": "1"
  },
  {
    "id": "6",
    "name": "Trade & Finance",
    "description": "New description",
    "count": "4"
  }
];