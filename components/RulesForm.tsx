import { MinusCircleOutlined, PlusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input, Switch } from 'antd';

import type { ruleDataType, settingsType } from '~background';

const ChildrenForm = ({ name = 0 }: { name?: number }) => {
  return (
    <Form.List name={[name, 'list']}>
      {(fields, { add, remove }) => {
        const addDom = <PlusCircleOutlined onClick={() => add({ open: true })} />;
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

const RulesForm = ({ settings, ruleData, onChange }: { settings: settingsType; ruleData: ruleDataType; onChange: (data: ruleDataType) => void }) => {
  const [form] = Form.useForm();

  return (
    <Form form={form} initialValues={ruleData} onValuesChange={(_, values) => onChange(values)}>
      <Form.List name="rules">
        {(fields, { add, remove }) => (
          <Flex vertical gap={8}>
            {fields.map(({ key, name }) => (
              <Card key={key} size="small">
                <Flex vertical gap={8}>
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
                  <ChildrenForm name={name} />
                </Flex>
              </Card>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add({ open: true, header: settings.header, list: [{ open: true }] })} block icon={<PlusOutlined />}>
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
