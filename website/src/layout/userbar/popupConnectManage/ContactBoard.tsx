import Input from 'antd/es/input'
import React, { useEffect, useState } from 'react'

import Button from 'antd/es/button'
import { useAccount } from '~/account'
import { EditOutlined } from '@ant-design/icons'
import { Contact } from '~/api/booth/types'
import { updateUserInfo } from '~/api/booth/account'
import { parse } from 'path'

const contractOptions: Contact[] = [
  { contactType: 'Twitter', name: '' },
  { contactType: 'Discord', name: '' },
  { contactType: 'Wechat', name: '' },
  { contactType: 'Email', name: '' },
]

const placeholders: { [key: string]: string } = {
  "Twitter": 'https://twitter.com/...',
  "Discord": 'https://discord.gg/...',
  "Wechat": 'Wechat Username',
  "Email": 'Email',
}

const ContactBoard: React.FC = () => {
  const user = useAccount()
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])

  useEffect(() => {
    console.log('contuseracts', user)
    if (user && user.contacts) {
      setContacts(user.contacts)
    } else {
      setContacts(contractOptions)
    }
  }, [user])

  const parseContacts = (contacts: Contact[]) => {
    contacts?.forEach((item) => {
      if (!item.url) return
      switch (item.contactType) {
        case 'Twitter':
          item.name = item.url?.split('twitter.com/')?.[1]
          break
        case 'Discord':
          item.name = item.url?.split('discord.gg/')?.[1]
          break
        case 'Wechat':
          item.name = item.url
          break
        case 'Email':
          item.name = item.url
          break
        default:
          break
      }
    })
  }

  const handleUserInfoSubmit = async () => {
    if (loading) return
    setLoading(true)
    try {
      await updateUserInfo({
        ...user,
        contacts,
      })
    } catch (e) {
      console.log('error', e)
    } finally {
      setLoading(false)
      setEdit(false)
    }
  }

  const handleUpdateContact = (index: number, value: string) => {
    const newContacts = [...contacts]
    newContacts[index].url = value
    parseContacts(newContacts)
    setContacts(newContacts)
  }

  const handleToggle = () => {
    if (!edit) {
      setEdit(true)
    } else {
      handleUserInfoSubmit()
    }
  }

  return (
    <div>
      <div className='absolute right-20 top-20 frc-start'>
        <Button
          type={!edit ? 'default' : 'primary'}
          icon={<EditOutlined />}
          size='small'
          loading={loading}
          disabled={loading}
          className="ml-12 mr-2 frc-center"
          onClick={() => handleToggle()}>{edit ? 'SAVE' : 'EDIT'}</Button>
        {edit && <Button size='small' disabled={!user?.address}
          onClick={() => setEdit(false)}>CANCEL</Button>}
      </div>
      <div className='font-ArchivoNarrow fcc-start'>
        {contacts && contacts.map((item, index) => {
          return (
            <div className='frc-start mb-1' key={item.contactType}>
              <span className='text-gray text-14px text-right w-48px inline-block mr-2'>{item.contactType}</span>
              <Input
                value={item.url}
                style={{ width: '240px' }}
                allowClear
                disabled={!edit || loading}
                placeholder={placeholders[item.contactType] ? placeholders[item.contactType] : `Please input ${item.contactType}`}
                bordered={!(!edit || loading)}
                minLength={1}
                onChange={(e: any) => handleUpdateContact(index, e.target.value)} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ContactBoard
