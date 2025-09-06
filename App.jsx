import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "أهلاً! أنا مساعد كيان. اختر مجال أو ابدأ بالسؤال." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("عام");
  const chatRef = useRef(null);

  const topics = ["التقنية", "الذكاء الاصطناعي", "الوظائف", "التدريب", "ريادة الأعمال", "عام"];

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userText, topic }]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("/api/chat", { message: userText, topic });
      const botText = res.data?.reply || "عذراً، لم أتمكن من الرد الآن.";
      setMessages(prev => [...prev, { role: "bot", text: botText, topic }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "bot", text: "حدث خطأ عند الاتصال بالخادم." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app" dir="rtl">
      <div className="header">
        <div>
          <div className="h-title">كيان — مساعد شباب مصر</div>
          <div className="small">
            اسأل أي حاجة عن المجالات: التقنية، الذكاء الاصطناعي، الوظائف، التدريب، ريادة الأعمال.
          </div>
        </div>
      </div>

      <div className="topics">
        {topics.map(t => (
          <div key={t} className={`topic ${t === topic ? "active" : ""}`} onClick={() => setTopic(t)}>
            {t}
          </div>
        ))}
      </div>

      <div ref={chatRef} className="chat-window">
        {messages.map((m, idx) => (
          <div className={`message ${m.role}`} key={idx}>
            <div className={`bubble ${m.role === "bot" ? "bot" : ""}`}>
              <div className="small">{m.role === "bot" ? "كيان" : "أنت"}</div>
              <div>{m.text}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <div className="bubble bot">جاري الكتابة...</div>
          </div>
        )}
      </div>

      <div className="controls">
        <input
          className="input"
          placeholder="اكتب سؤالك هنا..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button className="btn" onClick={sendMessage}>أرسل</button>
      </div>
    </div>
  );
}
