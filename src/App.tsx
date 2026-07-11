import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminDashboard } from './admin/AdminDashboard'
import { AdminLayout } from './admin/AdminLayout'
import { AdminLogin } from './admin/AdminLogin'
import PortfolioApp from './pages/PortfolioApp'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PortfolioApp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
