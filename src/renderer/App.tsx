import { CssBaseline } from '@mui/material'
import { createTheme, darken, ThemeProvider } from '@mui/material/styles'


import Panes from './Panes'
import Manager from './PubSubDataAccess'
import TopicSubTabs from './RailTabs'
import Frame, { Main, Rail } from './Structure'
import TabManager from './TabManager'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1987cb',
    },
    secondary: {
      main: '#cb5d19',
      light: '#f2cb88',
    },
    background: {
      default: '#fbf3e2',
      paper: '#fff',
    },
    divider: darken('#fbf3e2', 0.1),
    text: {
      primary: darken('#fbf3e2', 0.55)
    }
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 6,
  typography: {
    fontSize: 12,
  },
})

function App() {

  return (
    <Manager>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <TabManager>
          <Frame>
            <Rail>
              <TopicSubTabs />
            </Rail>
            <Main>
              <Panes />
            </Main>
          </Frame>
        </TabManager>
      </ThemeProvider>
    </Manager>
  )
}

export default App
