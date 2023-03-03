import Button from 'antd/es/button';
import Form from 'antd/es/form';
import Input from 'antd/es/input';
import { useEffect, useRef } from 'react';
import { useAccount } from '~/context/account';
import { ethers } from 'ethers';

import CC_PROFILE_NFT from '~/api/abis/cc-profile-nft-contract.json';
const CC_CONTRACT = import.meta.env.VITE_APP_CYBERCONNECT_PROFILE_CONTRACT

type CreateCyberConnectProfileProps = {
  address: string
}
const CreateCyberConnectProfile: React.FC<CreateCyberConnectProfileProps> = (props) => {
  const { address } = props;
  const { deschoolProfile } = useAccount();
  const formRef = useRef(null)
  const [form] = Form.useForm()

  const checkValidateFields = async (): Promise<boolean> => {
    let valid = true
    try {
      const values = await form.validateFields();
      valid = true
    } catch (errorInfo) {
      valid = false
    }
    return valid
  };

  const mint = async () => {
    try {
      const valid = await checkValidateFields()
      if (!valid) return

      const gasModeHandle = form.getFieldValue('handle')
      const metadata = {
        name: deschoolProfile?.username || '',
        bio: deschoolProfile?.bio || '',
        handle: gasModeHandle,
        version: "1.0.0",
      };
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const tx = await new ethers.Contract(CC_CONTRACT, CC_PROFILE_NFT, provider.getSigner())
        .createProfile(
          {
            to: address,
            handle: gasModeHandle,
            metadata: JSON.stringify(metadata),
            avatar: deschoolProfile?.avatar || '',
            operator: "0x85AAc6211aC91E92594C01F8c9557026797493AE",
          },
          // preData
          0x0,
          // postData
          0x0
      );

      console.log('txHash', tx)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="frc-center mt-4">
      <Form >
        <Form.Item
          className="frc-center mb-2"
          name="handle"
          rules={[{ required: true, message: 'Choose your preferred ccProfile handle' }]}
        >
          <div className="frc-between">
            <Input placeholder='@handle'/>
            <Button type="primary" onClick={() => mint()}>
              Mint on BSC
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateCyberConnectProfile
