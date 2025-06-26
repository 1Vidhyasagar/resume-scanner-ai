import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";
import "bootstrap/dist/css/bootstrap.min.css";
import video from "./assets/anime.mp4"; // Assuming this path is correct for your video file

function App() {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  // Removed showVideoControls state as it's no longer needed for hover functionality
  const [message, setMessage] = useState(""); // State for custom message box content
  const [showMessage, setShowMessage] = useState(false); // State to control custom message box visibility

  /**
   * Displays a custom message in a Bootstrap alert.
   * @param {string} msg - The message to display.
   */
  const showCustomMessage = (msg) => {
    setMessage(msg);
    setShowMessage(true);
  };

  /**
   * Hides the custom message box.
   */
  const hideCustomMessage = () => {
    setShowMessage(false);
    setMessage("");
  };

  /**
   * Handles the resume scanning process by calling the backend API.
   * Displays a message if no resume content is entered or if the API fails.
   */
  const scanResume = async () => {
    if (!resumeText.trim()) {
      showCustomMessage("Please enter resume content.");
      return;
    }
    setLoading(true);
    setResult(""); // Clear previous result

    try {
      // Make a POST request to the backend API
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/scan`, {
        resumeText,
      });
      setResult(res.data.result); // Set the AI feedback result
    } catch (err) {
      console.error("❌ Error:", err.message);
      showCustomMessage("Error: AI API failed. Check backend.");
    } finally {
      setLoading(false); // End loading state
    }
  };

  /**
   * Downloads the AI feedback as a PDF file.
   */
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    // Add the AI feedback text to the PDF document
    doc.text(result, 10, 20, {
      maxWidth: doc.internal.pageSize.width - 20, // Ensure text wraps within page
    });
    doc.save("ai-resume-feedback.pdf");
  };

  /**
   * Downloads the AI feedback as a DOCX (Word) file.
   */
  const downloadDOCX = async () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun(result)], // Add the AI feedback text as a paragraph
            }),
          ],
        },
      ],
    });

    // Generate the DOCX file as a Blob and save it
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "ai-resume-feedback.docx");
  };

  return (
    <div className="container p-2 m-4">
    <div></div>
      <h2 className="mb-4 text-center">📄 Resume Scanner with Claude AI</h2>

      {/* Custom Message Box - appears when showMessage is true */}
      {showMessage && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          {message}
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={hideCustomMessage}
          ></button>
        </div>
      )}

      {/* Top Row: Resume Input (left) and Animation Video (right) */}
      <div className="row align-items-start mb-4">
        {/* Left Column (Top): Resume Input and Scan Button */}
        <div className="col-md-7">
          <textarea
            className="form-control mb-3 rounded" // Added rounded for consistent style
            rows="10"
            placeholder="Paste your resume text here..."
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <div className="d-grid">
            <button
              className="btn btn-primary rounded" // Added rounded for consistent style
              onClick={scanResume}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "🔍 Analyze Resume"}
            </button>
          </div>
        </div>

        {/* Right Column (Top): Animation Video */}
        <div
          className="col-md-5 text-center mt-4 mt-md-0" // mt-4 for small screens, mt-md-0 for medium+ screens
          // Removed onMouseEnter and onMouseLeave handlers
        >
          <video
            src={video}
            autoPlay // Automatically play the video
            loop // Loop the video
            muted // Mute the video for autoplay to work reliably
            className="img-fluid rounded" // Make video responsive and add rounded corners
            style={{ maxHeight: "500px", width: "100%", objectFit: "cover" }} // Set max height, full width, and cover fit
          >
            Your browser does not support the video tag.
          </video>
          <p className="text-muted mt-2">Smart feedback powered by Claude AI</p>
        </div>
      </div>

      {/* Bottom Row: AI Feedback (left) and Download Buttons (right) */}
      {result && ( // This row only appears once AI feedback is available
        <div className="row align-items-start">
          {/* Left Column (Bottom): AI Feedback Display */}
          <div className="col-md-7">
            <h5 className="mt-3">🧠 AI Feedback:</h5>{" "}
            {/* Added mt-3 for spacing from the elements above */}
            <pre className="bg-light p-3 border rounded">{result}</pre>{" "}
            {/* Pre-formatted text with styling */}
          </div>

          {/* Right Column (Bottom): Download Buttons */}
          <div className="col-md-5 mt-3 mt-md-5 d-flex flex-column align-items-start justify-content-center">
            <div className="d-flex gap-3 w-100 justify-content-start">
              <button
                className="btn btn-outline-danger flex-grow-1 rounded" // Flex-grow-1 for equal width, added rounded
                onClick={downloadPDF}
              >
                ⬇️ Download as PDF
              </button>
              <button
                className="btn btn-outline-success flex-grow-1 rounded" // Flex-grow-1 for equal width, added rounded
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
