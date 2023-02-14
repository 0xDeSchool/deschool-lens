import { useEffect, useState } from 'react'
import { Charts } from '~/components/Charts.tsx'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts/types/dist/shared'

const RadarOption: EChartsOption = {
  color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
  radar: [
    {
      indicator: [
        { text: 'Developer', max: 150 },
        { text: 'Research', max: 150 },
        { text: 'Product', max: 150 },
        { text: 'Design', max: 120 },
        { text: 'Operation', max: 108 },
        { text: 'Governance', max: 72 },
      ],
      center: ['50%', '50%'],
      radius: 120,
      axisName: {
        fontSize: 16,
        color: '#6525ff',
        borderRadius: 3,
        padding: [3, 5],
        formatter: '【{value}】',
      },
    },
  ],
  series: [
    {
      type: 'radar',
      radarIndex: 0,
      data: [
        {
          value: [100, 93, 50, 90, 70, 60],
          name: 'Talent Rader',
          areaStyle: {
            color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
              {
                color: 'rgba(171, 253, 44, 0.1)',
                offset: 0,
              },
              {
                color: 'rgba(171, 253, 44, 0.9)',
                offset: 1,
              },
            ]),
          },
        },
      ],
    },
  ],
}

const TalentRadar = () => {
  const [options, setOptions] = useState<EChartsOption>({})

  useEffect(() => {
    setOptions(RadarOption)
  }, [])

  return (
    <div className="flex w-full h-400px">
      <Charts options={options} />
    </div>
  )
}

export default TalentRadar
