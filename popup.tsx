import { Card } from 'antd';

// import { useStorage } from '@plasmohq/storage/hook';

// import '~/index.less';

// import { useEffect, useState } from 'react';

// import RulesForm from '~src/RulesForm';

function IndexPopup() {
    // const [isInit, setIsInit] = useState(false);
    // const [ruleData, setRuleData] = useStorage('ruleData', {});

    // useEffect(() => {
    //     setTimeout(() => {
    //         setIsInit(true);
    //     }, 1000);
    // }, []);

    return (
        <Card title="edit-header231" size="small" style={{ width: 600 }}>
            1122
            {/* <div className="demo">{JSON.stringify(ruleData)}</div> */}
            {/* {JSON.stringify({ isInit })}
            {isInit && <RulesForm ruleData={ruleData} setRuleData={setRuleData} />} */}
        </Card>
    );
}

export default IndexPopup;
