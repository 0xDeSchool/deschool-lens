import { useCCProfile } from '~/hooks/useCCProfile';
import RecommandEventCard from './componnets/RecommandEventCard';
import RecommnadEventMatch from './componnets/RecommnadEventMatch';

const LearnTogether = () => {
  const [recommandEvents] = useCCProfile()
  console.log('recommandEvents', recommandEvents)
  return (
    <div className="relative w-auto mx-10 py-10 3xl:w-full 3xl:mx-auto 3xl:max-w-1440px 4xl:max-w-1680px h-full overflow-auto scroll-hidden">
      <h1>Upcoming events<span>based on your profile</span></h1>
      <p>for a more accurate match, filled more info on your booth profile</p>
      {/* recommand event list */}
      {recommandEvents?.map((item: RecomendedEvents) => {
        return (
          <div className="frc-center gap-12 mb-8">
            {/* card info */}
            <RecommandEventCard info={item}/>
            {/* match info */}
            <RecommnadEventMatch info={item}/>
          </div>
        )
      })}
    </div>
  )
}

export default LearnTogether
