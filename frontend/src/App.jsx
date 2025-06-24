import React, { useState } from "react";
import axios from "axios";
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
      const res = await axios.post("http://localhost:5000/api/scan", {
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

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">📄 Resume Scanner with Claude AI</h2>

      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <textarea
            className="form-control mb-3"
            rows="10"
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />

          <button
            className="btn btn-primary w-100"
            onClick={scanResume}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "🔍 Analyze Resume"}
          </button>

          {result && (
            <div className="mt-4">
              <h5>🧠 AI Feedback:</h5>
              <pre
                className="bg-light p-3 border rounded"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
