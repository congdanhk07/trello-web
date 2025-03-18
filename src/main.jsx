import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ConfirmProvider } from 'material-ui-confirm'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import App from '~/App'
import { store } from '~/redux/store'
import theme from '~/theme'
import { BrowserRouter } from 'react-router-dom'
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)
root.render(
  <BrowserRouter
    // basename là prefix phải thông qua trước khi vào website của chúng ta
    basename='/'
  >
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <ConfirmProvider
          defaultOptions={{
            allowClose: false,
            confirmationText: 'Confirm',
            cancellationText: 'Cancel',
            dialogProps: {
              maxWidth: 'sm'
            },
            cancellationButtonProps: {
              color: 'error'
            }
          }}
        >
          <CssBaseline />
          <App />
          <ToastContainer theme='colored' position='bottom-left' />
        </ConfirmProvider>
      </CssVarsProvider>
    </Provider>
  </BrowserRouter>
)
