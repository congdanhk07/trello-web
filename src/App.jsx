import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}
function App() {
  return (
    <>
      <ModeToggle />
      <hr />
      <Typography variant='h2' color='primary.main'>
        Demo Test
      </Typography>
      <Button variant='contained'>Hello world</Button>
    </>
  )
}

export default App
