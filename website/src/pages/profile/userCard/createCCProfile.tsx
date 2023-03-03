import Button from 'antd/es/button';
import Input from 'antd/es/input';
import { useState } from 'react';
import { useAccount } from '~/context/account';
import message from 'antd/es/message';
import { getCCProfileNFTContract } from '~/api/cc/contract';

const CreateCyberConnectProfile: React.FC = () => {
  const { deschoolProfile } = useAccount();
  const [handle, setHandle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const checkHandle = () => {
    if (!handle) {
      message.warning('Please input handle')
      return false
    }
    if (handle.length < 4) {
      message.warning('Handle must be at least 4 characters')
      return false
    }
    if (handle.length > 32) {
      message.warning('Handle must be at most 32 characters')
      return false
    }
    return true
  }
  const mint = async () => {
    if (!checkHandle()) {
      return
    }

    try {
      setLoading(true)
      const metadata = {
        name: deschoolProfile?.username || '',
        bio: deschoolProfile?.bio || '',
        handle,
        version: "1.0.0",
      };
      const tx = await getCCProfileNFTContract()
        .createProfile(
          {
            to: deschoolProfile?.address,
            handle,
            metadata: JSON.stringify(metadata),
            avatar: deschoolProfile?.avatar || '',
            operator: "0x85AAc6211aC91E92594C01F8c9557026797493AE",
          },
          // preData
          0x0,
          // postData
          0x0
      );
    } catch (error: Error | unknown) {
      console.log('error', error)
      if (error instanceof Error) {
        if (error?.code === 'UNPREDICTABLE_GAS_LIMIT') {
          message.error(error.code)
        } else if (error?.code === 'ACTION_REJECTED') {
          message.warning('Action rejected the transaction')
        } else {
          message.error(error.message)
        }
      } else {
        message.error('Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="frc-center mt-4 mx-10">
      <Input
        style={{ border: '1px solid #6525ff' }}
        allowClear
        placeholder='@handle' bordered={false} maxLength={20} minLength={4} onChange={(e) => setHandle(e.target.value)}/>
      <Button type="primary" loading={loading} onClick={() => mint()}>MINT ON BSC</Button>
    </div>
  );
}

export default CreateCyberConnectProfile
