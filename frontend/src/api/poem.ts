export interface Atoms {
  code: number;
  message: string;
  data: string;

}
export async function poemSep(poem:string): Promise<Atoms> {
    const res = await fetch("http://localhost:3001/api/poemSep", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ poem }), // 将输入框的内容作为请求体发送
    });
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
}