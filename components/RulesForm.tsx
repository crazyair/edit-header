import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input, Space, Switch } from 'antd';

import type { ruleDataType } from '~background';
import type { settingType } from '~popup';

const ChildrenForm = ({ name = 0, setting }: { name?: number; setting: settingType }) => {
    return (
        <Form.List name={[name, 'requestHeaders']}>
            {(fields, { add, remove }) => (
                <div>
                    {fields.map(({ key, name }) => (
                        <Flex key={key} vertical gap={8}>
                            <Flex style={{ marginBottom: 8 }} gap={8} align="center">
                                <Form.Item name={[name, 'path']} noStyle>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={[name, 'header']} noStyle>
                                    <Input />
                                </Form.Item>
                                <Form.Item name={[name, 'value']} noStyle>
                                    <Input />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                            </Flex>
                        </Flex>
                    ))}
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add({ open: true, header: setting.header })}
                            icon={<PlusOutlined />}
                        >
                            Add config
                        </Button>
                    </Form.Item>
                </div>
            )}
        </Form.List>
    );
};

const RulesForm = ({
    setting,
    ruleData,
    onChange,
}: {
    setting: settingType;
    ruleData: ruleDataType;
    onChange: (data: ruleDataType) => void;
}) => {
    const [form] = Form.useForm();

    return (
        <Form form={form} initialValues={ruleData} onValuesChange={(_, values) => onChange(values)}>
            <Form.List name="rules">
                {(fields, { add, remove }) => (
                    <Flex vertical gap={8}>
                        {fields.map(({ key, name }) => (
                            <Card
                                key={key}
                                title={
                                    <Flex gap={8} align="center">
                                        <Form.Item name={[name, 'url']} noStyle>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name={[name, 'open']} noStyle>
                                            <Switch size="small" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Flex>
                                }
                                size="small"
                            >
                                <ChildrenForm name={name} setting={setting} />
                            </Card>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() => add({ open: true, requestHeaders: [{ open: true }] })}
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
