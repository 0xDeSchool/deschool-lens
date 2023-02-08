export default function download(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  const downloadUrl = url.split('/').pop()
  if (!downloadUrl) {
    // TODO good alert
    return
  }
  a.download = downloadUrl
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// 获取 assets iamges 静态资源
export const getAssetsImage = (url: string) => new URL(`../assets/images/${url}`, import.meta.url).href

// 获取assets静态资源
export const getAssetsFont = (url: string) => new URL(`../assets/fonts/${url}`, import.meta.url).href

export const containsDuplicate = (nums: string[]) => nums.length !== [...new Set(nums)].length

let requestID: number
export const scrollToTop = () => {
  const sTop = document.documentElement.scrollTop || document.body.scrollTop
  if (sTop > 0) {
    requestID = window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, sTop - sTop / 8)
    setTimeout(() => {
      window.cancelAnimationFrame(requestID)
    }, 500)
  }
}

export const getVideoPlayerDuration = async (file: Blob | MediaSource) =>
  new Promise(resolve => {
    const videoElement = document.createElement('video')
    videoElement.src = URL.createObjectURL(file)
    videoElement.addEventListener('loadedmetadata', () => {
      resolve(videoElement.duration)
    })
  })
