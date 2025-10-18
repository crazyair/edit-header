import { Card, ConfigProvider, Flex, Form, Input, Modal, Radio, Select, Switch } from 'antd';

import { useStorage } from '@plasmohq/storage/hook';

import RulesForm from '~components/RulesForm';

import '~/index.less';

import { SettingOutlined, SwapLeftOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import { useState } from 'react';

import type { ruleDataType } from '~background';

export type settingsType = { open?: boolean; header?: string; valueType?: number };

function IndexPopup() {
    const [ruleData = {}, setRuleData, { isLoading }] = useStorage<ruleDataType>('ruleData');
    const [open, setOpen] = useState(false);
    const [settings = {}, setSettings] = useStorage<settingsType>('settings', { open: true });

    return (
        <ConfigProvider locale={zhCN}>
            <Card
                title="edit-header"
                size="small"
                style={{ width: 600 }}
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
                    <RulesForm settings={settings} ruleData={ruleData} onChange={(data) => setRuleData(data)} />
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
                    <Form.Item label="默认 header" name="header">
                        <Input />
                    </Form.Item>
                    <Form.Item label="value 格式化" name="valueType">
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
