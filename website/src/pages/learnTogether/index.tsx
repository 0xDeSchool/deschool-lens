import { useCCProfile } from '~/hooks/useCCProfile';
import RecommandEventCard from './componnets/RecommandEventCard';

const LearnTogether = () => {
  const [recommandEvents] = useCCProfile()
  console.log('recommandEvents', recommandEvents)
  return (
    <div>
      {/* recommand event list */}
      {recommandEvents?.map((item: RecomendedEvents) => {
        return (
          <div>
            {/* card info */}
            <RecommandEventCard info={item}/>
            {/* match info */}
            <div>match info</div>
          </div>
        )
      })}
    </div>
  )
}

export default LearnTogether
