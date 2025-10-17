import { sleep } from '~utils';

const getRules = () => {
    return new Promise<chrome.declarativeNetRequest.Rule[]>(resolve => {
        chrome.declarativeNetRequest.getDynamicRules(rules => {
            resolve(rules);
        });
    });
};

const init = async () => {
    // 清理调试时候会有缓存问题
    const rules = await getRules();
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map(item => item.id),
    });
    // 添加规则
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
            {
                id: 1,
                priority: 1,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType['MODIFY_HEADERS'],
                    requestHeaders: [
                        {
                            operation: chrome.declarativeNetRequest.HeaderOperation['SET'],
                            header: 'X-Static-Header',
                            value: 'static-52',
                        },
                    ],
                },
                condition: {
                    // urlFilter: '*',
                    resourceTypes: [
                        chrome.declarativeNetRequest.ResourceType['MAIN_FRAME'],
                        chrome.declarativeNetRequest.ResourceType['SUB_FRAME'],
                    ],
                },
            },
        ],
    });
    await sleep(30);
    const rules2 = await getRules();
    console.log('rules2', rules2);
};

init();
