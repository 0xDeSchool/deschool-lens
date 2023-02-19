import { useEffect, useState } from 'react'
import { Charts } from '~/components/Charts.tsx'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts/types/dist/shared'
import { getIdSbt } from '~/api/booth/booth'
import { useAccount } from '~/context/account'

const TalentRadar = () => {
  const [options, setOptions] = useState<EChartsOption>({})
  const { lensToken, deschoolProfile } = useAccount()

  const loadData = async () => {
    const address = lensToken?.address || deschoolProfile?.address
    let abArr = [1, 1, 1, 1, 1, 1]

    // 如果有地址，如果有结果，则设置一下
    if (address) {
      const result = await getIdSbt(address)
      if (result?.ability) {
        abArr = result?.ability
      }
    }

    // 设置雷达图属性
    const RadarOption: EChartsOption = {
      color: ['#67F9D8', '#FFE434', '#56A3F1', '#FF917C'],
      radar: [
        {
          indicator: [
            { name: 'DEVELOPMENT', max: 4 },
            { name: 'RESEARCH', max: 4 },
            { name: 'PRODUCT', max: 4 },
            { name: 'DESIGN', max: 4 },
            { name: 'OPERATION', max: 4 },
            { name: 'DAO GOVERNANCE', max: 4 },
          ],
          center: ['50%', '50%'],
          radius: 120,
          axisName: {
            fontSize: 16,
            color: '#6525ff',
            borderRadius: 3,
            padding: [3, 5],
            formatter: '{value}',
          },
          // splitLine: {}
        },
      ],
      series: [
        {
          type: 'radar',
          radarIndex: 0,
          data: [
            {
              value: abArr ? [...abArr].map(item => item + 1) : [],
              name: 'Perk Rader',
              itemStyle: {
                color: '#FFCF21',
              },
              areaStyle: {
                color: new echarts.graphic.RadialGradient(0.1, 0.6, 1, [
                  {
                    color: '#6525ff22',
                    offset: 0,
                  },
                  {
                    color: '#6525ffdd',
                    offset: 1,
                  },
                ]),
              },
            },
          ],
        },
      ],
    }
    setOptions(RadarOption)
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="flex w-full h-400px">
      <Charts options={options} />
    </div>
  )
}

export default TalentRadar
