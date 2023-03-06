import Button from 'antd/es/button';
import message from 'antd/es/message';
import Input from 'antd/es/input';
import { useState } from 'react';
import { updateUserProfile } from '~/api/go/account';

type UpdateUsernameProps = {
  defaultUsername?: string;
  disabled?: boolean;
}
const UpdateUsername: React.FC<UpdateUsernameProps> = (props) => {
  const { defaultUsername, disabled } = props;
  const [username, setUsername] = useState<string>(defaultUsername || '')
  const [loading, setLoading] = useState<boolean>(false)
  const [edit, setEdit] = useState<boolean>(false)

  // 检查 username 是否合法
  const checkHandle = () => {
    if (!username) {
      message.warning('Please input your name')
      return false
    }
    return true
  }

  // update username
  const handleUpdate = async () => {
    if (!checkHandle()) {
      return
    }

    try {
      setLoading(true)
      await updateUserProfile({
        username: username,
      })
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
    <div className="frc-start">
      <Input
        value={username}
        style={{ width: '200px' }}
        allowClear
        disabled={disabled || !edit || loading}
        placeholder={disabled ? 'Please login' : 'Please input username'}
        bordered={false}
        maxLength={30}
        minLength={1}
        onChange={(e) => setUsername(e.target.value)}/>
      <Button type="primary" size='small' loading={loading} disabled={disabled}
        className="mr-2"
        onClick={() => handleToggle()}>{edit ? 'SAVE' : 'EDIT'}</Button>
      {edit && <Button size='small' disabled={disabled}
        onClick={() => setEdit(false)}>{'CANCEL'}</Button>}
    </div>
  );
}

export default UpdateUsername
