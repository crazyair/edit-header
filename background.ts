import { sleep } from '~utils';

type HeaderType = { header?: string; value?: string };
// 从存储加载配置
let headersConfig: HeaderType[] = [];
let urlPatterns = ['<all_urls>'];

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

const init = async (headers: HeaderType[]) => {
    // 清理调试时候会有缓存问题
    const rules = await getRules();
    console.log('rules', rules);
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map((item) => item.id),
    });

    // 添加规则
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
            {
                id: 1,
                priority: 1,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType['MODIFY_HEADERS'],
                    requestHeaders: headers.map((item) => ({
                        operation: chrome.declarativeNetRequest.HeaderOperation['SET'],
                        header: item.header,
                        value: item.value,
                    })),
                },
                condition: {
                    // urlFilter: '*',
                    resourceTypes: resourceTypes,
                },
            },
        ],
    });
    await sleep(30);
    const rules2 = await getRules();
    console.log('rules22', rules2);
};

// 取值
chrome.storage.sync.get(['headers', 'urlPatterns'], (result) => {
    headersConfig = JSON.parse(result.headers) || [];
    urlPatterns = result.urlPatterns || ['<all_urls>'];
    init(headersConfig);
});

// 监听配置变化
chrome.storage.onChanged.addListener((changes) => {
    if (changes.headers) headersConfig = JSON.parse(changes.headers.newValue) || [];
    if (changes.urlPatterns) urlPatterns = changes.urlPatterns.newValue || ['<all_urls>'];
    init(headersConfig);
});
