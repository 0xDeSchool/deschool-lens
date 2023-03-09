import Button from 'antd/es/button';
import message from 'antd/es/message';
import Input from 'antd/es/input';
import { useState } from 'react';
import { updateUserInfo } from '~/api/booth/account';
import { DEFAULT_AVATAR, getUserManager, useAccount } from '~/account';
import Avatar from 'antd/es/avatar';
import UploadPicture from '~/components/uploadImage/uploadPicture';
import TextArea from 'antd/es/input/TextArea';
import { EditOutlined } from '@ant-design/icons';


const UpdateUsername: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)
  const user = useAccount()
  const [username, setUsername] = useState<string>(user?.formateName() || '')
  const [avatar, setAvatar] = useState<string>(user?.avatar || '')
  const [bio, setBio] = useState<string>(user?.bio || '')
  const [uploading, setUploading] = useState<boolean>(false)

  // 检查 username 是否合法
  const checkUsername = () => {
    if (!username) {
      message.warning('Please input your name')
      return false
    }
    return true
  }

  // update username
  const handleUpdate = async () => {
    if (!checkUsername()) {
      return
    }

    try {
      setLoading(true)
      await updateUserInfo({
        displayName: username,
        avatar,
        bio,
      })
      getUserManager().tryAutoLogin()
    } catch (error: Error | unknown) {
      console.log('error', error)
      message.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    if (edit) {
      await handleUpdate()
    }
    setEdit(!edit)
  }

  return (
    <div className='frs-start gap-1 px-8 pt-24'>
      {!edit && <Avatar size={68} alt="user avatar" src={user && user.avatar || DEFAULT_AVATAR} />}
      {edit && (
        <UploadPicture
          width={68}
          height={68}
          onChange={(list: string[]) => setAvatar(list[0])}
          imageList={[avatar]}
          albumname="sbts"
          userId={user?.address}
          imgCropProps={{
            modalTitle: '',
            shape: 'round',
          }}
          onChangeStatus={(status) => {setUploading(status)}}
        />
      )}
      <div>
        <div className="frc-start mb-2">
          <Input
            value={username}
            style={{ width: '200px' }}
            allowClear
            disabled={!user?.address || !edit || loading}
            placeholder={user?.address ? 'Please login' : 'Please input username'}
            bordered={false}
            maxLength={30}
            minLength={1}
            onChange={(e) => setUsername(e.target.value)}/>
          <Button
            type={!edit ? 'default' : 'primary'}
            icon={<EditOutlined />}
            size='small'
            loading={loading}
            disabled={!user?.address || uploading}
            className="mr-2 frc-center"
            onClick={() => handleToggle()}>{edit ? 'SAVE' : 'EDIT'}</Button>
          {edit && <Button size='small' disabled={!user?.address}
            onClick={() => setEdit(false)}>CANCEL</Button>}
        </div>
        <TextArea
          rows={3}
          value={bio}
          style={{ width: '200px'}}
          allowClear
          disabled={!user?.address || !edit || loading}
          placeholder={user?.address ? 'bio...' : 'Please input bio'}
          bordered={edit}
          maxLength={100}
          minLength={1}
          autoSize={{ minRows: 3, maxRows: 4 }}
          onChange={(e) => setBio(e.target.value)}/>
      </div>

    </div>
  );
}

export default UpdateUsername
