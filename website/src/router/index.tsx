import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
// 网站入口界面
import NotFound from '~/pages/notFound' // 404页面
import RouteGuard from '~/pages/routeGuard' // 跳别的页面之前的中间页
import NoAuth from '~/pages/noAuth' // 无权限页面
import Landing from '~/pages/landing'
// 管理系列课程下的课程
import Plaza from '~/pages/explore' // 探索页面
import Profile from '~/pages/profile' // 个人中心
import Roadmap from '~/pages/roadmap' // 网站路线图
import PoskIntro from '~/pages/poskIntro' // pass/sbt介绍页面
import Activities from '~/pages/profile/activities'  // 下个版本再做，用户活动记录
import Resume from '~/pages/profile/resume' // 个人简历
import Match from '~/pages/profile/match' // 匹配推荐配置页面
import LearnTogether from '~/pages/learnTogether' // 匹配推荐配置页面
import Layout from '../layout'

const RouterObj = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Navigate to="/landing" />} />
        <Route path="landing" element={<Landing />} />
        <Route path="plaza" element={<Plaza />} />
        <Route path="learntogether" element={<LearnTogether />} />
        <Route path="profile" element={<Profile />}>
          <Route path="" element={<Navigate to="resume" />} />
          <Route path="activities" element={<Activities />} />
          <Route path="resume" element={<Resume />} />
          <Route path="match" element={<Match />} />
        </Route>
        <Route path="profile/:address" element={<Profile />}>
          <Route path="activities" element={<Activities />} />
          <Route path="resume" element={<Resume />} />
        </Route>
        <Route path="resume/:address" element={<Profile />}>
          <Route path="" element={<Resume />} />
        </Route>
        <Route path="sbtIntro/:contractAddress/:tokenId" element={<PoskIntro />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="noauth" element={<NoAuth />} />
        <Route path="404" element={<NotFound />} />
      </Route>
      <Route path="/*" element={<RouteGuard />} />
    </Routes>
  </BrowserRouter>
)

export default RouterObj
