import Button from 'antd/es/button';
import message from 'antd/es/message';
import Input from 'antd/es/input';
import { useState } from 'react';
import { ccContractHub } from '~/api/cc/contract';
import { PRIMARY_PROFILE } from '~/api/cc/graphql';
import { useLazyQuery } from '@apollo/client';
import { getUserManager, useAccount } from '~/account';
import { linkPlatform } from '~/api/booth';
import { PlatformType } from '~/api/booth/booth';

const CreateCyberConnectProfile: React.FC = () => {
  const user = useAccount()
  const [handle, setHandle] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [getPrimaryProfile] = useLazyQuery(PRIMARY_PROFILE)
  // 检查handle是否合法
  const checkHandle = () => {
    if (!handle) {
      message.warning('Please input handle')
      return false
    }
    if (handle.length < 1) {
      message.warning('Handle must be at least 1 characters')
      return false
    }
    if (handle.length > 20) {
      message.warning('Handle must be at most 20 characters')
      return false
    }
    if (!/^[a-z0-9_]+$/.test(handle)) {
      message.warning('Handle can only contain lowercase letters, numbers, and underscores')
      return false
    }
    return true
  }

  // 创建 CyberConnect Profile
  const handleMint = async () => {
    if (!checkHandle()) {
      return
    }
    if (!user) {
      message.warning('Please login first')
      return
    }
    try {
      setLoading(true)
      const metadata = {
        name: user.displayName || '',
        bio: user.bio || '',
        handle,
        version: "1.0.0",
      }
      const payload = {
        to: user.address,
        handle,
        metadata: JSON.stringify(metadata),
        avatar: user.avatar || '',
        operator: "0x85AAc6211aC91E92594C01F8c9557026797493AE",
      }
      await ccContractHub().createProfile(payload, 0x0, 0x0);
      await pollingGetCyberConnectProfile()
    } catch (error: Error | unknown) {
      console.log('error', error)
      // if (error instanceof Error) {
      //   if (error?.code === 'UNPREDICTABLE_GAS_LIMIT') {
      //     message.error(error.code)
      //   } else if (error?.code === 'ACTION_REJECTED') {
      //     message.warning('Action rejected the transaction')
      //   } else {
      //     message.error(error.message)
      //   }
      // } else {
      // }
      message.error('Something went wrong')
      setLoading(false)
    } finally {
    }
  }


  // 获取 CyberConnect Profile
  const getCyberConnectProfile = async () => {
    try {
      const res = await getPrimaryProfile({
        variables: {
          address: user?.address,
        },
      })
      const userInfo = res?.data?.address?.wallet?.primaryProfile
      if (!userInfo) {
        console.log('no handle')
        return
      }
      return userInfo
    } catch (e) {
      console.log('error', e)
    } finally {
      setLoading(false)
    }
  }

  // 轮询获取 CyberConnect Profile, 如果获取到数据那么停止轮询
  const pollingGetCyberConnectProfile = async () => {
    const timer = setTimeout(async () => {
      const userInfo = await getCyberConnectProfile()
      if (userInfo) {
        // if user info is available, stop polling
        await linkPlatform({
          handle: userInfo?.handle,
          platform: PlatformType.CYBERCONNECT,
          data: {
            id: userInfo?.id,
          },
          address: user?.address!,
        })
        setLoading(false)
        await getUserManager().tryAutoLogin()
        clearTimeout(timer)
      } else {
        // if user info is not available, try again in 1.5 seconds
        pollingGetCyberConnectProfile()
      }
    }, 1500)
  }

  return (
    <div className="frc-center mt-4 mx-10">
      <Input
        style={{ border: '1px solid #6525ff' }}
        allowClear
        disabled={loading}
        placeholder='@handle'
        bordered={false}
        maxLength={20}
        minLength={1}
        onChange={(e) => setHandle(e.target.value)} />
      <Button style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}} type="primary" loading={loading} onClick={() => handleMint()}>MINT ON BSC</Button>
    </div>
  );
}

export default CreateCyberConnectProfile
