import * as React from 'react'
import { createRoot } from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import App from '~/App'
import theme from '~/theme'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  // <React.StrictMode>
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
  // </React.StrictMode>
)
