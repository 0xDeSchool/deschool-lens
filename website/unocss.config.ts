import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'

// const colorReg = (prefix: string) => new RegExp(`^${prefix}-([0-9a-z]+)(/(\\d+))?$`)

// const colorAttr = (prefix: string, [, color, , opacity]: RegExpMatchArray) => {
//   let lightColor = ''
//   let darkColor = ''

//   if (['black', 'white'].includes(color)) {
//     lightColor = color
//     darkColor = color === 'white' ? 'black' : 'white'
//   } else {
//     lightColor = `gray-${color}`
//     darkColor = `gray-${((+color === 900 || +color === 50 ? 950 : 900) - +color).toString()}`
//   }

//   const attr = `${prefix}-${lightColor}${opacity ? `/${opacity}` : ''}`
//   const darkAttr = `${prefix}-${darkColor}${opacity ? `/${opacity}` : ''}`

//   return `${attr} dark:${darkAttr}`
// }

export default defineConfig({
  theme: {
    // ...
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      '3xl': '1680px',
      '4xl': '1920px',
    },
  },
  shortcuts: [
    ['screen-fit', 'w-full lg:max-w-768px xl:max-w-1024px 2xl:max-w-1280px 3xl:max-w-1440px 4xl:max-w-1680px'],
    ['frc-start', 'flex flex-row items-center justify-start'],
    ['frc-end', 'flex flex-row items-center justify-end'],
    ['frc-around', 'flex flex-row items-center justify-around'],
    ['frc-between', 'flex flex-row items-center justify-between'],
    ['frc-center', 'flex flex-row items-center justify-center'],
    ['fcc-start', 'flex flex-col items-center justify-start'],
    ['fcs-between', 'flex flex-col items-start justify-between'],
    ['fcc-around', 'flex flex-col items-center justify-around'],
    ['fcc-between', 'flex flex-col items-center justify-between'],
    ['fcc-center', 'flex flex-col items-center justify-center'],
    ['fcs-center', 'flex flex-col items-start justify-center'],
    ['frs-center', 'flex flex-row items-start justify-center'],
    ['frs-start', 'flex flex-row items-start justify-start'],
    ['fce-start', 'flex flex-col items-end justify-end'],
    ['fce-between', 'flex flex-col items-end justify-between'],

    ['purple-button', 'inline-flex items-center bg-#6525FF text-white hover:cursor-pointer hover:bg-purple-500'],
    ['purple-text-button', 'inline-flex items-center text-#6525FF hover:cursor-pointer hover:text-purple-500'],
    [
      'purple-border-button',
      'inline-flex items-center border border-#6525FF rounded-xl text-#6525FF hover:cursor-pointer hover:text-purple-500',
    ],
    ['shadow-module', 'border shadow-md rounded-xl w-full'],
  ],
  presets: [presetUno(), presetAttributify(), presetIcons()],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
