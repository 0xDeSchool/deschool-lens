const smoothScroll = (Dom: Element, to: number, duration: number) => {
  // 获取当前滚动的高度 Dom为目标元素
  const getScrollTop = (el: Element) => el.scrollTop
  // 设置滚动条
  const setScrollTo = (el: Element, value: number) => {
    el.scrollTo(0, value)
    return value
  }
  if (duration < 0) {
    setScrollTo(Dom, to)
    return
  }
  const diff = to - getScrollTop(Dom)
  if (diff === 0) return
  const step = (diff / duration) * 10
  requestAnimationFrame(() => {
    if (Math.abs(step) > Math.abs(diff)) {
      setScrollTo(Dom, getScrollTop(Dom) + diff)
      return
    }
    setScrollTo(Dom, getScrollTop(Dom) + step)
    if ((diff > 0 && getScrollTop(Dom) >= to) || (diff < 0 && getScrollTop(Dom) <= to)) {
      return
    }
    smoothScroll(Dom, to, duration - 20)
  })
}

export default smoothScroll
