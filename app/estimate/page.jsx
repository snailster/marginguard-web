'use client';

import { useState, useRef, useEffect } from 'react';
import { compressImage } from '../../lib/compressImage';
import { saveOfflineItem, syncPendingQueue } from '../../lib/offlineEngine';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'
);

const dict = {
  en: {
    title: 'MARGIN',
    titleAccent: 'GUARD',
    subTitle: 'MarginGuard Contracting',
    activeJobSite: 'ACTIVE JOB SITE',
    newJob: '+ New Job',
    manageJobs: 'Manage Jobs',
    noJobsYet: 'No active job sites created yet. Tap "+ New Job" to add your first job site.',
    quickPresets: 'Quick Preset Templates',
    findSub: '⚡ Find Trade Sub',
    siteEvidence: 'Site Evidence Photos',
    capture: '📷 Capture',
    tapToOpen: 'Tap Here to Open Camera / Upload Evidence',
    scopeNotes: 'Work Variation Scope Notes',
    dictate: '🎙️ Dictate Scope',
    listening: '🎙️ Listening...',
    describeChanges: 'Describe site changes or tap dictation...',
    calculateQuote: 'CALCULATE AI COST & PROFIT QUOTE',
    authPad: 'Client Digital Authorization Pad',
    clearPad: 'Clear Pad',
    clientNameLabel: 'PRINT CLIENT FULL NAME',
    clientNamePlaceholder: 'e.g., John Smith',
    saveOrder: 'SAVE & GENERATE SITE VARIATION ORDER',
    payDeposit: '💳 COLLECT DEPOSIT VIA STRIPE',
    newLogTab: 'NEW LOG',
    logsTab: 'LOGS',
    marginTab: 'MARGIN',
    settingsTab: 'SETTINGS',
    jobModalTitle: 'Manage Active Job Sites',
    addJobLabel: 'Add New Job Site',
    jobInputPlaceholder: 'e.g., MG-1002 — Oak St Kitchen Expansion',
    addBtn: 'Add Job',
    editBtn: 'Edit',
    saveBtn: 'Save',
    deleteBtn: 'Delete',
    cancelBtn: 'Cancel',
    closeBtn: 'Close',
    selectJobPrompt: '-- Select Active Job Site --',
    presets: ['Rock Excavation', 'Plumbing Reroute', 'Electrical Upgrade', 'Subfloor Repair', 'Extra Debris Removal'],
  },
  es: {
    title: 'MARGIN',
    titleAccent: 'GUARD',
    subTitle: 'MarginGuard Contratistas',
    activeJobSite: 'SITIO DE TRABAJO ACTIVO',
    newJob: '+ Nuevo Sitio',
    manageJobs: 'Gestionar',
    noJobsYet: 'No hay sitios de trabajo creados. Toca "+ Nuevo Sitio" para agregar el primero.',
    quickPresets: 'Plantillas de Presets Rápidos',
    findSub: '⚡ Buscar Subcontratista',
    siteEvidence: 'Fotos de Evidencia del Sitio',
    capture: '📷 Capturar',
    tapToOpen: 'Toca aquí para abrir cámara / subir evidencia',
    scopeNotes: 'Notas de Variación de Obra',
    dictate: '🎙️ Dictar Alcance',
    listening: '🎙️ Escuchando...',
    describeChanges: 'Describe cambios en la obra o toca dictado...',
    calculateQuote: 'CALCULAR COSTO IA Y COTIZACIÓN',
    authPad: 'Panel de Autorización Digital del Cliente',
    clearPad: 'Limpiar Panel',
    clientNameLabel: 'NOMBRE COMPLETO DEL CLIENTE',
    clientNamePlaceholder: 'ej., Juan Pérez',
    saveOrder: 'GUARDAR Y GENERAR ORDEN DE VARIACIÓN',
    payDeposit: '💳 COBRAR DEPÓSITO VÍA STRIPE',
    newLogTab: 'NUEVO REGISTRO',
    logsTab: 'REGISTROS',
    marginTab: 'MARGEN',
    settingsTab: 'CONFIGURACIÓN',
    jobModalTitle: 'Gestionar Sitios de Trabajo Activos',
    addJobLabel: 'Agregar Nuevo Sitio de Trabajo',
    jobInputPlaceholder: 'ej., MG-1002 — Remodelación Cocina Calle Principal',
    addBtn: 'Agregar',
    editBtn: 'Editar',
    saveBtn: 'Guardar',
    deleteBtn: 'Eliminar',
    cancelBtn: 'Cancelar',
    closeBtn: 'Cerrar',
    selectJobPrompt: '-- Seleccionar Sitio de Trabajo Activo --',
    presets: ['Excavación de Roca', 'Desvío de Tuberías', 'Mejora Eléctrica', 'Reparación de Subsuelo', 'Retiro de Escombros'],
  }
};

export default function MarginGuardApp() {
  const [lang, setLang] = useState('en');
  const t = dict[lang];

  const [activeTab, setActiveTab] = useState('new_log');
  const [hourlyRate] = useState(85);
  
  const [jobSites, setJobSites] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [showJobModal, setShowJobModal] = useState(false);
  const [newJobInput, setNewJobInput] = useState('');
  const [editingJobIndex, setEditingJobIndex] = useState(null);
  const [editJobInput, setEditJobInput] = useState('');

  const [scopeNotes, setScopeNotes] = useState('');
  const [photos, setPhotos] = useState([]);
  const [clientName, setClientName] = useState('');
  const [isDictating, setIsDictating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [estimation, setEstimation] = useState(null);

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // 1. Load saved job sites
  useEffect(() => {
    const savedJobs = localStorage.getItem('marginguard_jobs');
    if (savedJobs) {
      try {
        const parsed = JSON.parse(savedJobs);
        setJobSites(parsed);
        if (parsed.length > 0) setSelectedJob(parsed[0]);
      } catch (err) {
        console.error('Failed to parse stored job sites:', err);
      }
    }
  }, []);

  // 2. Listen for Stripe return status
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('status') === 'success') {
      alert('✅ Payment deposit received successfully! Order updated.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (query.get('status') === 'cancelled') {
      alert('⚠️ Payment process was cancelled.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const saveJobsToStorage = (updatedJobs) => {
    setJobSites(updatedJobs);
    localStorage.setItem('marginguard_jobs', JSON.stringify(updatedJobs));
  };

  const handleAddJob = (e) => {
    e.preventDefault();
    if (!newJobInput.trim()) return;
    const updated = [...jobSites, newJobInput.trim()];
    saveJobsToStorage(updated);
    setSelectedJob(newJobInput.trim());
    setNewJobInput('');
  };

  const handleStartEditJob = (index) => {
    setEditingJobIndex(index);
    setEditJobInput(jobSites[index]);
  };

  const handleSaveEditJob = (index) => {
    if (!editJobInput.trim()) return;
    const updated = [...jobSites];
    const oldName = updated[index];
    updated[index] = editJobInput.trim();
    saveJobsToStorage(updated);
    if (selectedJob === oldName) setSelectedJob(editJobInput.trim());
    setEditingJobIndex(null);
    setEditJobInput('');
  };

  const handleDeleteJob = (index) => {
    const jobToDelete = jobSites[index];
    const updated = jobSites.filter((_, i) => i !== index);
    saveJobsToStorage(updated);
    if (selectedJob === jobToDelete) {
      setSelectedJob(updated.length > 0 ? updated[0] : '');
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [activeTab]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const addPreset = (presetText) => {
    setScopeNotes((prev) => (prev ? `${prev}\n• ${presetText}` : `• ${presetText}`));
  };

  const toggleDictation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      return alert(lang === 'es' ? 'Dictado de voz no soportado en este navegador.' : 'Voice dictation is not supported by this browser.');
    }

    if (isDictating) {
      setIsDictating(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'es' ? 'es-ES' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsDictating(true);
    recognition.onend = () => setIsDictating(false);
    recognition.onerror = () => setIsDictating(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setScopeNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.start();
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 3) {
      return alert(lang === 'es' ? 'Máximo 3 fotos de evidencia permitidas.' : 'Maximum of 3 site evidence photos allowed per variation log.');
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhotos((prev) => [...prev, uploadEvent.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCalculateAI = async () => {
    if (!selectedJob) {
      return alert(lang === 'es' ? 'Por favor cree o seleccione un sitio de trabajo activo.' : 'Please create or select an active job site first.');
    }
    if (!scopeNotes && photos.length === 0) {
      return alert(lang === 'es' ? 'Ingrese notas de alcance o tome una foto primero.' : 'Please enter scope notes or capture a site photo first.');
    }

    setLoading(true);
    try {
      let imageBase64 = null;
      if (photos.length > 0) {
        imageBase64 = photos[0].split(',')[1];
      }

      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          jobType: selectedJob,
          userPrompt: scopeNotes,
          hourlyRate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to calculate quote');

      setEstimation(data.estimation);
    } catch (err) {
      alert(`Calculation error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleStripeCheckout = async (depositAmount) => {
    if (!selectedJob) return alert(lang === 'es' ? 'Por favor seleccione un sitio de trabajo.' : 'Please select an active job site.');

    setPaying(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: selectedJob,
          amount: depositAmount || (estimation ? Math.round(estimation.financials.targetSellPrice * 0.25) : 250),
          clientName: clientName || 'Client',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initiate Stripe Checkout');

      window.location.href = data.url;
    } catch (err) {
      alert(`Payment Error: ${err.message}`);
    } finally {
      setPaying(false);
    }
  };

  const handleSaveVariationOrder = async () => {
    if (!selectedJob) return alert(lang === 'es' ? 'Por favor seleccione un sitio de trabajo.' : 'Please select an active job site.');
    if (!clientName) return alert(lang === 'es' ? 'Por favor ingrese el nombre del cliente.' : 'Please print the client full name.');
    alert(lang === 'es' ? `¡Orden de variación guardada para ${selectedJob}! Cliente: ${clientName}` : `Site Variation Order generated for ${selectedJob}! Client: ${clientName}`);
  };

  return (
    <div style={{ backgroundColor: '#0b0d10', color: '#f8fafc', minHeight: '100vh', paddingBottom: '90px', fontFamily: 'sans-serif' }}>
      
      {/* HEADER BAR */}
      <header style={{ padding: '16px 20px', borderBottom: '1px solid #1f242d', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f1217' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#facc15', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(250, 204, 21, 0.2)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-5.45 9-12V5l-9-3z" fill="#0b0d10" />
              <path d="M10 15.5l-3.5-3.5 1.41-1.41L10 12.67l6.09-6.09L17.5 8z" fill="#facc15" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: 0, letterSpacing: '0.5px', lineHeight: '1.1' }}>
              {t.title}<span style={{ color: '#facc15' }}>{t.titleAccent}</span>
            </h1>
            <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>{t.subTitle}</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#181c24', border: '1px solid #374151', borderRadius: '8px', padding: '3px', display: 'flex' }}>
          <button
            type="button"
            onClick={() => setLang('en')}
            style={{
              backgroundColor: lang === 'en' ? '#facc15' : 'transparent',
              color: lang === 'en' ? '#000' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: '900',
              cursor: 'pointer'
            }}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('es')}
            style={{
              backgroundColor: lang === 'es' ? '#facc15' : 'transparent',
              color: lang === 'es' ? '#000' : '#9ca3af',
              border: 'none',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: '900',
              cursor: 'pointer'
            }}
          >
            ES
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '600px', margin: '0 auto', padding: '16px' }}>
        {activeTab === 'new_log' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* CARD 1: ACTIVE JOB SITE */}
            <div style={{ backgroundColor: '#161a22', border: '1px solid #232936', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#facc15', letterSpacing: '0.5px' }}>{t.activeJobSite}</span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowJobModal(true)}
                    style={{ background: 'none', border: 'none', color: '#facc15', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {t.manageJobs}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowJobModal(true)}
                    style={{ background: 'none', border: 'none', color: '#4ade80', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    {t.newJob}
                  </button>
                </div>
              </div>

              {jobSites.length > 0 ? (
                <select 
                  value={selectedJob} 
                  onChange={(e) => setSelectedJob(e.target.value)}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0d0f12', border: '1px solid #282e3a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', fontWeight: '600' }}
                >
                  {jobSites.map((job, idx) => (
                    <option key={idx} value={job}>{job}</option>
                  ))}
                </select>
              ) : (
                <div style={{ backgroundColor: '#0d0f12', padding: '14px', borderRadius: '8px', border: '1px dashed #374151', textAlign: 'center' }}>
                  <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 8px 0' }}>{t.noJobsYet}</p>
                  <button 
                    type="button" 
                    onClick={() => setShowJobModal(true)}
                    style={{ backgroundColor: '#facc15', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}
                  >
                    {t.newJob}
                  </button>
                </div>
              )}
            </div>

            {/* CARD 2: QUICK PRESETS */}
            <div style={{ backgroundColor: '#161a22', border: '1px solid #232936', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#d1d5db' }}>{t.quickPresets}</span>
                <button type="button" style={{ backgroundColor: '#facc15', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                  {t.findSub}
                </button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {t.presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => addPreset(preset)}
                    style={{
                      backgroundColor: '#11141a',
                      border: '1px solid #facc1533',
                      color: '#facc15',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* CARD 3: SITE EVIDENCE PHOTOS */}
            <div style={{ backgroundColor: '#161a22', border: '1px solid #232936', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#d1d5db' }}>
                  {t.siteEvidence} ({photos.length}/3)
                </span>
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ backgroundColor: '#facc15', color: '#000', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {t.capture}
                </button>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                capture="environment" 
                multiple 
                onChange={handlePhotoSelect} 
                style={{ display: 'none' }} 
              />

              {photos.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {photos.map((img, i) => (
                    <img key={i} src={img} alt="Evidence" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #facc15' }} />
                  ))}
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #282e3a', borderRadius: '8px', padding: '24px 12px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#0d0f12' }}
                >
                  <span style={{ fontSize: '24px', display: 'block', marginBottom: '6px' }}>📷</span>
                  <span style={{ color: '#facc15', fontWeight: 'bold', fontSize: '13px' }}>{t.tapToOpen}</span>
                </div>
              )}
            </div>

            {/* CARD 4: SCOPE NOTES & AI QUOTE */}
            <div style={{ backgroundColor: '#161a22', border: '1px solid #232936', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#d1d5db' }}>{t.scopeNotes}</span>
                <button 
                  type="button" 
                  onClick={toggleDictation}
                  style={{ backgroundColor: isDictating ? '#ef4444' : 'transparent', color: isDictating ? '#fff' : '#facc15', border: '1px solid #facc15', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  {isDictating ? t.listening : t.dictate}
                </button>
              </div>

              <textarea 
                rows={4}
                value={scopeNotes}
                onChange={(e) => setScopeNotes(e.target.value)}
                placeholder={t.describeChanges}
                style={{ width: '100%', padding: '12px', backgroundColor: '#0d0f12', border: '1px solid #282e3a', borderRadius: '8px', color: '#ffffff', fontSize: '14px', resize: 'vertical' }}
              />

              <button 
                type="button"
                onClick={handleCalculateAI}
                disabled={loading}
                style={{ width: '100%', marginTop: '12px', padding: '14px', backgroundColor: 'transparent', border: '1px solid #facc15', color: '#facc15', borderRadius: '8px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', cursor: 'pointer', letterSpacing: '0.5px' }}
              >
                {loading ? '...' : t.calculateQuote}
              </button>

              {/* ESTIMATION & STRIPE PAY BUTTON */}
              {estimation && (
                <div style={{ marginTop: '12px', padding: '14px', backgroundColor: '#0d0f12', borderLeft: '4px solid #facc15', borderRadius: '6px' }}>
                  <p style={{ color: '#facc15', fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0' }}>Quote Price: ${estimation.financials.targetSellPrice}</p>
                  <p style={{ color: '#4ade80', fontSize: '13px', margin: '0 0 12px 0' }}>Margin: {estimation.financials.grossMarginPercent}% (${estimation.financials.estimatedProfit} profit)</p>
                  
                  <button 
                    type="button"
                    onClick={() => handleStripeCheckout(Math.round(estimation.financials.targetSellPrice * 0.25))}
                    disabled={paying}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {paying ? 'Connecting to Stripe...' : `💳 Collect 25% Deposit ($${Math.round(estimation.financials.targetSellPrice * 0.25)}) via Stripe`}
                  </button>
                </div>
              )}
            </div>

            {/* CARD 5: CLIENT DIGITAL AUTHORIZATION PAD */}
            <div style={{ backgroundColor: '#161a22', border: '1px solid #232936', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#d1d5db' }}>{t.authPad}</span>
                <button type="button" onClick={clearSignature} style={{ backgroundColor: 'transparent', border: 'none', color: '#facc15', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>{t.clearPad}</button>
              </div>

              <canvas 
                ref={canvasRef}
                width={500}
                height={160}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                style={{ width: '100%', height: '140px', backgroundColor: '#0d0f12', borderRadius: '8px', border: '1px solid #282e3a', touchAction: 'none', cursor: 'crosshair' }}
              />

              <div style={{ marginTop: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#9ca3af', display: 'block', marginBottom: '6px', textTransform: 'uppercase' }}>{t.clientNameLabel}</label>
                <input 
                  type="text"
                  placeholder={t.clientNamePlaceholder}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0d0f12', border: '1px solid #282e3a', borderRadius: '8px', color: '#ffffff', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                type="button"
                onClick={() => handleStripeCheckout(250)}
                disabled={paying}
                style={{ width: '100%', padding: '16px', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer' }}
              >
                {paying ? 'Connecting to Stripe...' : t.payDeposit}
              </button>

              <button 
                type="button"
                onClick={handleSaveVariationOrder}
                style={{ width: '100%', padding: '18px', backgroundColor: '#facc15', color: '#000000', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(250, 204, 21, 0.25)' }}
              >
                {t.saveOrder}
              </button>
            </div>

          </div>
        )}

        {/* LOGS TAB */}
        {activeTab === 'logs' && (
          <div style={{ backgroundColor: '#161a22', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: '#facc15' }}>{t.logsTab}</h3>
            <p style={{ color: '#9ca3af' }}>{jobSites.length} Active Job Site(s) Configured.</p>
          </div>
        )}

        {/* MARGIN TAB */}
        {activeTab === 'margin' && (
          <div style={{ backgroundColor: '#161a22', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: '#facc15' }}>{t.marginTab}</h3>
            <p style={{ color: '#9ca3af' }}>Hourly Rate Configured: ${hourlyRate}/hr</p>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div style={{ backgroundColor: '#161a22', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <h3 style={{ color: '#facc15' }}>{t.settingsTab}</h3>
            <p style={{ color: '#9ca3af' }}>Active Language: {lang.toUpperCase()}</p>
          </div>
        )}
      </main>

      {/* JOB SITE MANAGEMENT MODAL */}
      {showJobModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#161a22', border: '1px solid #facc15', borderRadius: '12px', width: '100%', maxWidth: '500px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, color: '#facc15', fontSize: '18px', fontWeight: '800' }}>{t.jobModalTitle}</h3>
              <button onClick={() => setShowJobModal(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleAddJob} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <input 
                type="text" 
                placeholder={t.jobInputPlaceholder} 
                value={newJobInput}
                onChange={(e) => setNewJobInput(e.target.value)}
                style={{ flex: 1, padding: '10px', backgroundColor: '#0d0f12', border: '1px solid #374151', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
              />
              <button type="submit" style={{ backgroundColor: '#facc15', color: '#000', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                {t.addBtn}
              </button>
            </form>

            <div style={{ maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {jobSites.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', margin: '10px 0' }}>{t.noJobsYet}</p>
              ) : (
                jobSites.map((job, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0d0f12', padding: '10px', borderRadius: '6px', border: '1px solid #282e3a' }}>
                    {editingJobIndex === idx ? (
                      <input 
                        type="text" 
                        value={editJobInput} 
                        onChange={(e) => setEditJobInput(e.target.value)}
                        style={{ flex: 1, padding: '6px', backgroundColor: '#161a22', border: '1px solid #facc15', borderRadius: '4px', color: '#fff', fontSize: '13px', marginRight: '8px' }}
                      />
                    ) : (
                      <span style={{ fontSize: '13px', color: '#f8fafc', fontWeight: '600' }}>{job}</span>
                    )}

                    <div style={{ display: 'flex', gap: '6px' }}>
                      {editingJobIndex === idx ? (
                        <>
                          <button onClick={() => handleSaveEditJob(idx)} style={{ backgroundColor: '#22c55e', color: '#000', border: 'none', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                            {t.saveBtn}
                          </button>
                          <button onClick={() => setEditingJobIndex(null)} style={{ backgroundColor: '#374151', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                            {t.cancelBtn}
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleStartEditJob(idx)} style={{ backgroundColor: '#374151', color: '#facc15', border: 'none', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                            {t.editBtn}
                          </button>
                          <button onClick={() => handleDeleteJob(idx)} style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', border: '1px solid #ef4444', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>
                            {t.deleteBtn}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <button onClick={() => setShowJobModal(false)} style={{ width: '100%', padding: '12px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
              {t.closeBtn}
            </button>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM NAVIGATION BAR */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#0b0d10', borderTop: '1px solid #1f242d', padding: '10px 16px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 100 }}>
        <button 
          onClick={() => setActiveTab('new_log')}
          style={{
            padding: '10px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: activeTab === 'new_log' ? '#facc15' : 'transparent',
            color: activeTab === 'new_log' ? '#000000' : '#9ca3af',
            fontWeight: '900',
            fontSize: '11px',
            letterSpacing: '0.5px',
            cursor: 'pointer'
          }}
        >
          {t.newLogTab}
        </button>

        <button 
          onClick={() => setActiveTab('logs')}
          style={{
            padding: '10px 12px',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'logs' ? '#facc15' : '#9ca3af',
            fontWeight: 'bold',
            fontSize: '11px',
            letterSpacing: '0.5px',
            cursor: 'pointer'
          }}
        >
          {t.logsTab} ({jobSites.length})
        </button>

        <button 
          onClick={() => setActiveTab('margin')}
          style={{
            padding: '10px 12px',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'margin' ? '#facc15' : '#9ca3af',
            fontWeight: 'bold',
            fontSize: '11px',
            letterSpacing: '0.5px',
            cursor: 'pointer'
          }}
        >
          {t.marginTab}
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          style={{
            padding: '10px 12px',
            border: 'none',
            backgroundColor: 'transparent',
            color: activeTab === 'settings' ? '#facc15' : '#9ca3af',
            fontWeight: 'bold',
            fontSize: '11px',
            letterSpacing: '0.5px',
            cursor: 'pointer'
          }}
        >
          {t.settingsTab}
        </button>
      </nav>
    </div>
  );
}