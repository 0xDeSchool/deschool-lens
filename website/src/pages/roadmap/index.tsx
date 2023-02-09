import React from 'react'
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import { ReadFilled } from '@ant-design/icons'
import { useLayout } from '~/context/layout'
import RoadmapData from './mockData'

const Roadmap = () => {
  const { theme } = useLayout()

  return (
    <div className="relative w-full flex flex-col scroll-hidden">
      <VerticalTimeline className="dark:bg-transparent">
        {RoadmapData.map((data, i) => (
          <VerticalTimelineElement
            key={`roadmap${i.toString()}`}
            className="vertical-timeline-element"
            contentStyle={{ background: '#BFDBFE', color: `${theme === 'dark' ? '#ffffff' : '#000000'}` }}
            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
            date={data.time}
            iconStyle={{ background: '#60A5FA', color: '#fff' }}
            icon={<ReadFilled className="m-6 pt-1" />}
          >
            <p className="text-xl ">{data.content}</p>
          </VerticalTimelineElement>
        ))}
      </VerticalTimeline>
    </div>
  )
}

export default Roadmap
