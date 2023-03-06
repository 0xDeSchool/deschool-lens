import { useTranslation } from 'react-i18next';
import useCCProfile from '~/hooks/useCCProfile';
import RecommandEventCard from './componnets/RecommandEventCard';
import RecommnadEventMatch from './componnets/RecommnadEventMatch';
import ShowMoreLoading from '~/components/loading/showMore'
import { useState } from 'react';
import Button from 'antd/es/button';
import { useNavigate } from 'react-router';

const LearnTogether = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {value, loading, hasNextPage, error, loadMore} = useCCProfile(1)
  const [interest, setInterest] = useState([])
  console.log('error', error)
  return (
    <div className="relative w-auto mx-10 py-10 3xl:w-full 3xl:mx-auto 3xl:max-w-1440px 4xl:max-w-1680px h-full overflow-auto scroll-hidden">
      <h1 className="text-xl font-Anton ml-8 mb-4">Upcoming events<span>based on your profile</span></h1>
      <p className="text-gl font-ArchivoNarrow ml-8 mb-8">for a more accurate match, filled more info on your booth profile</p>
      {/* recommand event list */}
      {value?.map((item: RecomendedEvents) => {
        return (
          <div key={`${item.id}-${item.createTimestamp}`} className="frc-center gap-12 mb-8">
            {/* card info */}
            <RecommandEventCard info={item}/>
            {/* match info */}
            <RecommnadEventMatch info={item}/>
          </div>
        )
      })}
      {/* 加载更多的过渡 */}
      {(loading) && (
        <div className="mt-10 w-full frc-center">
          <ShowMoreLoading />
        </div>
      )}
      {(!loading && hasNextPage) && (
        <div className="text-center mt-10">
          <button type="button" className="bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2" onClick={() => loadMore()}>
            {t('SeeMore')}
          </button>
        </div>
      )}
      <div className="text-center mt-10">
        <Button type='primary' onClick={() => navigate('/profile/match')}>Setting Interest</Button>
      </div>
    </div>
  )
}

export default LearnTogether
