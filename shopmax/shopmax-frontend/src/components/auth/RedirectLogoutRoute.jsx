import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function RedirectLogoutRoute({ children }) {
   const { isAuthenticated, loading } = useSelector((state) => state.auth)

   if (loading) return null

   if (isAuthenticated) {
      return <Navigate to="/login" />
   }

   return children
}

export default RedirectLogoutRoute
