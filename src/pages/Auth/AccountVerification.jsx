import { useEffect, useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { verifyUserAPI } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'

function AccountVerification() {
  // Lấy giá trị từ URL
  let [searchParams] = useSearchParams()
  const { email, token } = Object.fromEntries([...searchParams])
  // State để quản lí trạng thái đã quản lý tài khoản hay chưa
  const [verified, setVerified] = useState(false)

  // Call API để xác thực tài khoản
  useEffect(() => {
    if (email && token) {
      verifyUserAPI({ email, token }).then(() => {
        setVerified(true)
      })
    }
  }, [email, token])

  // Nếu URL không tồn tại email hoặc token thì chuyển đến trang 404
  if (!email || !token) return <Navigate to='/404' />

  // Nếu chưa verify xong thì phải hiển thị loading
  if (!verified) return <PageLoadingSpinner caption='Verifying account...' />

  // Sau khi verify xong thì hiển thị thông báo -> chuyển đến trang login + params verifyEmail
  return <Navigate to={`/login?verifiedEmail=${email}`} />
}

export default AccountVerification
