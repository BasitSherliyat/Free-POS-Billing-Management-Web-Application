import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import Layout from './layout/Layout'
import MartDashboard from './pages/mart-dashboard.jsx'
import routes from './MartRoutes'
import 'preline'
import Signin from './pages/signin'
import { getSignedInUser, getSignedInUserType, hasAccessToken } from './services/martBillingApi'
import Error401 from './pages/Error-401'
import Error403 from './pages/Error-403'
import Error404 from './pages/Error-404'
import Error500 from './pages/Error-500'

function RequireAuth() {
  const location = useLocation()

  if (!hasAccessToken() || !getSignedInUser()) {
    return <Navigate to="/signin" replace state={{ from: location }} />
  }

  return <Outlet />
}

function RequireRole({ allowedTypes, children }) {
  const userType = getSignedInUserType()
  if (!allowedTypes.includes(userType)) {
    if (!['super admin', 'admin', 'staff'].includes(userType)) {
      return <Navigate to="/signin" replace />
    }
    return <Navigate to={userType === 'staff' ? '/invoice-list' : '/'} replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>
            <Route
              index
              element={(
                <RequireRole allowedTypes={['super admin', 'admin']}>
                  <MartDashboard />
                </RequireRole>
              )}
            />
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={(
                  <RequireRole allowedTypes={route.allowedTypes}>
                    {route.Element}
                  </RequireRole>
                )}
              />
            ))}
          </Route>
          <Route path="/Error-401" element={<Error401 />} />
          <Route path="/Error-403" element={<Error403 />} />
          <Route path="/Error-404" element={<Error404 />} />
          <Route path="/Error-500" element={<Error500 />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
