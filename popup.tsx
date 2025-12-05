import { Card, ConfigProvider, Flex, Form, Input, Modal, Select, Switch } from 'antd';

import { useStorage } from '@plasmohq/storage/hook';

import RulesForm from '~components/RulesForm';

import '~/index.less';

import { SettingOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import { useState } from 'react';

import type { ruleDataType, settingsType } from '~background';
import RulesForm2 from '~components/RulesForm2';

function IndexPopup() {
  const [ruleData = {}, setRuleData, { isLoading }] = useStorage<ruleDataType>('ruleData');
  const [settings = {}, setSettings] = useStorage<settingsType>('settings', { open: true, version: '1' });

  const [open, setOpen] = useState(false);

  return (
    <ConfigProvider locale={zhCN}>
      <Card
        title="edit-header"
        size="small"
        style={{ width: 600, minHeight: 500 }}
        extra={
          <Flex align="center" gap={20}>
            <Switch value={settings.open} onChange={(e) => setSettings((s) => ({ ...s, open: e }))} />
            <div onClick={() => setOpen(true)}>
              <SettingOutlined />
            </div>
          </Flex>
        }
      >
        {!isLoading && (
          <>
            {settings.version === '1' && <RulesForm settings={settings} ruleData={ruleData} onChange={(data) => setRuleData(data)} />}
            {settings.version === '2' && <RulesForm2 settings={settings} ruleData={ruleData} onChange={(data) => setRuleData(data)} />}
          </>
        )}
        <Modal
          title="设置"
          open={open}
          onCancel={() => setOpen(false)}
          destroyOnHidden
          modalRender={(node) => (
            <Form
              layout="vertical"
              initialValues={settings}
              onFinish={(values) => {
                setSettings(values);
                setOpen(false);
              }}
            >
              {node}
            </Form>
          )}
          okButtonProps={{ htmlType: 'submit' }}
        >
          <Form.Item noStyle name="open" />
          <Form.Item label="版本" name="version">
            <Select
              options={[
                { value: '1', label: '1' },
                { value: '2', label: '2' },
              ]}
            />
          </Form.Item>
          <Form.Item label="默认 header" name="header">
            <Input />
          </Form.Item>
          <Form.Item label="格式化 value" name="valueType">
            <Select
              options={[
                { value: 1, label: '小写' },
                { value: 2, label: '大写' },
              ]}
            />
          </Form.Item>
        </Modal>
      </Card>
    </ConfigProvider>
  );
}

export default IndexPopup;
