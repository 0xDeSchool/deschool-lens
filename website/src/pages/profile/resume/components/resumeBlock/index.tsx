import Button from 'antd/es/button'
import { arrayMoveImmutable } from 'array-move' // eslint-disable-line import/no-extraneous-dependencies
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MenuOutlined } from '@ant-design/icons'
import ResumeCard from '../resumeCard'
import { BlockType } from '../../enum'
import type { ResumeBlockInput, ResumeCardData } from '../../types'

const CAREER_TITLE = 'Career Experiences'
const EDU_TITLE = 'Education Experiences'

const ResumeBlock = (input: ResumeBlockInput) => {
  const { handleEditCard, handleDeleteCard, isEditResume, dataArr, handleSortCard, blockType, handleCreateCard } = input

  // 拖拽组件
  function SortableItem(propsItem: ResumeCardData) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: propsItem?.id })

    return (
      <div
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        {...attributes}
        className="frc-center text-left text-xl px-2 bg-[#D9D9D933] mt-3 first:mt-0"
      >
        {/* 排序条件：编辑 & 数组 > 1 */}
        {isEditResume && dataArr.length > 1 && (
          <span {...listeners} className="mr-2 h-full frc-center">
            <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
          </span>
        )}
        <div className="w-2" />
        <ResumeCard
          key={propsItem.id}
          isEditResume={isEditResume}
          handleEditCard={() => handleEditCard(blockType, propsItem.id)}
          handleDeleteCard={() => handleDeleteCard(blockType, propsItem.id)}
          blockType={blockType}
          data={propsItem}
        />
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
      const cachelist = dataArr.slice()
      const oldIndex = dataArr.findIndex(item => item.id === active.id)
      const newIndex = dataArr.findIndex(item => item.id === over.id)

      const newData = arrayMoveImmutable(cachelist, oldIndex, newIndex).filter((el: any) => !!el)
      if (handleSortCard) {
        handleSortCard(blockType, newData)
      }
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
          <SortableContext items={dataArr} id="order" strategy={verticalListSortingStrategy}>
            {dataArr?.map((item: ResumeCardData) => (
              <SortableItem key={`${item.id}`} {...item} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
      {/* 增加框 */}
      {isEditResume && (
        <Button
          type="dashed"
          className="w-full my-8"
          onClick={() => handleCreateCard(blockType)}
        >
          +
        </Button>
      )}
    </div>
  )
}

export default ResumeBlock
