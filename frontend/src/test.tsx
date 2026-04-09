import React, { useState } from "react";

export default function App() {
  const [responseData, setResponseData] = useState<string>("暂无数据");

  const sendData = async () => {
    try {
      const response = await fetch("http://localhost:3001/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "hello server" }),
      });

      const data = await response.json();
      setResponseData(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponseData("请求失败: " + error);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>测试接口</h2>

      <button onClick={sendData}>发送请求</button>

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