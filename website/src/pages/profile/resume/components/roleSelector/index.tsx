import { PlusOutlined } from '@ant-design/icons'
import Button from 'antd/es/button'
import Input, { InputRef } from 'antd/es/input'
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
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setLoading(true);
    await handleCreateResumeRole()
    await fetchProjectRole()
    setLoading(false);
    setTimeout(() => {
      setName('');
      inputRef.current?.focus();
    }, 0);
  };

  const fetchProjectRole = () => {
    getResumeRoles({query: ''}).then((res) => {
      if (res) {
        setOptionsRole(res?.items.map((item) => ({value: item.name, label: item.name})));
      }
    });
  }

  const handleCreateResumeRole = async () => {
    await createResumeRole({
      name,
      description: name
    })
  }

  const handleChange = (val: string) => {
    setValue(val)
    if (onChange) {
      onChange(val)
    }
  }

  // 获取角色列表
  useEffect(() => {
    fetchProjectRole();
  }, [])

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
          <Space style={{ padding: '8px 8px 4px' }}>
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
            />
            <Button type="text" loading={loading} icon={<PlusOutlined />} onClick={addItem} className="frc-center">
              Add Role
            </Button>
          </Space>
        </>
      )}
    />
  )
}

export default RoleSelector
