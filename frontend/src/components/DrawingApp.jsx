import html2canvas from "html2canvas";
import React, { useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import Logo from "../assets/logo.png";
import "../style/DrawingApp.css";

const DrawingApp = () => {
  const [lines, setLines] = useState([]);
  const [mode, setMode] = useState("brush");
  const [resultText, setResultText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(false);
  const isDrawing = useRef(false);
  const drawingRef = useRef(null);

  const handleMouseDown = (e) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    setLines((prev) => [...prev, { points: [pos.x, pos.y], tool: mode }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setLines((prev) => {
      const lastLine = prev[prev.length - 1];
      lastLine.points = lastLine.points.concat([point.x, point.y]);
      return [...prev.slice(0, -1), lastLine];
    });
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => setLines([]);

  const handleScreenshot = () => {
    html2canvas(drawingRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL();
      link.download = "drawing.png";
      link.click();
    });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProcessing(true);
      setIsCardVisible(true);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch("http://localhost:5000/process-image", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Backend Response:", data); // Log the response to check the data structure

          // Set the result text using the correct property from the backend response
          setResultText(data.text); // Updated to match the backend structure
        } else {
          setResultText("Error processing image.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setResultText("Error processing image.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const closeCard = () => {
    setIsCardVisible(false);
    setResultText("");
  };

  return (
    <div>
      <div className={`app-container ${isCardVisible ? "blurred" : ""}`}>
        <header className="app-header">
          <div className="logo-container">
            <img src={Logo} alt="App Logo" className="app-logo" />
            <h1 className="app-title">Drawing App</h1>
          </div>
        </header>

        <div className="tools-container">
          <label htmlFor="tool-select">Tool:</label>
          <select
            id="tool-select"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="brush">Brush</option>
            <option value="eraser">Eraser</option>
          </select>
          <button onClick={clearCanvas} className="clear-btn">
            Clear Canvas
          </button>
        </div>

        <div className="drawing-area" ref={drawingRef}>
          <Stage
            width={700}
            height={500}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.tool === "brush" ? "black" : "white"}
                  strokeWidth={5}
                  globalCompositeOperation={
                    line.tool === "brush" ? "source-over" : "destination-out"
                  }
                  lineCap="round"
                  lineJoin="round"
                />
              ))}
            </Layer>
          </Stage>
        </div>

        <button onClick={handleScreenshot} className="screenshot-btn">
          Take Screenshot
        </button>

        <label className="upload-btn">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </label>
      </div>
      {isCardVisible && (
        <div className="result-card">
          <div className="card-content">
            <button className="close-btn" onClick={closeCard}>
              ×
            </button>
            <h2>Extracted Text</h2>
            {isProcessing ? (
              <div className="spinner-container">
                <div className="spinner"></div>
                <p>Processing...</p>
              </div>
            ) : (
              <p>{resultText || "No text detected yet."}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingApp;
