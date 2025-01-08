import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function AdminRoute({ children }) {
   const { isAuthenticated, user, loading } = useSelector((state) => state.auth)

   if (loading) return null

   if (!isAuthenticated || user?.role !== 'ADMIN') {
      return <Navigate to="/" />
   }

   return children
}

export default AdminRoute
