import { PlusOutlined } from '@ant-design/icons'
import Button from 'antd/es/button'
import Form from 'antd/es/form'
import type { InputRef } from 'antd/es/input';
import Input from 'antd/es/input'
import Select from 'antd/es/select'
import Space from 'antd/es/space'
import { useEffect, useRef, useState } from 'react'
import { createResumeRole, getResumeRoles } from '~/api/booth/resume'

type RoleSelectorProps = {
  defaultValue?: string
  onChange?: (value: string) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = (props) => {
  const { defaultValue, onChange } = props
  const [value, setValue] = useState(defaultValue || '')
  const [optionsRole, setOptionsRole] = useState<{value: string}[]>([])
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const [form] = Form.useForm();

  const fetchProjectRole = () => {
    getResumeRoles({query: ''}).then((res) => {
      if (res) {
        setOptionsRole(res?.items.map((item) => ({value: item.name, label: item.name})));
      }
    });
  }

  const handleCreateResumeRole = async (name: string) => {
    await createResumeRole({
      name,
      description: name,
    })
  }

  const handleChange = (val: string) => {
    setValue(val)
    if (onChange) {
      onChange(val)
    }
  }

  const onFinish = async (values: any) => {
    setLoading(true);
    await handleCreateResumeRole(values.name)
    await fetchProjectRole()
    form.resetFields();
    setLoading(false);
  };

  // 获取角色列表
  useEffect(() => {
    fetchProjectRole();
  }, [])

  useEffect(() => {
    setValue(defaultValue || '')
  }, [defaultValue])

  return (
    <Select
      showArrow
      style={{ width: '100%' }}
      value={value}
      options={optionsRole}
      placeholder="Please select your role"
      onChange={handleChange}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Space style={{ padding: 8 }}>
            <Form
              form={form}
              layout="inline"
              name="role-manage"
              onFinish={onFinish}
            >
              <Form.Item name="name" rules={[{ required: true, message: 'Please input role name!' }]}>
                <Input
                  placeholder="Please enter item"
                  ref={inputRef}
                />
              </Form.Item>
              <Form.Item >
                <Button type="text" htmlType="submit" loading={loading} icon={<PlusOutlined />} className="frc-center">
                  Add Role
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </>
      )}
    />
  )
}

export default RoleSelector
