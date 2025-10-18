import { Storage } from '@plasmohq/storage';

import type { settingsType } from '~popup';
import { sleep } from '~utils';

type rulesType = {
    open?: boolean;
    header?: string;
    value?: string;
    requestHeaders: { open?: boolean; url?: string }[];
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

const storage = new Storage();

const init = async () => {
    await clearRules();

    const settings = (await storage.get<settingsType>('settings')) || {};
    const ruleData = (await storage.get<ruleDataType>('ruleData')) || {};
    const { rules = [] } = ruleData;

    const list: chrome.declarativeNetRequest.UpdateRuleOptions['addRules'] = [];
    const filterRules = rules.filter((item) => {
        return (
            settings?.open &&
            item.open &&
            item.header &&
            item.value &&
            item.requestHeaders.filter((item2) => item.open && !!item2.url).length > 0
        );
    });
    filterRules.forEach((item, index) => {
        item.requestHeaders.map((item2, index2) => {
            const { header = '' } = item;
            let value = item.value;
            if (settings?.valueType === 1) {
                value = value?.toLowerCase();
            } else if (settings?.valueType === 2) {
                value = value?.toUpperCase();
            }
            list.push({
                id: list.length + 1,
                priority: list.length + 1,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType['MODIFY_HEADERS'],
                    requestHeaders: [{ operation: chrome.declarativeNetRequest.HeaderOperation['SET'], header, value }],
                },
                condition: { urlFilter: item2.url, resourceTypes: resourceTypes },
            });
        });
    });
    console.log(JSON.stringify(list, null, 2));
    // 添加规则
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: list,
    });
    // await sleep(30);
    // const rules2 = await getRules();
    // console.log('rules22', rules2);
};

// 取值
chrome.storage.sync.get(['ruleData', 'settings'], (result) => {
    if (result.ruleData) {
        init();
    }
});

// 监听配置变化
chrome.storage.onChanged.addListener((changes) => {
    if (changes.ruleData || changes.settings) {
        init();
    }
});
