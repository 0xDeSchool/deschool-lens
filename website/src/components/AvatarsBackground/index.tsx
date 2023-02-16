import React, { useEffect, useRef } from 'react'
import type { VirtuosoHandle } from 'react-virtuoso'
import { Virtuoso } from 'react-virtuoso'
import Image from 'antd/es/image'

export interface AvatarsBackgroundProps {
  images: string[]
  activeIndex?: number
}

export const COLUMN_COUNT = 3
export const ITEM_SIZE = 160
export const AVATARS_BACKGROUND_ID = 'avatars_background_id'
export const PRE_AVATAR_COUNT = 10
export const TAIL_AVATAR_COUNT = 10
export const OFFSET_SCROLL_Y = 5

export const AvatarsBackground: React.FC<AvatarsBackgroundProps> = ({ images, activeIndex = 0, ...props }) => {
  const virtuosoRef = useRef<VirtuosoHandle>(null)

  useEffect(() => {
    virtuosoRef.current?.scrollTo({
      top: Math.floor(activeIndex / COLUMN_COUNT + PRE_AVATAR_COUNT - OFFSET_SCROLL_Y) * ITEM_SIZE,
    })
  }, [activeIndex])

  const listRealTotalCount = Math.ceil(images.length / COLUMN_COUNT)

  function getActiveIndexDistance(currentIndex: number): 0 | 1 | 2 {
    if (currentIndex === activeIndex) return 0
    if (Math.abs(Math.abs(currentIndex - activeIndex) - COLUMN_COUNT) < 2 || Math.abs(currentIndex - activeIndex) < 2) return 1
    return 2
  }

  function getImageStyle(currentIndex: number) {
    const styleIndex = getActiveIndexDistance(currentIndex)
    const opacity = [1, 0.6]
    const transform = ['scale(1)', 'scale(0.9)']
    return {
      transform: transform[styleIndex],
      opacity: opacity[styleIndex],
      boxShadow: styleIndex === 0 ? '0 0 0 6px var(--chakra-colors-adorn-900), 0 0 160px var(--chakra-colors-adorn-900)' : undefined,
    }
  }

  function getItemCountIndex(fakeIndex: number) {
    const index = fakeIndex - PRE_AVATAR_COUNT < 0 ? listRealTotalCount - fakeIndex : fakeIndex - PRE_AVATAR_COUNT
    if (index > listRealTotalCount - 1) {
      return index - (listRealTotalCount - 1)
    }
    return index
  }

  const totalCount = listRealTotalCount + PRE_AVATAR_COUNT + TAIL_AVATAR_COUNT

  return (
    <Virtuoso
      id={AVATARS_BACKGROUND_ID}
      ref={virtuosoRef as any}
      totalCount={totalCount}
      className="scroll-smooth h-full mr-1px"
      initialTopMostItemIndex={PRE_AVATAR_COUNT - OFFSET_SCROLL_Y}
      fixedItemHeight={ITEM_SIZE}
      style={{
        transition: '500ms',
        transform: `translateX(-${(activeIndex % COLUMN_COUNT) * ITEM_SIZE + ITEM_SIZE * 4}px)`,
      }}
      {...props}
      itemContent={(fakeIndex: number) => {
        const index = getItemCountIndex(fakeIndex)
        const columnCount = COLUMN_COUNT * COLUMN_COUNT
        return (
          <div
            style={{
              gridTemplateColumns: `repeat(${columnCount},calc(100% / ${columnCount}))`,
              height: `${ITEM_SIZE}px`,
              width: `${ITEM_SIZE}px`,
            }}
            key={index}
            data-index={index}
          >
            {new Array(columnCount)
              .fill(0)
              .map(
                (_, i) =>
                  images[index * COLUMN_COUNT + (i % COLUMN_COUNT)] ||
                  images[Math.floor(listRealTotalCount / 2) * COLUMN_COUNT + (i % COLUMN_COUNT)],
              )
              .map((src, i) => {
                const currentIndex = index * COLUMN_COUNT + (i % COLUMN_COUNT)
                const style = i >= COLUMN_COUNT && i < COLUMN_COUNT * (COLUMN_COUNT - 1) ? getImageStyle(currentIndex) : {}
                return (
                  <Image
                    key={src}
                    width="120px"
                    height="120px"
                    src={src}
                    alt={`avatar-background-${i}`}
                    data-index={currentIndex}
                    style={{ ...style, transition: '200ms', transform: 'scale(0.8) translate3d(0, 0, 0)', opacity: 0.3 }}
                  />
                )
              })}
          </div>
        )
      }}
    />
  )
}
