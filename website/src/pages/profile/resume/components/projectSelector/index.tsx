import { PlusOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Modal from 'antd/es/modal';
import Select from 'antd/es/select'
import { useRef, useState } from 'react';
import { useAccount } from '~/account';
import UploadPicture from '~/components/uploadImage/uploadPicture';
import { Project } from '../../types';
const optionsProject= [
  {
    name: 'DeSchool',
    icon: 'https://dechooltest.s3.amazonaws.com/fe/0xb3153C43D0c8eA42D329918aF53fB8eE76BA07F37fb22b18-38d6-4378-8478-bf4ad0837bc6.jpeg',
    url: '',
  },
  {
    name: 'Designer',
    icon: 'https://dechooltest.s3.amazonaws.com/fe/0xb3153C43D0c8eA42D329918aF53fB8eE76BA07F37fb22b18-38d6-4378-8478-bf4ad0837bc6.jpeg',
    url: '',
  },
];

type ProjectSelectorProps = {
  defaultValue?: string;
  onChange?: (value: string) => void;
}
const ProjectSelector: React.FC<ProjectSelectorProps> = (props) => {
  const { defaultValue, onChange } = props;
  const [items, setItems] = useState(optionsProject);
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false)
  const [isAddProject, setIsAddProject] = useState(false)
  const formRef = useRef(null)
  const [form] = Form.useForm()
  const user = useAccount()

  const handleSelect = (val: string) => {
    setValue(val)
    setOpen(false)
    if (onChange) {
      onChange(val)
    }
  }

  const checkValidateFields = async (): Promise<boolean> => {
    let valid = true
    try {
      await form.validateFields();
      valid = true
    } catch (errorInfo) {
      valid = false
    }
    return valid
  };

  // 创建新的项目
  const onSubmit = async () => {
    const valid = await checkValidateFields()
    if (!valid) {
      return
    }
    const params = {
      ...form.getFieldsValue(),
      icon: form.getFieldValue('icon')[0],
    }
    // setItems()
    setIsAddProject(false)
    // 刷新项目列表数据
  }

  const handleCancel = () => {
    setIsAddProject(false)
  }

  return (
    <>
      <Select
        open={open}
        value={value}
        onDropdownVisibleChange={(visible) => setOpen(visible)}
        style={{ width: '100%' }}
        placeholder="Search your projects"
        dropdownRender={() => (
          <>
            {items.map((item) => {
              return <div key={item.name} className='frc-start py-2 px-2 border-b-1 cursor-pointer' onClick={() => handleSelect(item.name)}>
                  <Avatar src={item.icon} />
                  <span className='ml-3'>{item.name}</span>
                </div>
            })}
            <Button type="text" icon={<PlusOutlined />} onClick={() => setIsAddProject(true)} className="frc-center mx-auto my-2">
              Create project
            </Button>
          </>
        )}
        options={items.map((item) => ({ label: item, value: item }))}
      />
      <Modal
        open={isAddProject}
        okText="Create"
        cancelText="Cancel"
        width={460}
        onOk={onSubmit}
        onCancel={handleCancel}
      >
        <div className='frc-center'>
          <Form
            ref={formRef}
            form={form}
            name="match"
            layout="vertical"
          >
              <Form.Item label="PROJECT NAME" name="name" rules={[{ required: true, message: 'Please input project name!' }]}>
                <Input style={{width: 300}} placeholder="Enter a name" />
              </Form.Item>
              <Form.Item label="PROJECT URL" name="url" rules={[{ required: true, message: 'Please input project website!' }]}>
                <Input placeholder="Enter a website" />
              </Form.Item>
              <Form.Item label="PROJECT ICON" name="icon" valuePropName="imageList" rules={[{ required: true, message: 'Please input project icon!' }]}>
                <UploadPicture
                  width={68}
                  height={68}
                  albumname={'project_icon'}
                  userId={user?.id}
                  onChange={() => {

                  }} />
              </Form.Item>
            </Form>
        </div>
      </Modal>
    </>
  )
}

export default ProjectSelector
