import { useState } from 'react'
import { AutoComplete, Button } from 'antd'
import { useAtom, useSetAtom } from 'jotai'
import { modelUrlAtom } from '@/atoms/model'
import { urlHistoryAtom } from '@/atoms/history'
import { useSearchParams } from 'react-router'

export default function UrlInputBar() {
  const setModelUrl = useSetAtom(modelUrlAtom)
  const [history, setHistory] = useAtom(urlHistoryAtom)
  const [inputValue, setInputValue] = useState('')
  const [, setSearchParams] = useSearchParams()

  const handleLoad = () => {
    const url = inputValue.trim()
    if (!url) return
    setModelUrl(url)
    setSearchParams({ model: url })
    setHistory((prev) => {
      const filtered = prev.filter((u) => u !== url)
      return [url, ...filtered].slice(0, 20)
    })
  }

  const options = history.map((url) => ({ value: url, label: url }))

  return (
    <div style={{ display: 'flex', gap: 8, flex: 1 }}>
      <AutoComplete
        value={inputValue}
        onChange={setInputValue}
        options={options}
        style={{ flex: 1 }}
        placeholder="输入 .model3.json 或 .model.json 地址"
        filterOption={(input, option) =>
          (option?.value as string)?.toLowerCase().includes(input.toLowerCase())
        }
        onKeyDown={(e) => e.key === 'Enter' && handleLoad()}
      />
      <Button type="primary" onClick={handleLoad}>
        Load
      </Button>
    </div>
  )
}
