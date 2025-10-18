import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input, Space, Switch } from 'antd';

import type { ruleDataType } from '~background';
import type { settingsType } from '~popup';

const ChildrenForm = ({ name = 0 }: { name?: number }) => {
    return (
        <Form.List name={[name, 'requestHeaders']}>
            {(fields, { add, remove }) => (
                <div>
                    {fields.map(({ key, name }) => (
                        <Flex key={key} vertical gap={8}>
                            <Flex style={{ marginBottom: 8 }} gap={8} align="center">
                                <Form.Item name={[name, 'url']} noStyle>
                                    <Input placeholder="url" />
                                </Form.Item>
                                <Form.Item name={[name, 'open']} noStyle>
                                    <Switch size="small" />
                                </Form.Item>
                                <MinusCircleOutlined onClick={() => remove(name)} />
                                {fields.length === name + 1 && (
                                    <Button type="dashed" onClick={() => add({ open: true })} icon={<PlusOutlined />}>
                                        Add url
                                    </Button>
                                )}
                            </Flex>
                        </Flex>
                    ))}
                </div>
            )}
        </Form.List>
    );
};

const RulesForm = ({
    settings,
    ruleData,
    onChange,
}: {
    settings: settingsType;
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
                                        <Form.Item name={[name, 'header']} noStyle>
                                            <Input placeholder="header" />
                                        </Form.Item>
                                        <Form.Item name={[name, 'value']} noStyle>
                                            <Input placeholder="value" />
                                        </Form.Item>
                                        <Form.Item name={[name, 'open']} noStyle>
                                            <Switch size="small" />
                                        </Form.Item>
                                        <MinusCircleOutlined onClick={() => remove(name)} />
                                    </Flex>
                                }
                                size="small"
                            >
                                <ChildrenForm name={name} />
                            </Card>
                        ))}
                        <Form.Item>
                            <Button
                                type="dashed"
                                onClick={() =>
                                    add({ open: true, header: settings.header, requestHeaders: [{ open: true }] })
                                }
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
