import { CssBaseline } from '@mui/material'
import { alpha, createTheme, darken, lighten, ThemeProvider } from '@mui/material/styles'

import Panes from './Panes'
import Manager from './PubSubDataAccess'
import TopicSubTabs from './RailTabs'
import Frame, { Main, Rail } from './Structure'
import TabManager from './TabManager'

const theme = createTheme({
  palette: {
    primary: {
      main: darken('#EBA550', 0.2),
      light: lighten('#EBA550', 0.1),
      dark: darken('#EBA550', 0.3),
    },
    secondary: {
      main: '#cb5d19',
      light: '#f2cb88',
    },
    background: {
      default: '#fbf3e2',
      paper: '#fff',
    },
    divider: alpha('#EBA550', 0.4),
    text: {
      primary: darken('#EBA550', 0.65),
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 6,
  typography: {
    fontSize: 12,
    fontFamily: '"Noto Sans Indic Siyaq Numbers", sans-serif',
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
