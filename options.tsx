import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

const Options = () => {
  // 使用 Plasmo 存储钩子管理配置
  const [headers, setHeaders] = useStorage("headers", [])
  const [urlPatterns, setUrlPatterns] = useStorage("urlPatterns", [
    "<all_urls>"
  ])
  const [status, setStatus] = useState("")

  // 添加新的 Header 输入框
  const addHeader = () => {
    setHeaders([...headers, { name: "", value: "" }])
  }

  // 删除 Header
  const removeHeader = (index) => {
    if (headers.length <= 1) return
    const newHeaders = [...headers]
    newHeaders.splice(index, 1)
    setHeaders(newHeaders)
  }

  // 更新单个 Header 的值
  const updateHeader = (index, key, value) => {
    const newHeaders = [...headers]
    newHeaders[index][key] = value
    setHeaders(newHeaders)
  }

  // 保存配置
  const saveConfig = () => {
    // 过滤空名称的 Header
    const validHeaders = headers.filter((h) => h.name.trim())
    setHeaders(validHeaders)

    // 处理 URL 规则
    const patterns = urlPatterns
      .join("\n")
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p)

    setUrlPatterns(patterns.length ? patterns : ["<all_urls>"])
    setStatus("配置已保存！")
    setTimeout(() => setStatus(""), 2000)
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h2>Header 注入配置</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>自定义 Header</h3>
        {headers.map((header, index) => (
          <div
            key={index}
            style={{ display: "flex", gap: "10px", margin: "10px 0" }}>
            <input
              type="text"
              placeholder="Header 名称"
              value={header.name}
              onChange={(e) => updateHeader(index, "name", e.target.value)}
              style={{ flex: 1, padding: "8px" }}
            />
            <input
              type="text"
              placeholder="Header 值"
              value={header.value}
              onChange={(e) => updateHeader(index, "value", e.target.value)}
              style={{ flex: 1, padding: "8px" }}
            />
            <button
              onClick={() => removeHeader(index)}
              style={{ padding: "0 12px" }}>
              -
            </button>
          </div>
        ))}
        <button onClick={addHeader} style={{ padding: "8px 16px" }}>
          + 添加 Header
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>生效 URL 规则</h3>
        <textarea
          placeholder="每行一个规则，例如：https://*.example.com/*"
          value={urlPatterns.join("\n")}
          onChange={(e) => setUrlPatterns(e.target.value.split("\n"))}
          rows={4}
          style={{ width: "100%", padding: "8px", marginTop: "8px" }}
        />
        <p style={{ fontSize: "12px", color: "#666" }}>
          默认为 &lt;all_urls&gt;（所有链接）
        </p>
      </div>

      <button
        onClick={saveConfig}
        style={{ padding: "10px 20px", fontSize: "16px" }}>
        保存配置
      </button>

      {status && <p style={{ color: "green", marginTop: "10px" }}>{status}</p>}
    </div>
  )
}

export default Options
