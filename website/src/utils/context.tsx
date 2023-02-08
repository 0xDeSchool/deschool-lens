import type { ReactElement } from 'react'
// 合并多个provider
// TODO wip any
interface HookType {
  [key: string]: any
}
const create = (providerMap: Object) => {
  const ctx: HookType = {}
  const AppProvider = Object.entries(providerMap).reduceRight((Merged, [hookKey, useValue]) => {
    ctx[hookKey] = useValue
    const OneProvider = ctx[hookKey]
    if (!Merged) return ctx[hookKey]

    return (children: ReactElement) => <OneProvider>{children}</OneProvider>
  })
  ctx.useProvider = () => AppProvider
  return ctx
}

export default create
