import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";
import video from "./assets/anime.mp4"; // Your video path

function App() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const showCustomMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
  };

  const hideCustomMessage = () => {
    setMessage("");
    setShowMessage(false);
  };

  const scanResume = async () => {
    if (!resumeText.trim()) {
      showCustomMessage("Please enter resume content.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/scan`, {
        resumeText,
      });
      setResult(res.data.result);
    } catch (err) {
      console.error("❌ Error:", err.message);
      showCustomMessage("Error: AI API failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(result, 10, 20, {
      maxWidth: doc.internal.pageSize.width - 20,
    });
    doc.save("ai-resume-feedback.pdf");
  };

  const downloadDOCX = async () => {
    const doc = new Document({
      sections: [
        {
          children: [new Paragraph({ children: [new TextRun(result)] })],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "ai-resume-feedback.docx");
  };

  return (
    <div className="container py-2 vw-100">
      <div className="text-center mb-5">
        <h2 className="fw-bold">📄 Resume Scanner with Claude AI</h2>
        <p className="text-muted">
          Analyze your resume and get AI feedback instantly.
        </p>
      </div>

      {/* Alert Message */}
      {showMessage && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          {message}
          <button
            type="button"
            className="btn-close"
            onClick={hideCustomMessage}
          ></button>
        </div>
      )}

      <div className="row g-4">
        {/* Resume Input */}
        <div className="col-lg-7">
          <div className="card shadow rounded-4 border-0">
            <div className="card-body">
              <h5 className="card-title mb-3">Paste Resume Below</h5>
              <textarea
                className="form-control rounded-3 mb-3"
                rows="10"
                placeholder="Paste your resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <div className="d-grid">
                <button
                  className="btn btn-primary btn-lg rounded-pill"
                  onClick={scanResume}
                  disabled={loading}
                >
                  {loading ? "🔄 Analyzing..." : "🔍 Analyze Resume"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Animation Video */}
        <div className="col-lg-5">
          <div className="  overflow-hidden">
            <video
              src={video}
              autoPlay
              muted
              loop
              className="w-100"
              style={{ maxHeight: "360px", objectFit: "cover" }}
            />
            <div className=" text-center">
              <p className="text-muted mb-0">
                Smart feedback powered by Claude AI
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="row mt-5 g-4">
          <div className="col-lg-7">
            <div className="card shadow border-0 rounded-4">
              <div className="card-body">
                <h5 className="card-title">🧠 AI Feedback</h5>
                <pre
                  className="bg-light p-3 rounded-3 border"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {result}
                </pre>
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="col-lg-5 d-flex flex-column justify-content-center">
            <div className="d-grid gap-3">
              <button
                className="btn btn-outline-danger rounded-pill"
                onClick={downloadPDF}
              >
                ⬇️ Download as PDF
              </button>
              <button
                className="btn btn-outline-success rounded-pill"
                onClick={downloadDOCX}
              >
                ⬇️ Download as Word
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
