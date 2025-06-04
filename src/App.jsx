import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'

// Pages
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import ContentList from './pages/ContentList'
import ContentDetail from './pages/ContentDetail'
import SeoOptimizer from './pages/SeoOptimizer'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

// Modified protected route component with bypass option
const ProtectedRoute = ({ children }) => {
  const { user, loading, bypassAuth } = useAuth()
  
  // If bypassing auth, render children directly
  if (bypassAuth) {
    return children
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export default function App() {
  const { bypassAuth } = useAuth()
  
  return (
    <Routes>
      {/* Auth routes - bypass these if auth is bypassed */}
      {!bypassAuth ? (
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      ) : (
        // When bypassing auth, redirect login/register to dashboard
        <>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
        </>
      )}
      
      {/* Dashboard routes */}
      <Route element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content" element={<ContentList />} />
        <Route path="/content/:id" element={<ContentDetail />} />
        <Route path="/seo-optimizer" element={<SeoOptimizer />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
