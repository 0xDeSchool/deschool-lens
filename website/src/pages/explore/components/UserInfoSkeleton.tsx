import SkeletonAvatar from 'antd/es/skeleton/Avatar'
import SkeletonButton from 'antd/es/skeleton/Button'
import SkeletonInput from 'antd/es/skeleton/Input'

const UserInfoDeschool= () => (
    <>
      <div className='mx-auto fcc-center mb-8'>
        <div className="relative frc-center mt-24px mb-4">
          <SkeletonAvatar size={86} active/>
          <svg className="absolute bottom-0" width="92" height="48" viewBox="0 0 92 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M90 2C90 26.3005 70.3005 46 46 46C21.6995 46 2 26.3005 2 2" stroke="#774FF8" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <h1 className="font-Anton text-black text-24px leading-32px h-32px line-wrap two-line-wrap">
          <SkeletonInput active/>
        </h1>
      </div>
      {/* follows info */}
      <div className="mx-auto frc-center gap-8 flex-wrap">
        <SkeletonButton style={{width: '100px'}} active/>
        <SkeletonButton style={{width: '100px'}} active/>
      </div>
      <div className="font-ArchivoNarrow text-#000000d8 text-16px leading-24px h-120px frc-center w-full">
        <SkeletonInput style={{width: '268px'}} className='mx-auto w-full' active/>
      </div>
      <div className='frc-between gap-8 mx-auto'>
        <SkeletonButton style={{width: '120px'}} className="mx-auto" active/>
        <SkeletonButton style={{width: '120px'}} className="mx-auto" active/>
      </div>
    </>
  )

export default UserInfoDeschool
