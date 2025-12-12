import { LinkOutlined, MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, ConfigProvider, Flex, Form, Input, Switch, Tooltip } from 'antd';
import { useEffect, useState } from 'react';

import type { ruleDataType, rulesType, settingsType } from '~background';

const ChildrenForm = ({ name = 0, origin }: { name?: number; origin: string }) => {
  return (
    <Form.List name={[name, 'list']}>
      {(fields, { add, remove }) => {
        const addDom = <PlusCircleOutlined onClick={() => add({ open: true, url: origin })} />;
        return (
          <Flex vertical gap={8}>
            {fields.map(({ key, name }) => (
              <Flex key={key} vertical gap={8}>
                <Flex gap={8} align="center">
                  <Form.Item name={[name, 'url']} noStyle>
                    <Input placeholder="url" />
                  </Form.Item>
                  <Form.Item name={[name, 'open']} noStyle>
                    <Switch size="small" />
                  </Form.Item>
                  {fields.length === name + 1 && addDom}
                  {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
                </Flex>
              </Flex>
            ))}
            {fields.length === 0 && addDom}
          </Flex>
        );
      }}
    </Form.List>
  );
};

const MainForm = ({
  name = 0,
  remove,
  origin,
  settings,
}: {
  remove: (index: number | number[]) => void;
  name?: number;
  origin: string;
  settings: settingsType;
}) => {
  const { jiraDomain } = settings;
  const item = Form.useWatch<rulesType | undefined>(['rules', name]);
  const disabled = !item?.list.some((item) => item.url?.includes(origin));
  const value = Form.useWatch(['rules', name, 'value']) || '';

  let dom = (
    <Flex vertical gap={8}>
      <Flex gap={8} align="center">
        <Form.Item name={[name, 'header']} noStyle>
          <Input placeholder="header" />
        </Form.Item>
        <Form.Item name={[name, 'value']} noStyle>
          <Input
            placeholder="value"
            addonAfter={
              <LinkOutlined
                title="跳转"
                onClick={() => {
                  const match = value.match(/^[A-Z]+-[0-9]+/);
                  const matchValue = match ? match[0].toUpperCase() : '';
                  window.open(`${jiraDomain}/browse/${matchValue}`);
                }}
              />
            }
          />
        </Form.Item>
        <Form.Item name={[name, 'open']} noStyle>
          <Switch size="small" />
        </Form.Item>
        <MinusCircleOutlined onClick={() => remove(name)} />
      </Flex>
      <div style={{ paddingLeft: 24 }}>
        <ChildrenForm name={name} origin={origin} />
      </div>
    </Flex>
  );
  if (disabled) {
    dom = <Tooltip title="当前页面不适用此规则">{dom}</Tooltip>;
  }
  return <ConfigProvider componentDisabled={disabled}>{dom}</ConfigProvider>;
};

const RulesForm = ({ settings, ruleData, onChange }: { settings: settingsType; ruleData: ruleDataType; onChange: (data: ruleDataType) => void }) => {
  const [form] = Form.useForm();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab.url) {
        const data = new URL(tab.url || '');
        setOrigin(data.origin || '');
      }
    });
  }, []);

  return (
    <Form form={form} initialValues={ruleData} onValuesChange={(_, values) => onChange(values)}>
      <Form.List name="rules">
        {(fields, { add, remove }) => (
          <Flex vertical gap={8}>
            {fields.map(({ key, name }) => (
              <MainForm key={key} name={name} remove={remove} origin={origin} settings={settings} />
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={async () => {
                  const text = await navigator.clipboard.readText();
                  // 如果输入的文本是 Jira 格式，就使用 Jira 格式，否则使用空字符串
                  const match = text.match(/^[A-Z]+-[0-9]+/);
                  const value = match ? text : '';
                  add({ open: true, header: settings.header, value, list: [{ open: true, url: origin }] });
                }}
                block
                icon={<PlusOutlined />}
              >
                Add rule
              </Button>
            </Form.Item>
          </Flex>
        )}
      </Form.List>
    </Form>
  );
};

export default RulesForm;
