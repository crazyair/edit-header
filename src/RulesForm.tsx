import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Input, Space } from 'antd';

const RulesForm = ({ ruleData, setRuleData }: { ruleData: any; setRuleData: any }) => {
    const [form] = Form.useForm();

    return (
        <Form form={form} initialValues={ruleData} onValuesChange={(_, values) => setRuleData(values)}>
            <Form.List name="rules">
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name }) => (
                            <Flex key={key} vertical gap={4}>
                                <Flex>
                                    <Form.Item name={[name, 'url']} noStyle>
                                        <Input placeholder="url" />
                                    </Form.Item>
                                </Flex>
                                <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                    <Form.Item name={[name, 'first']} noStyle>
                                        <Input placeholder="First Name" />
                                    </Form.Item>
                                    <Form.Item name={[name, 'last']} noStyle>
                                        <Input placeholder="Last Name" />
                                    </Form.Item>
                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                </Space>
                            </Flex>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add field
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        </Form>
    );
};

export default RulesForm;
