import * as React from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import App from '~/App'
import theme from '~/theme'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'
import { Provider } from 'react-redux'
import { store } from '~/redux/store'
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
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
)
