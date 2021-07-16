import React, { useEffect, useState } from "react";
import { StyledTab } from "component";
import { CreateSchedule } from "redux/action";
import { useDispatch, useSelector } from "react-redux";


const ReportPref = React.lazy(() => import("./report_pref"));
const RuleManagement = React.lazy(() => import("./rule_management"));
;

const SelectReportManagement = props => {
  const { t = null } = props
  const tabsList = [
    {
      label: `${t('bam:REPORT_MANAGEMENT')}`,
      index: 0,
      component: ReportPref
    },
    {
      label: `${t('bam:RULE_MANAGEMENT')}`,
      index: 1,
      component: RuleManagement
    },
  ];
  const dispatch = useDispatch();
  const createScheduleState = useSelector(store => store.createScheduleState);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (createScheduleState.activeTab === 0) {
      setActiveTab(0);
    }
  }, [createScheduleState]);

  const handleTabChange = val => {
    if (val === 1) {
      setActiveTab(1);
    }
    else {
      dispatch(CreateSchedule({ ...createScheduleState, activeTab: 1 }));
    }
  }

  return (
    <div >
      <StyledTab
        tabsArray={tabsList}
        container={true}
        tabHeight={'40px'}
        parentHandled
        activeTab={activeTab}
        changeTabHandler={val => handleTabChange(val)}
      />
    </div>
  );
}

export default SelectReportManagement;