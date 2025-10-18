import { sleep } from '~utils';

type rulesType = {
    open?: boolean;
    url?: string;
    requestHeaders: { open?: boolean; path?: string; header?: string; value?: string }[];
};
export type ruleDataType = { rules?: rulesType[] };

const getRules = () => {
    return new Promise<chrome.declarativeNetRequest.Rule[]>((resolve) => {
        chrome.declarativeNetRequest.getDynamicRules((rules) => {
            resolve(rules);
        });
    });
};

// 所有类型都用
const resourceTypes = Object.keys(chrome.declarativeNetRequest.ResourceType).map(
    (key) => chrome.declarativeNetRequest.ResourceType[key]
);

const clearRules = async () => {
    // 清理调试时候会有缓存问题
    const rules = await getRules();
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map((item) => item.id),
    });
};

const init = async (ruleData: ruleDataType) => {
    await clearRules();
    const { rules = [] } = ruleData;

    const list: chrome.declarativeNetRequest.UpdateRuleOptions['addRules'] = [];
    const ss = rules.filter(
        (item) =>
            item.open &&
            item.url &&
            item.requestHeaders.filter((item2) => item.open && !!item2.header && !!item2.value).length > 0
    );
    console.log('22', ss);
    ss.forEach((item, index) => {
        item.requestHeaders.map((item2, index2) => {
            list.push({
                id: list.length + 1,
                priority: list.length + 1,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType['MODIFY_HEADERS'],
                    requestHeaders: [
                        {
                            operation: chrome.declarativeNetRequest.HeaderOperation['SET'],
                            header: item2.header as string,
                            value: item2.value,
                        },
                    ],
                },
                condition: {
                    urlFilter: `${item.url}${item2.path || ''}`,
                    resourceTypes: resourceTypes,
                },
            });
        });
    });
    console.log(JSON.stringify(list, null, 2));
    // 添加规则
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: list,
    });
    await sleep(30);
    const rules2 = await getRules();
    // console.log('rules22', rules2);
};

const getData = (str = '') => {
    const ruleData: ruleDataType = JSON.parse(str) || {};
    // console.log('ruleData22', ruleData);
    init(ruleData);
};

// 取值
chrome.storage.sync.get(['ruleData'], (result) => {
    if (result.ruleData) {
        getData(result.ruleData);
    }
});

// 监听配置变化
chrome.storage.onChanged.addListener((changes) => {
    if (changes.ruleData) {
        getData(changes.ruleData.newValue);
    }
});
