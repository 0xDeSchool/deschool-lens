import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
// 网站入口界面
import NotFound from '~/pages/notFound' // 404页面
import RouteGuard from '~/pages/routeGuard' // 跳别的页面之前的中间页
import NoAuth from '~/pages/noAuth' // 无权限页面
import Landing from '~/pages/landing'
// 管理系列课程下的课程
import Explore from '~/pages/explore' // 探索页面
import Profile from '~/pages/profile/userProfile' // 个人中心
import Roadmap from '~/pages/roadmap' // 网站路线图
import PoskIntro from '~/pages/poskIntro' // pass/sbt介绍页面
import Layout from '../layout'

const RouterObj = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="" element={<Navigate to="/landing" />} />
        <Route path="landing" element={<Landing />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/:userId" element={<Profile />} />
        <Route path="explore" element={<Explore />} />
        {/* uniqueKey既可以是orgId也可以是domain */}
        <Route path="sbtIntro/:sbtId" element={<PoskIntro />} />
        <Route path="passIntro/:passId" element={<PoskIntro />} />
        <Route path="series">
          <Route path="" element={<Navigate to="/series/list" />} />
        </Route>
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="noauth" element={<NoAuth />} />
        <Route path="404" element={<NotFound />} />
      </Route>
      <Route path="/*" element={<RouteGuard />} />
    </Routes>
  </BrowserRouter>
)

export default RouterObj
