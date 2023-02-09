import React, { useState } from 'react'
import { getExploreSearch } from '~/api/explore'
import { useTranslation } from 'react-i18next'
import type { SelectProps } from 'antd/es/select'
import Select from 'antd/es/select'
import { useNavigate } from 'react-router'

let timeout: ReturnType<typeof setTimeout> | null
let currentValue: string

const fetch = (value: string, callback: Function, t: any) => {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  const fake = () => {
    getExploreSearch(currentValue).then((res: any) => {
      if (currentValue === value) {
        const { channels, series, courses } = res
        const data = [
          {
            code: 'channel',
            label: t('search.channel'),
            options: channels?.map((item: Record<string, string>) => ({ ...item, label: item.name, value: item.id })),
          },
          {
            code: 'series',
            label: t('search.series'),
            options: series?.map((item: Record<string, string>) => ({ ...item, label: item.title, value: item.id })),
          },
          {
            code: 'course',
            label: t('search.course'),
            options: courses?.map((item: Record<string, string>) => ({ ...item, label: item.title, value: item.id })),
          },
        ].filter(item => item.options?.length > 0)
        callback(data)
      }
    })
  }

  timeout = setTimeout(fake, 300)
}

const SearchInput: React.FC<{ style: React.CSSProperties }> = props => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [data, setData] = useState<SelectProps['options']>([])

  const handleSearch = (newValue: string) => {
    if (newValue) {
      fetch(newValue, setData, t)
    } else {
      setData([])
    }
  }

  const handleChange = (newValue: string) => {
    const temp = data?.find(item => item.options?.find((option: Record<string, string>) => option.value === newValue))
    if (temp?.code === 'channel') {
      navigate(`/org/${newValue}`)
    } else if (temp?.code === 'series') {
      navigate(`/series/seriesintro/${newValue}`)
    } else if (temp?.code === 'course') {
      const seriesId = temp?.options?.find((option: Record<string, string>) => option.value === newValue)?.seriesId
      navigate(`/series/seriesintro/${seriesId}`)
    }
  }

  return (
    <Select
      showSearch
      status={data && data.length > 0 ? '' : 'warning'}
      placeholder={t('search.placeholder')}
      style={props.style}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
      options={data}
    />
  )
}

const ExploreSearchBoard: React.FC = () => <SearchInput style={{ width: 200 }} />

export default ExploreSearchBoard
