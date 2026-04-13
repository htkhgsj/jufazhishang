import { useState } from "react";
import { poemSep } from "./api/poem";
export default function App() {
  const [loading, setLoading] = useState(false);  
  const [responseData, setResponseData] = useState('');
  const [inputValue, setInputValue] = useState('');     // 输入框的内容
  const sendData = async () => {
    setLoading(true);
    try {
        const data = await poemSep(inputValue);
        setResponseData(data.data);
    } catch (error) {
        setResponseData("请求失败: " + error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>测试接口</h2>
      <div style={{ marginBottom: 20 }}>
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="请输入要发送的内容"
      style={{
        padding: '10px 12px',
        width: '400px',
        fontSize: '16px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    />
  </div>
      <button onClick={sendData} disabled={loading}>
        {loading ? "发送中..." : "发送请求"}
      </button>

      {/* 预留显示区域 */}
      <div
        style={{
          marginTop: 20,
          padding: 15,
          border: "1px solid #ccc",
          background: "#f5f5f5",
          width: "500px",
        }}
      >
        <h3>服务器返回：</h3>
        <pre>{responseData}</pre>
      </div>
    </div>
  );
}