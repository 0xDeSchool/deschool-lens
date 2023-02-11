/**
 *
 */
import React, { useState } from 'react'
import Tabs from 'antd/es/tabs'
import Divider from 'antd/es/divider'
import ResumeBlock from './components/resumeBlock'
import { BlockType } from './enum'

const ResumePanel = () => (
  <div className="bg-white p-8">
    <ResumeBlock blockType={BlockType.CareerBlockType} hasAbove={false} />
    <Divider />
    <ResumeBlock blockType={BlockType.EduBlockType} hasAbove />
  </div>
)

const UserResume = () => {
  const TabKeys = [
    {
      label: 'Suggested People',
      key: '1',
      children: 'Suggested People',
    },
    {
      label: 'Activities',
      key: '2',
      disabled: true,
    },
    {
      label: 'Resume',
      key: '3',
      children: <ResumePanel />,
    },
    {
      label: 'Verified IDs',
      key: '4',
    },
  ]

  const [tabKey, setTabKey] = useState('1')

  const onChange = (newKey: string) => {
    setTabKey(newKey)
  }

  return (
    <div className="grid grid-cols-3 m-12">
      <div className="col-span-1"> User Profile Card</div>
      <Tabs className="col-span-2" activeKey={tabKey} items={TabKeys} onChange={onChange} />
    </div>
  )
}

export default UserResume
