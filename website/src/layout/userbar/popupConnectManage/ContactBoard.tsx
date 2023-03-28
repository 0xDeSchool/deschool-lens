import Input from 'antd/es/input'
import React, { useEffect, useState } from 'react'

import Button from 'antd/es/button'
import { getUserManager, useAccount } from '~/account'
import { EditOutlined } from '@ant-design/icons'
import type { Contact } from '~/api/booth/types'
import { updateUserInfo } from '~/api/booth/account'

const contractOptions: Contact[] = [
  { contactType: 'Twitter', name: '', url: '' },
  { contactType: 'Telegram', name: '', url: '' },
  { contactType: 'Discord', name: '', url: '' },
  { contactType: 'Wechat', name: '', url: '' },
  { contactType: 'Email', name: '', url: '' },
]

const placeholders: { [key: string]: string } = {
  "Twitter": 'https://twitter.com/...',
  "Telegram": 'https://t.me/...',
  "Discord": 'Discord ID',
  "Wechat": 'Wechat Username',
  "Email": 'Email',
}

const ContactBoard: React.FC = () => {
  const user = useAccount()
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactsPrev, setContactsPrev] = useState<Contact[]>([])

  useEffect(() => {
    if (user && user.contacts) {
      contractOptions.map(item => {
        const contact = user?.contacts?.find(contact => contact.contactType === item.contactType)
        if (contact) {
          item.url = contact.url
          item.name = contact.name
        }
      })
    }
    setContacts(contractOptions)
  }, [user])

  const parseContacts = (contacts: Contact[]) => {
    contacts?.forEach((item) => {
      if (!item.url) return
      switch (item.contactType) {
        case 'Twitter':
          item.name = item.url?.split('twitter.com/')?.[1]
          break
        case 'Telegram':
          item.name = item.url?.split('t.me/')?.[1]
          break
        case 'Discord':
          item.name = item.url
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
      getUserManager().tryAutoLogin()
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
      setContactsPrev(JSON.parse(JSON.stringify(contacts)))
      setEdit(true)
    } else {
      handleUserInfoSubmit()
    }
  }

  const handleCancel = () => {
    setContacts(contactsPrev)
    setEdit(false)
  }

  return (
    <div>
      <div className='absolute right-20 top-20 frc-start'>
        <Button
          type={!edit ? 'default' : 'primary'}
          icon={<EditOutlined />}
          size='small'
          loading={loading}
          disabled={loading || !user?.address}
          className="ml-12 mr-2 frc-center"
          onClick={() => handleToggle()}>{edit ? 'SAVE' : 'EDIT'}</Button>
        {edit && <Button size='small' disabled={!user?.address}
          onClick={() => handleCancel()}>CANCEL</Button>}
      </div>
      <div className='font-ArchivoNarrow fcc-start'>
        {contacts && contacts.map((item, index) => (
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
          ))}
      </div>
    </div>
  )
}

export default ContactBoard
