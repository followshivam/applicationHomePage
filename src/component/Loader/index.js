import React from 'react';
import ContentLoader from "react-content-loader";
import { CircularProgress, useTranslation } from 'component'
import style from './style.module.css';
import { useSelector } from "react-redux";
export const Spinner = (props) => {
  const [globalSetting] = useSelector(state => {
    return [state.globalSettings];
  });

  const { t } = useTranslation(globalSetting.locale_module ? globalSetting.locale_module : ["bam", "omniapp"])


  const { msg = `${t('bam:LOADING')}...` } = props
  return (<div className={style.loader}> <CircularProgress />{msg}</div>)
}
export const IconLoader = (props) => {
  return (<ContentLoader>
    <rect x="0" y="55" rx="5" ry="5" width="20" height="30" />


  </ContentLoader>)
}
