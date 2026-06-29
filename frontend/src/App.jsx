import React, { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  Printer, 
  RefreshCw, 
  CheckCircle2,
  FileCode2
} from 'lucide-react';
import { mockIllustrations } from './mockData';

export default function App() {
  const [view, setView] = useState('input'); // 'input', 'loading', 'result', 'error'
  const [mode, setMode] = useState('text'); // 'text', 'pdf'
  
  const [textValue, setTextValue] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfBase64, setPdfBase64] = useState('');
  const [pdfTextExtracted, setPdfTextExtracted] = useState('');
  const [dragActive, setDragActive] = useState(false);
  
  const [loadingMessage, setLoadingMessage] = useState('Reading PDF...');
  const [errorMessage, setErrorMessage] = useState('');
  const [resultData, setResultData] = useState(null);
  
  const fileInputRef = useRef(null);

  // Transition messages for loader
  useEffect(() => {
    let timer;
    if (view === 'loading') {
      if (mode === 'pdf') {
        setLoadingMessage('Reading PDF...');
        timer = setTimeout(() => {
          setLoadingMessage('Analysing benefit structures...');
        }, 2200);
      } else {
        setLoadingMessage('Reading text illustration...');
        timer = setTimeout(() => {
          setLoadingMessage('Analysing cash flows...');
        }, 1500);
      }
    }
    return () => clearTimeout(timer);
  }, [view, mode]);

  // Handle Drag & Drop events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        processPdfFile(file);
      } else {
        alert("Please drop a valid PDF file.");
      }
    }
  };

  // Convert PDF to Base64 and extract text using PDF.js CDN
  const processPdfFile = async (file) => {
    setPdfFile(file);
    setPdfTextExtracted('');
    
    // 1. Read Base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target.result.split(',')[1];
      setPdfBase64(base64String);
    };
    reader.onerror = () => {
      alert("Error reading file");
    };
    reader.readAsDataURL(file);

    // 2. Read text via PDF.js if available in window
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      if (pdfjsLib) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let extracted = "";
        
        // Scan first 5 pages of the illustration
        const pagesToScan = Math.min(5, pdf.numPages);
        for (let i = 1; i <= pagesToScan; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map(item => item.str).join(" ");
          extracted += pageText + "\n";
        }
        
        setPdfTextExtracted(extracted);
        console.log("PDF.js successfully extracted characters: ", extracted.length);
      } else {
        console.warn("PDF.js library not loaded yet.");
      }
    } catch (err) {
      console.error("Failed client-side PDF text extraction:", err);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processPdfFile(e.target.files[0]);
    }
  };

  const handleExampleClick = (illustration) => {
    setMode('text');
    setTextValue(illustration.text);
  };

  const resetForm = () => {
    setTextValue('');
    setPdfFile(null);
    setPdfBase64('');
    setPdfTextExtracted('');
    setErrorMessage('');
    setResultData(null);
    setView('input');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Submit to Backend API
  const handleGenerate = async () => {
    setView('loading');
    setErrorMessage('');
    
    try {
      let endpoint = '';
      let payload = {};
      
      if (mode === 'text') {
        endpoint = '/api/explain-text';
        payload = { text: textValue };
      } else {
        endpoint = '/api/explain-pdf';
        payload = { 
          base64: pdfBase64,
          filename: pdfFile ? pdfFile.name : '',
          extractedText: pdfTextExtracted
        };
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred while analyzing the illustration.');
      }
      
      setResultData(data);
      setView('result');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Server connection failed. Make sure the backend is running and .env contains the API key.');
      setView('error');
    }
  };

  // Goal class helper
  const getGoalThemeClass = (goal) => {
    if (!goal) return 'goal-family-protection';
    const g = goal.toLowerCase();
    if (g.includes('protection')) return 'goal-family-protection';
    if (g.includes('second income') || g.includes('income')) return 'goal-second-income';
    if (g.includes('single premium')) return 'goal-single-premium';
    if (g.includes('wealth creation') || g.includes('wealth')) return 'goal-wealth-creation';
    if (g.includes('child') || g.includes('education') || g.includes('marriage')) return 'goal-child-edu';
    if (g.includes('retirement')) return 'goal-retirement';
    return 'goal-family-protection';
  };

  // Goal Icon helper
  const getGoalIcon = (goal) => {
    if (!goal) return '🛡️';
    const g = goal.toLowerCase();
    if (g.includes('protection')) return '🛡️';
    if (g.includes('second income') || g.includes('income')) return '💰';
    if (g.includes('single premium')) return '⚡';
    if (g.includes('wealth')) return '📈';
    if (g.includes('child') || g.includes('education') || g.includes('marriage')) return '🎓';
    if (g.includes('retirement')) return '🏡';
    return '🛡️';
  };

  const isGenerateDisabled = mode === 'text' ? !textValue.trim() : !pdfBase64;

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo-box">B</div>
          <div className="brand-text">
            <span className="brand-title">Bajaj Capital</span>
            <span className="brand-subtitle">BI Explainer · RM Tool</span>
          </div>
        </div>
        <div className="nav-actions">
          {view === 'result' && (
            <button className="btn btn-secondary" onClick={resetForm}>
              <RefreshCw size={16} />
              New BI
            </button>
          )}
          {view === 'result' && (
            <button className="btn btn-primary" onClick={() => window.print()}>
              <Printer size={16} />
              Save / Print
            </button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="container">
          
          {/* 1. INPUT SCREEN */}
          {view === 'input' && (
            <div className="input-view-container animate-fade">
              
              {/* Toggle Bar */}
              <div className="toggle-bar">
                <button 
                  className={`toggle-btn ${mode === 'text' ? 'active' : ''}`}
                  onClick={() => setMode('text')}
                >
                  Paste Text
                </button>
                <button 
                  className={`toggle-btn ${mode === 'pdf' ? 'active' : ''}`}
                  onClick={() => setMode('pdf')}
                >
                  Upload PDF
                </button>
              </div>

              {/* Input Card */}
              <div className="input-panel">
                <h2>BI Explainer Card Generator</h2>
                <p className="lead-text">
                  Translate dense benefit illustration spreadsheets into clean, RM-friendly visual client summaries.
                </p>

                {mode === 'text' ? (
                  <div className="textarea-container">
                    <textarea
                      className="textarea-input"
                      placeholder="Paste the raw Benefit Illustration (BI) text here..."
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="drop-container">
                    {!pdfFile ? (
                      <div 
                        className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                        <div className="drop-icon-wrapper">
                          <UploadCloud size={32} />
                        </div>
                        <h3>Drag & drop Benefit Illustration PDF</h3>
                        <p>Or click to browse from files (max 32MB)</p>
                      </div>
                    ) : (
                      <div className="file-confirm">
                        <CheckCircle2 className="file-confirm-icon" size={24} />
                        <div style={{ flexGrow: 1, textAlign: 'left' }}>
                          <h4 style={{ fontWeight: 700, fontSize: '15px' }}>{pdfFile.name}</h4>
                          <p style={{ fontSize: '12px', opacity: 0.85 }}>Ready for AI analysis ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                        </div>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => {
                            setPdfFile(null);
                            setPdfBase64('');
                            setPdfTextExtracted('');
                            if (fileInputRef.current) {
                              fileInputRef.current.value = '';
                            }
                          }}
                        >
                          Change File
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '16px' }}
                  disabled={isGenerateDisabled}
                  onClick={handleGenerate}
                >
                  Generate BI Explainer Card
                </button>
              </div>

              {/* Pre-fill Quick Starts */}
              <div className="examples-section">
                <h3 className="examples-title">Quick-Start Benefit Illustrations</h3>
                <div className="examples-grid">
                  {mockIllustrations.map((ill) => (
                    <button
                      key={ill.id}
                      className="example-card"
                      onClick={() => handleExampleClick(ill)}
                    >
                      <span className={`example-badge ${getGoalThemeClass(ill.badge)}`}>
                        {ill.badge}
                      </span>
                      <h4 className="example-card-title">{ill.title}</h4>
                      <p className="example-card-subtitle">{ill.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 2. LOADING SCREEN */}
          {view === 'loading' && (
            <div className="loading-panel">
              <div className="spinner"></div>
              <h3 className="loading-title">Reading Benefit Illustration</h3>
              <p className="loading-text">{loadingMessage}</p>
            </div>
          )}

          {/* 3. ERROR SCREEN */}
          {view === 'error' && (
            <div className="error-panel">
              <div className="error-title">
                <AlertCircle size={28} />
                Failed to Analyse Illustration
              </div>
              <p className="error-text">{errorMessage}</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={handleGenerate}>
                  Retry Analysis
                </button>
                <button className="btn btn-secondary" onClick={resetForm}>
                  Back to Input
                </button>
              </div>
            </div>
          )}

          {/* 4. RESULT EXPLAINER CARD */}
          {view === 'result' && resultData && (
            <div className={`output-wrapper ${getGoalThemeClass(resultData.goal)}`}>
              
              {/* Output Explainer Card */}
              <div className="bi-card">
                
                {/* Section 1: Goal Banner */}
                <header className="bi-goal-banner">
                  <div className="banner-circle circle-1"></div>
                  <div className="banner-circle circle-2"></div>
                  
                  <div className="banner-left">
                    <div className="goal-label-wrapper">
                      <span className="goal-icon-square">{getGoalIcon(resultData.goal)}</span>
                      <span className="goal-lbl">Financial Goal</span>
                    </div>
                    <h1 className="goal-title-large">{resultData.goal || 'Goal Not Detected'}</h1>
                    <p className="goal-tagline-italic">“Secure today, empower tomorrow”</p>
                  </div>
                  
                  <div className="banner-right">
                    <span className="insurer-name">{resultData.insurer || 'Insurer'}</span>
                    <h2 className="product-name-heading">{resultData.product_name || 'Product Illustration'}</h2>
                  </div>
                </header>

                {/* Section 2: Details Ribbon */}
                <div className="bi-details-ribbon">
                  <span className="policy-pill">
                    {resultData.policy_type || 'Custom Policy Plan'}
                  </span>
                  <h2 className="ribbon-headline">
                    {resultData.headline || 'Your Financial Plan Benefits'}
                  </h2>
                  <p className="ribbon-tagline">
                    {resultData.tagline || 'This plan is tailored to match your specific financial milestone goals.'}
                  </p>

                  {/* 3-Column Detail Chips */}
                  <div className="details-grid-chips">
                    {resultData.details && resultData.details.map((detail, idx) => (
                      <div key={idx} className="detail-chip">
                        <div className="chip-icon-box">
                          <span>{detail.icon || '📊'}</span>
                        </div>
                        <div className="chip-meta">
                          <span className="chip-label">{detail.label}</span>
                          <span className="chip-value">{detail.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Dual Column Body */}
                <div className="bi-columns-container">
                  
                  {/* LEFT Column: Policy Journey Timeline */}
                  <div className="timeline-col">
                    <h3 className="column-header">Your Policy Journey</h3>
                    <div className="timeline-container">
                      <div className="timeline-line"></div>
                      
                      {resultData.milestones && resultData.milestones.map((milestone, idx) => (
                        <div key={idx} className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div className={`milestone-card type-${milestone.type || 'pay'}`}>
                            <div className="milestone-header">
                              <span className="milestone-year">{milestone.year}</span>
                              <span className={`milestone-badge type-${milestone.type || 'pay'}`}>
                                {milestone.type === 'pay' && '💸 Pay'}
                                {milestone.type === 'wait' && '🗓️ Wait'}
                                {milestone.type === 'receive' && '🔄 Receive'}
                                {milestone.type === 'end' && '🏦 End'}
                              </span>
                            </div>
                            <h4 className="milestone-event">{milestone.event}</h4>
                            <p className="milestone-detail">{milestone.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT Column: How This Works For You */}
                  <div className="benefits-col">
                    <h3 className="column-header">How This Works For You</h3>
                    <div className="benefits-container">
                      {resultData.how_it_works && resultData.how_it_works.map((item, idx) => (
                        <div key={idx} className="benefit-card">
                          <div className="benefit-icon-box">
                            <span>{item.icon || '✨'}</span>
                          </div>
                          <div className="benefit-info">
                            <h4 className="benefit-title">{item.title}</h4>
                            <p className="benefit-desc">{item.point}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Column Footer */}
                    <div className="column-footer">
                      <p className="disclaimer-text">
                        {resultData.disclaimer || 'Figures are illustrative as per BI. Subject to policy terms.'}
                      </p>
                      <span className="broking-branding">
                        Bajaj Capital Insurance Broking
                      </span>
                    </div>
                  </div>

                </div>

                {/* Bottom Accent Bar */}
                <div className="bottom-accent-bar"></div>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
