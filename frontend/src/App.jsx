import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const scanResume = async () => {
    if (!resumeText.trim()) return alert("Please enter resume content.");
    setLoading(true);
    setResult("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/scan`, {
        resumeText,
      });
      setResult(res.data.result);
    } catch (err) {
      console.error("❌ Error:", err.message);
      setResult("Error: AI API failed. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(result, 10, 20);
    doc.save("ai-resume-feedback.pdf");
  };

  const downloadDOCX = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [new Paragraph({ children: [new TextRun(result)] })],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "ai-resume-feedback.docx");
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <h2 className="mb-4 text-center">📄 Resume Scanner with Claude AI</h2>

          <textarea
            className="form-control mb-3"
            rows="10"
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          <div className="d-grid">
            <button
              className="btn btn-primary"
              onClick={scanResume}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "🔍 Analyze Resume"}
            </button>
          </div>

          {result && (
            <div className="mt-4">
              <h5>🧠 AI Feedback:</h5>
              <pre className="bg-light p-3 border rounded">{result}</pre>

              <div className="mt-3 d-flex gap-3">
                <button
                  className="btn btn-outline-danger"
                  onClick={downloadPDF}
                >
                  ⬇️ Download as PDF
                </button>
                <button
                  className="btn btn-outline-success"
                  onClick={downloadDOCX}
                >
                  ⬇️ Download as Word
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
