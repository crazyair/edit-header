import { Storage } from '@plasmohq/storage';

type rulesType = {
  open?: boolean;
  header?: string;
  value?: string;
  list: { open?: boolean; url?: string }[];
};
export type ruleDataType = { rules?: rulesType[] };

export type settingsType = { open?: boolean; header?: string; valueType?: number };

// 所有类型都用
const resourceTypes = Object.keys(chrome.declarativeNetRequest.ResourceType).map((key) => chrome.declarativeNetRequest.ResourceType[key]);

const getRules = () => {
  return new Promise<chrome.declarativeNetRequest.Rule[]>((resolve) => {
    chrome.declarativeNetRequest.getDynamicRules((rules) => resolve(rules));
  });
};

const clearRules = async () => {
  // 清理调试时候会有缓存问题
  const rules = await getRules();
  chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: rules.map((item) => item.id) });
};

const storage = new Storage();

const init = async () => {
  // 清理配置（开发模式，热更新会有 id 已存在的报错）
  await clearRules();

  const settings = (await storage.get<settingsType>('settings')) || {};
  const ruleData = (await storage.get<ruleDataType>('ruleData')) || {};
  const { rules = [] } = ruleData;

  const list: chrome.declarativeNetRequest.UpdateRuleOptions['addRules'] = [];
  if (settings?.open) {
    rules.forEach((item) => {
      if (item.open && item.header && item.value) {
        item.list.forEach((item2) => {
          if (item2.open && item2.url) {
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
          }
        });
      }
    });
  }
  console.log('配置');
  console.log(JSON.stringify(list, null, 2));
  // 添加规则
  chrome.declarativeNetRequest.updateDynamicRules({ addRules: list });
};

// 取值
init();

// 监听配置变化
chrome.storage.onChanged.addListener((changes) => {
  if (changes.ruleData || changes.settings) {
    init();
  }
});
