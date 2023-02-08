import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { validate as uuidValidate } from 'uuid'

const RouteGuard = () => {
  const navigate = useNavigate()
  const str = window.location.pathname.slice(1)
  const uuStr = `${str.slice(0, 8)}-${str.slice(8, 12)}-${str.slice(12, 16)}-${str.slice(16, 20)}-${str.slice(20, 32)}`
  const res = uuidValidate(uuStr)

  useEffect(() => {
    if (res) {
      window.location.href = `https://www.notion.so/${str}`
    } else {
      navigate('/404')
    }
  }, [])
  return <div> </div>
}
export default RouteGuard
