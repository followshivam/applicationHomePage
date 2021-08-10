import React from 'react'

function HomeScreen() {
    return (
        <div style={{display:"flex",flexDirection:"column", padding:"15px 5px",width:"100%"}}>
                       
                <DashboardTile
                    tileList={tilesDataArr}
                    direction={`${t('bam:HTML_DIR')}`}
                    width={'180pt'}/>

                <div>
                    {/* <NotFound />
                    
                    <EmptyHome /> */}
                </div>    

                <Pinned
                    pinnedData={pinnedData}
                    headerData={HeadCells}
                    action={Action}
                    defaultView={'tile'}
                    direction={`${t('bam:HTML_DIR')}`}
                    loading={false}
                    height={'67pt'}
                    width={'180pt'}
                    imageInfo={{
                    path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
                    ext: '.svg'
                }}
                    label={{
                    heading: `${t('bam:Pinned')}`,
                    viewLess: `${t('bam:View Less')}`,
                    viewAll: `${t('bam:View All')}`,
                    last_modified: `${t('bam:Last Modified')}`,
                    lastOpened:`${t('bam:Last Opened')}`
                }}/>

                <RecentActivity
                    headerData={RecentHeadCells}
                    recentList={listData}
                    loading={false}
                    isSearch={true}
                    direction={`${t('bam:HTML_DIR')}`}
                    heading={`${t('bam:Recents')}`}
                    searchProps={{
                    searchingKey: 'name',
                    placeholder: `${t('bam:TITLE_SEARCH')}`,
                    regex: null
                }}
                    imageInfo={{
                    path: `${process.env.REACT_APP_CONTEXT_PATH}/icons/`,
                    ext: '.svg'
                }}/>

            </div>
    )
}

export default HomeScreen
