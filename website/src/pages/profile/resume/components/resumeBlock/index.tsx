import Button from 'antd/es/button'
import type { ResumeBlockInput, ResumeCardData } from '../../types'
import { BlockType } from '../../enum'
import ResumeCard from '../resumeCard'
import { arrayMoveImmutable } from 'array-move'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MenuOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'

const CAREER_TITLE = 'Career Experiences'
const EDU_TITLE = 'Education Experiences'

// 继承ResumeCardData，加上id
type ResumeCardDataSort = ResumeCardData & {
  id: string
}

const ResumeBlock = (input: ResumeBlockInput) => {
  const { handleEditCard, handleDeleteCard, isEditResume, dataArr, blockType, handleCreateCard } = input
  const [list, setList] = useState<ResumeCardDataSort[]>([])

  useEffect(() => {
    // 用来给每个item加上id
    if (dataArr) {
      const newList = dataArr.map((item: ResumeCardData, index: number) => {
        return {
          ...item,
          id: `${blockType}-${index}`,
        }
      })
      setList(newList)
    }
  }, [dataArr])

  // 拖拽组件
  function SortableItem(propsItem: ResumeCardDataSort) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: propsItem.id })

    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        {...attributes}
        className="flex flex-row justify-start items-center text-left text-xl px-2 bg-[#D9D9D933] mt-3 first:mt-0"
      >
        {/* 排序条件：编辑 & 数组 > 1 */}
        {isEditResume && list.length > 1 && (
          <span {...listeners} className="mr-2 h-full frc-center">
            <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
          </span>
        )}
        <div className="w-2" />
        <div>
          <ResumeCard
            key={propsItem.id}
            isEditResume={isEditResume}
            handleEditCard={handleEditCard}
            handleDeleteCard={handleDeleteCard}
            blockType={blockType}
            data={propsItem}
          />
        </div>
      </div>
    )
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  async function handleDragEnd(event: any) {
    const { active, over } = event
    if (active.id !== over.id) {
      const cachelist = list.slice()
      const oldIndex = list.findIndex(item => item.id === active.id)
      const newIndex = list.findIndex(item => item.id === over.id)

      const newData = arrayMoveImmutable(cachelist, oldIndex, newIndex).filter((el: any) => !!el)
      setList(newData)
    }
  }

  return (
    <div className="">
      {/* Header */}
      <div className="flex justify-between w-full items-center">
        {/* Title */}
        <div className="text-2xl font-bold">{input.blockType === BlockType.CareerBlockType ? CAREER_TITLE : EDU_TITLE}</div>
        {/* Edit / Save Button */}
      </div>

      {/* Resume Card Entires */}
      <div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={list} id="order" strategy={verticalListSortingStrategy}>
            {list?.map((item: ResumeCardDataSort, index: number) => (
              <SortableItem key={`${index}-${item.startTime}-${item.endTime}`} {...item} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      {/* 增加框 */}
      {isEditResume && (
        <Button
          type="dashed"
          className="w-full my-8"
          onClick={() => handleCreateCard(blockType, list === undefined ? 1 : list.length + 1)}
        >
          +
        </Button>
      )}
    </div>
  )
}

export default ResumeBlock
