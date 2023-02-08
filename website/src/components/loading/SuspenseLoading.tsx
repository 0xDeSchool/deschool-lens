import { LoadingOutlined } from '@ant-design/icons'

const SuspenseLoading = () => (
  <div className="font-Anton text-2xl w-full h-[300px] flex items-center justify-center cacheSuspend">
    <LoadingOutlined style={{ width: 24, height: 24, fontSize: 24 }} />
    <h1 className="ml-4">页面缓冲中</h1>
  </div>
)

export default SuspenseLoading
