/* eslint import/no-unresolved: off */
import { useEffect, useLayoutEffect, useRef } from 'react'

import { Box } from '@mui/material'
import * as monaco from 'monaco-editor'

// @ts-expect-error worker url is not found or typed
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
// @ts-expect-error worker url is not found or typed
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'

self.MonacoEnvironment = {
  getWorker: (_, label) => {
    if (label === 'json') {
      return new jsonWorker()
    }
    return new editorWorker()
  },
}

const Editor = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
  const elemRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>()

  const changeListener = useRef(onChange)
  changeListener.current = onChange

  useEffect(() => {
    return () => editorRef.current?.dispose()
  }, [])
  useLayoutEffect(() => {
    if (editorRef.current) {
      return
    }

    const editor = monaco.editor.create(elemRef.current!, {
      value: '{}',
      language: 'json',
      minimap: { enabled: false },
      overviewRulerLanes: 0,
      tabSize: 2,
      fontSize: 14,
    })
    editorRef.current = editor
    editor.onDidChangeModelContent(() => {
      changeListener.current(editor.getValue())
    })
  }, [])
  useEffect(() => {
    if (editorRef.current) {
      if (editorRef.current.getValue() !== value) {
        editorRef.current.setValue(value)
      }
    }
  }, [value])
  return (
    <Box
      ref={elemRef}
      sx={{
        minHeight: 300,
      }}
    ></Box>
  )
}

export default Editor
