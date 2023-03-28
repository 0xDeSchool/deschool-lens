import { PlusOutlined } from '@ant-design/icons';
import Avatar from 'antd/es/avatar';
import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import Modal from 'antd/es/modal';
import Select from 'antd/es/select'
import { useEffect, useRef, useState } from 'react';
import { useAccount } from '~/account';
import { createResumeProject, getResumeProjects } from '~/api/booth/resume';
import type { ResumeProject } from '~/api/booth/types';
import UploadPicture from '~/components/uploadImage/uploadPicture';

type ProjectSelectorProps = {
  defaultValue?: ResumeProject;
  onChange?: (value: ResumeProject) => void;
}
const ProjectSelector: React.FC<ProjectSelectorProps> = (props) => {
  const { defaultValue, onChange } = props;
  const [items, setItems] = useState<ResumeProject[]>([]);
  const [value, setValue] = useState<string | null>(defaultValue?.name || null);
  const [open, setOpen] = useState(false)
  const [isAddProject, setIsAddProject] = useState(false)
  const formRef = useRef(null)
  const [form] = Form.useForm()
  const user = useAccount()

  // 获取项目列表
  const fetchResumeProject = async () => {
    const res = await getResumeProjects({query: ''})
    setItems(res.items)
  }

  const handleSelect = (val: ResumeProject) => {
    setValue(val.name)
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
    await createResumeProject(params)
    await fetchResumeProject()
    // setItems()
    setIsAddProject(false)
    // 刷新项目列表数据
  }

  const handleCancel = () => {
    setIsAddProject(false)
  }

  useEffect(() => {
    fetchResumeProject()
  }, [])

  useEffect(() => {
    setValue(defaultValue?.name || null)
  }, [defaultValue])

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
            {items.map((item) => (<div key={item.name} className='frc-start py-2 px-2 border-b-1 cursor-pointer' onClick={() => handleSelect(item)}>
                  <Avatar src={item.icon} />
                  <span className='ml-3'>{item.name}</span>
                </div>))}
            <Button type="text" icon={<PlusOutlined />} onClick={() => setIsAddProject(true)} className="frc-center mx-auto my-2">
              Create project
            </Button>
          </>
        )}
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
                  albumname="booth/icon"
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
