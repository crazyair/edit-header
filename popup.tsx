import { Card, ConfigProvider, Form, Input, Modal } from 'antd';

import { useStorage } from '@plasmohq/storage/hook';

import RulesForm from '~components/RulesForm';

import '~/index.less';

import { SettingOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import { useState } from 'react';

import type { ruleDataType } from '~background';

export type settingType = { header?: string };

function IndexPopup() {
    const [ruleData = {}, setRuleData, { isLoading }] = useStorage<ruleDataType>('ruleData');
    const [open, setOpen] = useState(false);
    const [setting = {}, setSetting] = useStorage<settingType>('setting');

    return (
        <ConfigProvider locale={zhCN}>
            <Card
                title="edit-header"
                size="small"
                style={{ width: 600 }}
                extra={
                    <div onClick={() => setOpen(true)}>
                        <SettingOutlined />
                    </div>
                }
            >
                {!isLoading && (
                    <RulesForm setting={setting} ruleData={ruleData} onChange={(data) => setRuleData(data)} />
                )}
                <Modal
                    title="设置"
                    open={open}
                    onCancel={() => setOpen(false)}
                    destroyOnHidden
                    modalRender={(node) => (
                        <Form
                            layout="vertical"
                            initialValues={setting}
                            onFinish={(values) => {
                                setSetting(values);
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
                </Modal>
            </Card>
        </ConfigProvider>
    );
}

export default IndexPopup;
