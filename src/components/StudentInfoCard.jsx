import React, { useEffect, useState } from "react";
import "../styles/StudentInfoCard.css";

const fields = [
  { label: "👤 Name", key: "name" },
  { label: "🆔 Student ID", key: "studentId" },
  { label: "🛏️ Room Number", key: "roomNumber" },
  { label: "🧾 Group Assigned", key: "group" },
  { label: "📱 Phone Number", key: "phone" },
  { label: "📅 Date of Arrival", key: "arrivalDate" },
  { label: "✅ Arrival Status", key: "arrival", bool: true },
  { label: "🛌 Hostel Verified", key: "hostelVerified", bool: true },
  { label: "📄 Documents Verified", key: "documentsVerified", bool: true },
  { label: "🎒 Kit Received", key: "kitReceived", bool: true },
];

const logFields = [
  {
    section: "Arrival Log",
    volunteer: { label: "🙋‍♂️ Checked By", key: "logs.arrival.volunteer" },
    time: { label: "🕓 Time", key: "logs.arrival.timestamp" },
  },
  {
    section: "Hostel Log",
    volunteer: { label: "🧑‍💻 Checked By", key: "logs.hostel.volunteer" },
    time: { label: "🕓 Time", key: "logs.hostel.timestamp" },
  },
];

function getValue(obj, path) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}

const StudentInfoCard = ({ student }) => {
  const [typedLines, setTypedLines] = useState([]); // [{idx, value: string}]
  const [typingIdx, setTypingIdx] = useState(0); // which field is being typed
  const [typingText, setTypingText] = useState("");
  const [showLogs, setShowLogs] = useState(false);
  const [logIdx, setLogIdx] = useState(0);
  const [logTyping, setLogTyping] = useState([""]);

  useEffect(() => {
    setTypedLines([]);
    setTypingIdx(0);
    setTypingText("");
    setShowLogs(false);
    setLogIdx(0);
    setLogTyping([""]);
    if (!student) return;
    let i = 0;
    function typeField() {
      if (i < fields.length) {
        const f = fields[i];
        let value = f.bool ? (getValue(student, f.key) ? "Yes" : "No") : String(getValue(student, f.key));
        let charIdx = 0;
        function typeChar() {
          setTypingIdx(i);
          setTypingText(value.slice(0, charIdx + 1));
          if (charIdx < value.length - 1) {
            charIdx++;
            setTimeout(typeChar, 32 + Math.random() * 30);
          } else {
            setTypedLines((prev) => [...prev, { idx: i, value }]);
            setTypingText("");
            i++;
            setTimeout(typeField, 120);
          }
        }
        typeChar();
      } else {
        setShowLogs(true);
        setTimeout(() => typeLog(0), 300);
      }
    }
    function typeLog(logI) {
      if (logI < logFields.length) {
        setLogIdx(logI);
        setLogTyping(["", ""]);
        const log = logFields[logI];
        const volunteer = String(getValue(student, log.volunteer.key));
        const time = String(getValue(student, log.time.key));
        let vIdx = 0, tIdx = 0;
        function typeVolunteer() {
          setLogTyping(([, t]) => [volunteer.slice(0, vIdx + 1), t]);
          if (vIdx < volunteer.length - 1) {
            vIdx++;
            setTimeout(typeVolunteer, 32 + Math.random() * 30);
          } else {
            setTimeout(typeTime, 120);
          }
        }
        function typeTime() {
          setLogTyping(([v]) => [v, time.slice(0, tIdx + 1)]);
          if (tIdx < time.length - 1) {
            tIdx++;
            setTimeout(typeTime, 32 + Math.random() * 30);
          } else {
            setTimeout(() => typeLog(logI + 1), 200);
          }
        }
        typeVolunteer();
      }
    }
    typeField();
    // eslint-disable-next-line
  }, [student]);

  return (
    <div className="student-card glassy-student-card">
      <div className="student-card-header">
        <span className="student-icon">👤</span>
        <span className="student-name">{student.name}</span>
      </div>
      <div className="student-id">🆔 {student.studentId}</div>
      <div className="student-fields">
        {fields.map((f, idx) => {
          const typed = typedLines.find((l) => l.idx === idx);
          if (typed) {
            return (
              <div className="student-row" key={f.key}>
                <span className="student-label">{f.label}:</span>
                <span className={`student-value${f.bool ? (getValue(student, f.key) ? ' yes' : ' no') : ''}`}>{typed.value}</span>
              </div>
            );
          } else if (typingIdx === idx) {
            return (
              <div className="student-row" key={f.key}>
                <span className="student-label">{f.label}:</span>
                <span className={`student-value${f.bool ? (getValue(student, f.key) ? ' yes' : ' no') : ''}`}>{typingText}<span className="typing-cursor">|</span></span>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
      {showLogs && logFields.map((log, idx) => (
        <div className="student-log-section" key={log.section}>
          <div className="log-title">──────── {log.section} ────────</div>
          <div className="student-row">
            <span className="student-label">{log.volunteer.label}:</span>
            <span className="student-value">{logIdx === idx ? logTyping[0] : logIdx > idx ? getValue(student, log.volunteer.key) : ""}{logIdx === idx && <span className="typing-cursor">|</span>}</span>
          </div>
          <div className="student-row">
            <span className="student-label">{log.time.label}:</span>
            <span className="student-value">{logIdx === idx ? logTyping[1] : logIdx > idx ? getValue(student, log.time.key) : ""}{logIdx === idx && logTyping[1] && <span className="typing-cursor">|</span>}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StudentInfoCard;
