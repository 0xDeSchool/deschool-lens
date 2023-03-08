import { useTranslation } from 'react-i18next';
import useCCProfile, { MatchedEvent } from '~/hooks/useCCProfile';
import ShowMoreLoading from '~/components/loading/showMore'
import Button from 'antd/es/button';
import { useNavigate, NavLink } from 'react-router-dom';
import RecommnadEventMatch from './componnets/RecommnadEventMatch';
import RecommandEventCard from './componnets/RecommandEventCard';

const LearnTogether = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {value, loading, hasNextPage, defaultRecommandEvent, loadMore} = useCCProfile(1)

  return (
    <div className="relative w-auto mx-30 py-10 3xl:w-full 3xl:mx-auto 3xl:max-w-1440px 4xl:max-w-1680px h-full overflow-auto scroll-hidden">
      <h1 className="text-xl font-Anton ml-8 mb-4">Upcoming events<span className='ml-2 font-ArchivoNarrow'>based on your profile</span></h1>
      <p className="text-16px font-ArchivoNarrow ml-8 mb-8">for a more accurate <NavLink to="/profile/match" className="text-#774FF8">match</NavLink>, filled more info on your booth profile</p>
      {/* recommand event list */}
      {value?.map((item: MatchedEvent) => (
          <div key={`${item.id}-${item.createTimestamp}`} className="frc-center gap-12 mb-8">
            {/* card info */}
            <RecommandEventCard info={item}/>
            {/* match info */}
            <RecommnadEventMatch info={item}/>
          </div>
        ))}
      {(!loading && !defaultRecommandEvent && hasNextPage) && (
        <div className="text-center mt-10">
          <button type="button" className="bg-#1818180f border-#18181826 border-2 rounded-xl px-4 py-2" onClick={() => loadMore()}>
            {t('SeeMore')}
          </button>
        </div>
      )}
      {/* 无数填充默认数据 */}
      {defaultRecommandEvent && <div>
        <div className="frc-center gap-12 mb-8 relative px-12 pt-4">
          {/* card info */}
          <RecommandEventCard info={defaultRecommandEvent}/>
          {/* match info */}
          <RecommnadEventMatch info={defaultRecommandEvent}/>
          <div className='absolute top-0 right-0 left-0 bottom-0 z-11 bg-gradient-to-t from-gray-300 rounded-2 cursor-not-allowed' />
        </div>
        <p className="text-#666">To view your customized events recommendation, please complete your profile setup in Match</p>
        <div className="text-center mt-10">
          <Button type='primary' onClick={() => navigate('/profile/match')}>go to match</Button>
        </div>
      </div>}
      {/* 加载更多的过渡 */}
      {(loading) && (
        <div className="mt-10 w-full frc-center">
          <ShowMoreLoading />
        </div>
      )}
    </div>
  )
}

export default LearnTogether
