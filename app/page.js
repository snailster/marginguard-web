'use client';

import { useState, useRef, useEffect } from "react";
import supabase from '../lib/supabase';

// --- ENTERPRISE VECTOR ICONS ---
const ShieldIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L20 6V12C20 17.5 16.5 21.5 12 23C7.5 21.5 4 17.5 4 12V6L12 2Z" fill="url(#shield-grad)" />
    <path d="M9.5 12L11 13.5L14.5 10" stroke="#05070A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="shield-grad" x1="4" y1="2" x2="20" y2="23" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24" />
        <stop offset="1" stopColor="#D97706" />
      </linearGradient>
    </defs>
  </svg>
);

const SparklesIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
  </svg>
);

const QrIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="3" width="7" height="7" rx="1"></rect>
    <rect x="14" y="14" width="7" height="7" rx="1"></rect>
    <rect x="3" y="14" width="7" height="7" rx="1"></rect>
  </svg>
);

const DownloadIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const AppleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.32c.67-.82 1.13-1.96.99-3.1-.98.04-2.19.66-2.88 1.47-.61.71-1.15 1.88-.99 3.01 1.1.08 2.21-.56 2.88-1.38z"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const MicIcon = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#FFF" : "#F59E0B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
    <line x1="12" y1="19" x2="12" y2="23"></line>
    <line x1="8" y1="23" x2="16" y2="23"></line>
  </svg>
);

const PrinterIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

// --- BILINGUAL DICTIONARY ---
const dict = {
  en: {
    title: "MARGIN GUARD",
    subtitle: "FIELD VARIATION PROTECTOR",
    loginSub: "Log in or create a contractor account to protect job site margins.",
    emailLabel: "Work Email Address",
    passwordLabel: "Password (Min 6 characters)",
    loginBtn: "Sign In to Field Dashboard",
    signupBtn: "Create Contractor Account",
    orSocial: "WORKPLACE AUTHENTICATION",
    googleBtn: "Sign in with Google",
    appleBtn: "Sign in with Apple",
    demoBtn: "⚡ Instant Field Demo Access",
    newLog: "New Variation",
    logs: "Variation Orders",
    settings: "Settings",
    activeJob: "Active Job Site",
    noJobsYet: "No job sites added yet. Tap '+ New Job' to create one.",
    newJob: "+ New Job",
    editJob: "Edit",
    deleteJob: "Delete",
    presets: "Preset Scope Templates",
    addPreset: "+ Add Preset",
    photos: "Evidence Photos (Max 12)",
    capture: "Add Photo Evidence",
    scopeNotes: "Variation Scope & Reason",
    dictate: "Dictate",
    calcEstimate: "Calculate Quoted Price",
    signaturePad: "Client Digital Authorization Pad",
    clearSignature: "Clear Signature",
    clientNameLabel: "Client / Representative Full Name",
    saveOrder: "Save & Lock Variation Order",
    collectPayment: "💳 Collect Immediate Payment via Stripe",
    printPdf: "📄 Printable PDF Agreement",
    shareClient: "📱 Share Client Approval Link / QR",
    exportCsv: "📊 Export to QuickBooks / CSV",
    logout: "Sign Out",
    deleteAccount: "Delete Account & Data",
  },
  es: {
    title: "MARGIN GUARD",
    subtitle: "PROTECTOR DE VARIACIONES DE OBRA",
    loginSub: "Inicie sesión o cree una cuenta para proteger variaciones de obra.",
    emailLabel: "Correo Electrónico Laboral",
    passwordLabel: "Contraseña (Mín. 6 caracteres)",
    loginBtn: "Iniciar Sesión en el Panel",
    signupBtn: "Crear Cuenta de Contratista",
    orSocial: "AUTENTICACIÓN EMPRESARIAL",
    googleBtn: "Iniciar sesión con Google",
    appleBtn: "Iniciar sesión con Apple",
    demoBtn: "⚡ Acceso Demo Inmediato",
    newLog: "Nueva Variación",
    logs: "Órdenes de Variación",
    settings: "Configuración",
    activeJob: "Obra / Sitio Activo",
    noJobsYet: "No hay obras registradas. Toque '+ Nueva Obra'.",
    newJob: "+ Nueva Obra",
    editJob: "Editar",
    deleteJob: "Eliminar",
    presets: "Plantillas de Trabajo Personalizadas",
    addPreset: "+ Plantilla",
    photos: "Fotos de Evidencia (Máx 12)",
    capture: "Agregar Foto",
    scopeNotes: "Alcance y Razón de la Variación",
    dictate: "Dictar",
    calcEstimate: "Calcular Presupuesto",
    signaturePad: "Firma de Autorización del Cliente",
    clearSignature: "Borrar Firma",
    clientNameLabel: "Nombre del Cliente / Representante",
    saveOrder: "Guardar y Bloquear Orden",
    collectPayment: "💳 Cobrar Pago Inmediato con Stripe",
    printPdf: "📄 Acuerdo Imprimible en PDF",
    shareClient: "📱 Compartir Enlace / QR al Cliente",
    exportCsv: "📊 Exportar a QuickBooks / CSV",
    logout: "Cerrar Sesión",
    deleteAccount: "Eliminar Cuenta y Datos",
  }
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState("en");
  const [isOnline, setIsOnline] = useState(true);
  const [forceOffline, setForceOffline] = useState(false);
  const [activeTab, setActiveTab] = useState("field");

  // AUTHENTICATION STATE
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(true);
  const [isSignUpUI, setIsSignUpUI] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState(null);
  const [showLegalModal, setShowLegalModal] = useState(null);

  // FINANCIAL SETTINGS STATE
  const [settings, setSettings] = useState({
    companyName: "MarginGuard Contracting",
    licenseNo: "LIC-992041",
    phone: "(555) 019-2834",
    email: "billing@marginguard.com",
    hourlyRate: 85,
    equipmentRate: 45,
    overheadRate: 15,
    materialsMarkup: 20,
    targetMargin: 30,
    taxRate: 10,
  });

  // PRESETS STATE
  const [presets, setPresets] = useState([
    { label: "Rock Excavation", note: "Unforeseen rock excavation on site requiring heavy equipment." },
    { label: "Plumbing Reroute", note: "Concealed pipe relocation required due to slab discrepancy." },
    { label: "Electrical Upgrade", note: "Sub-panel replacement required for code compliance." },
    { label: "Subfloor Repair", note: "Termite or water damage discovered on structural joists." },
  ]);
  const [newPresetLabel, setNewPresetLabel] = useState("");
  const [newPresetNote, setNewPresetNote] = useState("");
  const [showAddPresetModal, setShowAddPresetModal] = useState(false);

  // JOB SITES STATE
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [newJobName, setNewJobName] = useState("");
  const [showAddJob, setShowAddJob] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editingJobName, setEditingJobName] = useState("");

  // VARIATION FORM STATE
  const [clientName, setClientName] = useState("");
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedRecord, setSavedRecord] = useState(null);
  const [allLogs, setAllLogs] = useState([]);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // SIGNATURE PAD CANVAS REFS & STATE
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  // FINANCIAL CALCULATOR ENGINE
  const [laborHours, setLaborHours] = useState(4);
  const [materialsCostInput, setMaterialsCostInput] = useState(150);
  const [calculatedEstimate, setCalculatedEstimate] = useState(null);

  const t = dict[lang];

  useEffect(() => {
    setMounted(true);
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
          setAuthMode(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) setAuthMode(false);
      });

      return () => subscription.unsubscribe();
    }

    const storedLogs = localStorage.getItem("mg_variation_logs");
    if (storedLogs) { try { setAllLogs(JSON.parse(storedLogs)); } catch (e) {} }

    const storedSettings = localStorage.getItem("mg_settings");
    if (storedSettings) { try { setSettings(JSON.parse(storedSettings)); } catch (e) {} }

    const storedPresets = localStorage.getItem("mg_presets");
    if (storedPresets) { try { setPresets(JSON.parse(storedPresets)); } catch (e) {} }

    const storedJobs = localStorage.getItem("mg_jobs");
    if (storedJobs) {
      try {
        const parsed = JSON.parse(storedJobs);
        setJobs(parsed);
        if (parsed.length > 0) setSelectedJobId(parsed[0].id);
      } catch (e) {}
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // SIGNATURE CANVAS SETUP
  useEffect(() => {
    if (!mounted || authMode || activeTab !== 'field') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    if (rect.width > 0 && rect.height > 0) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
    }
  }, [mounted, authMode, activeTab]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    setHasSignature(true);
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

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // AI SCOPE DRAFT GENERATOR
  const handleAiGenerateScope = async () => {
    setAiGenerating(true);
    setTimeout(() => {
      const currentJob = jobs.find(j => j.id === selectedJobId);
      const siteName = currentJob ? currentJob.name : "Active Job Site";
      
      const aiNote = `• TECHNICAL VARIATION DISCOVERY AT ${siteName.toUpperCase()}: Unforeseen subsurface/structural discrepancy encountered during excavation/rough-in.\n• LEGAL IMPACT: Requires immediate mitigation to prevent structural compromise and workflow delay.\n• SCOPE REMEDIATION: Removal of non-compliant materials, structural reinforcement, and code-mandated realignments.\n• NOTICE: Client sign-off authorizes additional time and material costs as itemized below.`;
      
      setNotes(aiNote);
      setLaborHours(6);
      setMaterialsCostInput(280);
      setAiGenerating(false);
    }, 1000);
  };

  // CSV EXPORT FOR QUICKBOOKS / XERO
  const handleExportCsv = () => {
    if (allLogs.length === 0) {
      alert("No variation logs to export.");
      return;
    }

    const headers = ["Order ID", "Date", "Job Site", "Client Name", "Total Quoted ($)", "Notes"];
    const rows = allLogs.map(log => [
      log.id,
      new Date(log.date).toLocaleDateString(),
      `"${log.jobName.replace(/"/g, '""')}"`,
      `"${log.clientName.replace(/"/g, '""')}"`,
      log.financials?.finalTotalWithTax || '0.00',
      `"${(log.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MarginGuard_Variations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // FINANCIAL ESTIMATOR LOGIC
  const runCalculation = () => {
    const hours = parseFloat(laborHours) || 0;
    const matBase = parseFloat(materialsCostInput) || 0;

    const directLaborCost = hours * settings.hourlyRate;
    const directEquipCost = hours * (settings.equipmentRate || 0);
    const matWithMarkup = matBase * (1 + (settings.materialsMarkup || 0) / 100);
    const directSubtotal = directLaborCost + directEquipCost + matWithMarkup;

    const overheadAllocation = directSubtotal * ((settings.overheadRate || 0) / 100);
    const totalCostBasis = directSubtotal + overheadAllocation;

    const targetMarginDec = (settings.targetMargin || 30) / 100;
    const netQuotedPrice = targetMarginDec < 1 ? totalCostBasis / (1 - targetMarginDec) : totalCostBasis * 1.3;
    
    const taxAmount = netQuotedPrice * ((settings.taxRate || 0) / 100);
    const finalTotalWithTax = netQuotedPrice + taxAmount;
    const estimatedProfit = netQuotedPrice - totalCostBasis;

    const result = {
      hours,
      directLaborCost: directLaborCost.toFixed(2),
      directEquipCost: directEquipCost.toFixed(2),
      matWithMarkup: matWithMarkup.toFixed(2),
      overheadAllocation: overheadAllocation.toFixed(2),
      netQuotedPrice: netQuotedPrice.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      finalTotalWithTax: finalTotalWithTax.toFixed(2),
      estimatedProfit: estimatedProfit.toFixed(2),
    };

    setCalculatedEstimate(result);
    return result;
  };

  // JOB SITE MANAGEMENT
  const handleAddJob = () => {
    if (!newJobName.trim()) return;
    const newJob = { id: "JOB-" + Date.now(), name: newJobName.trim() };
    const updated = [...jobs, newJob];
    setJobs(updated);
    localStorage.setItem("mg_jobs", JSON.stringify(updated));
    setSelectedJobId(newJob.id);
    setNewJobName("");
    setShowAddJob(false);
  };

  const handleEditJob = (id) => {
    if (!editingJobName.trim()) return;
    const updated = jobs.map(j => j.id === id ? { ...j, name: editingJobName.trim() } : j);
    setJobs(updated);
    localStorage.setItem("mg_jobs", JSON.stringify(updated));
    setEditingJobId(null);
    setEditingJobName("");
  };

  const handleDeleteJob = (id) => {
    if (!confirm("Delete this job site? Existing variation logs will NOT be lost.")) return;
    const updated = jobs.filter(j => j.id !== id);
    setJobs(updated);
    localStorage.setItem("mg_jobs", JSON.stringify(updated));
    if (selectedJobId === id) setSelectedJobId(updated[0]?.id || "");
  };

  const handleAddPreset = () => {
    if (!newPresetLabel.trim() || !newPresetNote.trim()) return;
    const updated = [...presets, { label: newPresetLabel.trim(), note: newPresetNote.trim() }];
    setPresets(updated);
    localStorage.setItem("mg_presets", JSON.stringify(updated));
    setNewPresetLabel("");
    setNewPresetNote("");
    setShowAddPresetModal(false);
  };

  // PHOTO UPLOADER
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 12) {
      alert("Maximum 12 photos per variation order record.");
      return;
    }
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos(prev => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // AUTHENTICATION
  const handleEmailAuth = async () => {
    setAuthError(null);
    setAuthSuccessMsg(null);

    if (!email || !password) {
      setAuthError("Please enter both work email and password.");
      return;
    }

    if (password.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      return;
    }

    setAuthLoading(true);
    try {
      if (isSignUpUI) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        if (data?.session) {
          setUser(data.session.user);
          setAuthMode(false);
        } else {
          setAuthSuccessMsg("Account created! You can now log in.");
          setIsSignUpUI(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        setAuthMode(false);
      }
    } catch (err) {
      setAuthError(err.message || "Sign in failed. Check credentials or try Demo Mode.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setUser({ id: "demo_contractor", email: "demo@marginguard.app" });
    setAuthMode(false);
  };

  const handleOAuth = async (provider) => {
    setAuthError(null);
    try {
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin }
      });
    } catch (err) {
      setAuthError("OAuth Error: " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("PERMANENT ACTION: Delete account and clear local job logs?")) return;
    try {
      localStorage.clear();
      setAllLogs([]);
      setJobs([]);
      if (supabase) await supabase.auth.signOut();
      setUser(null);
      setAuthMode(true);
    } catch (err) {
      alert("Account deletion error: " + err.message);
    }
  };

  // SAVE ORDER RECORD
  const handleSaveOrder = () => {
    const calc = calculatedEstimate || runCalculation();
    const currentJob = jobs.find(j => j.id === selectedJobId);

    let signatureDataUrl = null;
    if (canvasRef.current && hasSignature) {
      signatureDataUrl = canvasRef.current.toDataURL("image/png");
    }

    const record = {
      id: "VAR-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      jobId: selectedJobId,
      jobName: currentJob ? currentJob.name : "Unassigned Site",
      clientName: clientName || "Valued Client",
      notes,
      photos,
      signature: signatureDataUrl,
      financials: calc,
    };

    const updated = [record, ...allLogs];
    setAllLogs(updated);
    localStorage.setItem("mg_variation_logs", JSON.stringify(updated));
    setSavedRecord(record);
    setIsSaved(true);
  };

  // PRINT / PDF
  const handlePrintPdf = (record) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Variation Order #${record.id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; }
          .header { border-bottom: 2px solid #F59E0B; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          .title { font-size: 24px; font-weight: 900; }
          .subtitle { font-size: 12px; color: #666; font-family: monospace; }
          .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .card { background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { text-align: left; padding: 10px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
          th { background: #f3f4f6; }
          .total { font-size: 18px; font-weight: bold; color: #000; text-align: right; margin-top: 20px; }
          .signature-img { max-height: 80px; border-bottom: 1px solid #000; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${settings.companyName}</div>
            <div class="subtitle">License ID: ${settings.licenseNo} | Phone: ${settings.phone}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 18px; font-weight: bold;">VARIATION ORDER</div>
            <div class="subtitle">#${record.id} | ${new Date(record.date).toLocaleDateString()}</div>
          </div>
        </div>

        <div class="grid">
          <div class="card">
            <strong>Job Site Location:</strong>
            <div>${record.jobName}</div>
          </div>
          <div class="card">
            <strong>Client Representative:</strong>
            <div>${record.clientName}</div>
          </div>
        </div>

        <div class="card" style="margin-bottom: 30px;">
          <strong>Work Scope & Reason:</strong>
          <p style="white-space: pre-line; margin-top: 8px; font-size: 13px;">${record.notes || "Standard variation work required."}</p>
        </div>

        <strong>Approved Financial Cost Breakdown</strong>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Direct Labor & Equipment Allocation</td><td style="text-align: right;">$${(parseFloat(record.financials.directLaborCost) + parseFloat(record.financials.directEquipCost)).toFixed(2)}</td></tr>
            <tr><td>Materials & Supplies (Inc. Markup)</td><td style="text-align: right;">$${record.financials.matWithMarkup}</td></tr>
            <tr><td>Overhead Allocation</td><td style="text-align: right;">$${record.financials.overheadAllocation}</td></tr>
            <tr><td>Sales Tax / GST</td><td style="text-align: right;">$${record.financials.taxAmount}</td></tr>
          </tbody>
        </table>

        <div class="total">
          Approved Quoted Total: $${record.financials.finalTotalWithTax}
        </div>

        ${record.signature ? `
          <div style="margin-top: 40px;">
            <strong>Client Digital Authorization Signature:</strong><br/>
            <img src="${record.signature}" class="signature-img" />
          </div>
        ` : ''}

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleStripePayment = async (record) => {
    try {
      const res = await fetch('https://marginguard-web-kappa.vercel.app/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(parseFloat(record.financials.finalTotalWithTax) * 100),
          jobName: `${record.jobName} - Order #${record.id}`,
          recordId: record.id,
          userEmail: user?.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Stripe Checkout Error: " + (data.error || "Failed to launch payment window"));
      }
    } catch (err) {
      alert("Payment Error: " + err.message);
    }
  };

  // CALCULATE RECOVERY STATS
  const totalProtectedValue = allLogs.reduce((acc, curr) => acc + (parseFloat(curr.financials?.finalTotalWithTax) || 0), 0);

  if (!mounted) return null;

  // --- SLEEK ENTERPRISE AUTHENTICATION SCREEN ---
  if (authMode) {
    return (
      <div className="min-h-screen bg-[#05070A] text-white flex flex-col justify-between items-center p-4 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] select-none">
        
        <div className="w-full max-w-md my-auto bg-[#0D121B] border border-gray-800/80 rounded-3xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="w-16 h-16 bg-[#131A26] border border-amber-500/30 rounded-2xl flex items-center justify-center mb-3 shadow-xl shadow-amber-500/10">
              <ShieldIcon />
            </div>
            <h1 className="text-2xl font-black tracking-wider text-white">
              MARGIN<span className="text-amber-400">GUARD</span>
            </h1>
            <span className="inline-block px-3 py-0.5 mt-1.5 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[9px] font-mono font-bold tracking-widest uppercase rounded-full">
              Enterprise Field App
            </span>
          </div>

          <div className="flex bg-[#05070A] border border-gray-800 rounded-xl p-1 mb-5">
            <button
              onClick={() => { setIsSignUpUI(false); setAuthError(null); setAuthSuccessMsg(null); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${!isSignUpUI ? 'bg-amber-400 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUpUI(true); setAuthError(null); setAuthSuccessMsg(null); }}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition ${isSignUpUI ? 'bg-amber-400 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
            >
              Create Account
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-red-950/80 border border-red-700/80 rounded-xl text-xs text-red-300 font-medium leading-relaxed flex items-start gap-2">
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          {authSuccessMsg && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-xs text-emerald-300 font-medium leading-relaxed flex items-start gap-2">
              <span>✅</span>
              <span>{authSuccessMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">{t.emailLabel}</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contractor@company.com"
                className="w-full bg-[#05070A] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/80 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">{t.passwordLabel}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#05070A] border border-gray-800 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/80 transition"
              />
            </div>

            <button
              onClick={handleEmailAuth}
              disabled={authLoading}
              className="w-full py-3.5 bg-amber-400 text-black font-extrabold rounded-xl hover:bg-amber-300 active:scale-[0.99] transition shadow-lg shadow-amber-500/10 text-xs tracking-wider uppercase mt-2"
            >
              {authLoading ? "Authenticating..." : (isSignUpUI ? t.signupBtn : t.loginBtn)}
            </button>

            <button
              onClick={handleDemoLogin}
              className="w-full py-3 bg-[#131A26] border border-amber-500/30 text-amber-400 font-bold rounded-xl text-xs hover:bg-[#1a2333] transition flex items-center justify-center gap-2 mt-1"
            >
              {t.demoBtn}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-800"></div></div>
              <div className="relative flex justify-center text-[10px]"><span className="bg-[#0D121B] px-3 text-gray-500 font-mono tracking-widest">{t.orSocial}</span></div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleOAuth('google')}
                className="w-full py-2.5 bg-[#05070A] border border-gray-800 rounded-xl flex items-center justify-center gap-3 text-xs font-bold text-gray-300 hover:bg-gray-800/50 hover:text-white transition"
              >
                <GoogleLogo /> {t.googleBtn}
              </button>

              <button
                onClick={() => handleOAuth('apple')}
                className="w-full py-2.5 bg-[#05070A] border border-gray-800 rounded-xl flex items-center justify-center gap-3 text-xs font-bold text-gray-300 hover:bg-gray-800/50 hover:text-white transition"
              >
                <AppleLogo /> {t.appleBtn}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 text-[11px] text-gray-500 pb-2">
          <button onClick={() => setShowLegalModal('privacy')} className="hover:underline">Privacy Policy</button>
          <span>•</span>
          <button onClick={() => setShowLegalModal('terms')} className="hover:underline">Terms of Service</button>
        </div>

        {showLegalModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-[#0D121B] border border-gray-800 w-full max-w-md rounded-2xl p-6 space-y-4 text-xs leading-relaxed text-gray-300">
              <h3 className="text-sm font-bold text-amber-400">
                {showLegalModal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <p>
                MarginGuard protects your field data. Photos, variation orders, and job records are securely managed and never sold to third parties.
              </p>
              <button
                onClick={() => setShowLegalModal(null)}
                className="w-full py-2.5 bg-amber-400 text-black font-bold rounded-xl text-xs mt-4"
              >
                Close Statement
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- MAIN FIELD APP INTERFACE ---
  return (
    <div className="min-h-screen bg-[#05070A] text-white flex flex-col max-w-2xl mx-auto shadow-2xl border-x border-gray-900 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      
      {/* HEADER NAV */}
      <header className="bg-[#0D121B] border-b border-gray-800/80 p-4 sticky top-0 z-30 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <ShieldIcon />
          <div>
            <h1 className="text-base font-black text-white leading-none">
              MARGIN<span className="text-amber-400">GUARD</span>
            </h1>
            <p className="text-[10px] text-gray-400 font-mono tracking-wider">{t.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setForceOffline(!forceOffline)}
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1.5 border ${
              (isOnline && !forceOffline) 
                ? "bg-emerald-950/60 border-emerald-700 text-emerald-400" 
                : "bg-rose-950/60 border-rose-700 text-rose-400"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${ (isOnline && !forceOffline) ? "bg-emerald-400 animate-pulse" : "bg-rose-500" }`}></span>
            {(isOnline && !forceOffline) ? "ONLINE" : "OFFLINE"}
          </button>

          <button onClick={() => setLang(lang === 'en' ? 'es' : 'en')} className="text-xs font-bold px-2 py-1 bg-gray-800 rounded border border-gray-700">
            {lang.toUpperCase()}
          </button>
        </div>
      </header>

      {/* KPI RECOVERY DASHBOARD BANNER */}
      <div className="bg-[#0D121B]/80 border-b border-gray-800 px-4 py-3 grid grid-cols-3 gap-2 text-center">
        <div className="bg-[#05070A] p-2 rounded-xl border border-gray-800/60">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Protected $</div>
          <div className="text-xs font-bold text-amber-400 font-mono">${totalProtectedValue.toFixed(2)}</div>
        </div>
        <div className="bg-[#05070A] p-2 rounded-xl border border-gray-800/60">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Orders</div>
          <div className="text-xs font-bold text-white font-mono">{allLogs.length} Records</div>
        </div>
        <div className="bg-[#05070A] p-2 rounded-xl border border-gray-800/60">
          <div className="text-[10px] text-gray-400 font-mono uppercase">Target Margin</div>
          <div className="text-xs font-bold text-emerald-400 font-mono">{settings.targetMargin}%</div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <nav className="flex border-b border-gray-800 bg-[#0D121B]/90 backdrop-blur">
        <button
          onClick={() => setActiveTab('field')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 ${activeTab === 'field' ? 'border-amber-400 text-amber-400' : 'border-transparent text-gray-400'}`}
        >
          {t.newLog}
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 ${activeTab === 'logs' ? 'border-amber-400 text-amber-400' : 'border-transparent text-gray-400'}`}
        >
          {t.logs} ({allLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-xs font-bold text-center border-b-2 ${activeTab === 'settings' ? 'border-amber-400 text-amber-400' : 'border-transparent text-gray-400'}`}
        >
          {t.settings}
        </button>
      </nav>

      {/* MAIN BODY AREA */}
      <main className="flex-1 p-4 space-y-6 overflow-y-auto">

        {/* --- FIELD ENTRY TAB --- */}
        {activeTab === 'field' && (
          <div className="space-y-6">
            
            {/* JOB SITE SELECTOR */}
            <div className="bg-[#0D121B] p-4 rounded-2xl border border-gray-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t.activeJob}</label>
                <button
                  onClick={() => setShowAddJob(true)}
                  className="text-xs text-amber-400 font-bold hover:underline"
                >
                  {t.newJob}
                </button>
              </div>

              {showAddJob ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newJobName}
                    onChange={e => setNewJobName(e.target.value)}
                    placeholder="Site Address / Job Name"
                    className="flex-1 bg-[#05070A] border border-gray-700 rounded-lg p-2 text-xs text-white"
                  />
                  <button onClick={handleAddJob} className="px-3 bg-amber-400 text-black text-xs font-bold rounded-lg">Add</button>
                  <button onClick={() => setShowAddJob(false)} className="px-2 bg-gray-800 text-gray-400 text-xs rounded-lg">X</button>
                </div>
              ) : (
                <div className="space-y-2">
                  <select
                    value={selectedJobId}
                    onChange={e => setSelectedJobId(e.target.value)}
                    className="w-full bg-[#05070A] border border-gray-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    {jobs.length === 0 && <option value="">-- No Jobs Created --</option>}
                    {jobs.map(j => (
                      <option key={j.id} value={j.id}>{j.name}</option>
                    ))}
                  </select>

                  {selectedJobId && (
                    <div className="flex justify-end gap-3 text-xs pt-1">
                      {editingJobId === selectedJobId ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={editingJobName}
                            onChange={e => setEditingJobName(e.target.value)}
                            className="flex-1 bg-[#05070A] border border-gray-700 rounded p-1 text-xs"
                          />
                          <button onClick={() => handleEditJob(selectedJobId)} className="text-emerald-400 font-bold">Save</button>
                          <button onClick={() => setEditingJobId(null)} className="text-gray-400">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              const j = jobs.find(x => x.id === selectedJobId);
                              setEditingJobId(selectedJobId);
                              setEditingJobName(j ? j.name : "");
                            }}
                            className="text-gray-400 hover:text-white"
                          >
                            ✏️ {t.editJob}
                          </button>
                          <button
                            onClick={() => handleDeleteJob(selectedJobId)}
                            className="text-rose-400 hover:text-rose-300"
                          >
                            🗑️ {t.deleteJob}
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* PRESET TEMPLATES */}
            <div className="bg-[#0D121B] p-4 rounded-2xl border border-gray-800 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t.presets}</label>
                <button
                  onClick={() => setShowAddPresetModal(true)}
                  className="text-xs text-amber-400 font-bold hover:underline"
                >
                  {t.addPreset}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setNotes(prev => prev ? `${prev}\n• ${p.note}` : `• ${p.note}`)}
                    className="px-3 py-1.5 bg-[#05070A] border border-gray-800 hover:border-amber-400 rounded-xl text-xs text-gray-300 text-left transition"
                  >
                    + {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SCOPE NOTES & AI ENGINE */}
            <div className="bg-[#0D121B] p-4 rounded-2xl border border-gray-800 space-y-3 shadow-xl">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t.scopeNotes}</label>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleAiGenerateScope}
                    disabled={aiGenerating}
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full text-xs font-bold hover:bg-amber-400/20 transition"
                  >
                    <SparklesIcon /> {aiGenerating ? "Drafting..." : "✨ AI Draft"}
                  </button>

                  <button
                    onClick={() => setIsListening(!isListening)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-gray-800 text-amber-400'}`}
                  >
                    <MicIcon active={isListening} /> {isListening ? "Listening..." : t.dictate}
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe unforeseen site conditions or customer-requested scope changes..."
                className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
              />
            </div>

            {/* EVIDENCE PHOTOS */}
            <div className="bg-[#0D121B] p-4 rounded-2xl border border-gray-800 space-y-3 shadow-xl">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t.photos} ({photos.length}/12)</label>
                <label className="cursor-pointer flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-700 hover:bg-gray-700">
                  <CameraIcon /> {t.capture}
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                </label>
              </div>

              {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {photos.map((src, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-700">
                      <img src={src} alt="Evidence" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-black/80 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FINANCIAL COST CALCULATOR */}
            <div className="bg-[#0D121B] p-4 rounded-2xl border border-gray-800 space-y-4 shadow-xl">
              <h3 className="text-xs font-bold text-amber-400 tracking-wider uppercase">Variation Financial Cost Breakdown</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Labor Hours Needed</label>
                  <input
                    type="number"
                    value={laborHours}
                    onChange={e => setLaborHours(e.target.value)}
                    className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Base Materials Cost ($)</label>
                  <input
                    type="number"
                    value={materialsCostInput}
                    onChange={e => setMaterialsCostInput(e.target.value)}
                    className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <button
                onClick={runCalculation}
                className="w-full py-2.5 bg-gray-800 text-amber-400 font-bold border border-amber-400/40 rounded-xl text-xs hover:bg-gray-700 transition"
              >
                {t.calcEstimate}
              </button>

              {calculatedEstimate && (
                <div className="bg-[#05070A] p-3.5 rounded-xl border border-gray-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-gray-400"><span>Direct Labor & Equipment:</span><span>${(parseFloat(calculatedEstimate.directLaborCost) + parseFloat(calculatedEstimate.directEquipCost)).toFixed(2)}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Materials (Inc. Markup):</span><span>${calculatedEstimate.matWithMarkup}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Overhead Allocation:</span><span>${calculatedEstimate.overheadAllocation}</span></div>
                  <div className="flex justify-between text-gray-400"><span>Sales Tax / GST:</span><span>${calculatedEstimate.taxAmount}</span></div>
                  <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-amber-400 text-sm">
                    <span>Approved Quoted Price:</span>
                    <span>${calculatedEstimate.finalTotalWithTax}</span>
                  </div>
                </div>
              )}
            </div>

            {/* DIGITAL SIGNATURE CANVAS PAD */}
            <div className="bg-[#0D121B] p-4 rounded-2xl border border-gray-800 space-y-3 shadow-xl">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">{t.signaturePad}</label>
                <button onClick={clearCanvas} className="text-xs text-amber-400 hover:underline">{t.clearSignature}</button>
              </div>

              <div className="relative w-full h-36 bg-[#05070A] border border-gray-800 rounded-xl overflow-hidden touch-none">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                  className="w-full h-full cursor-crosshair"
                />
                {!hasSignature && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs text-gray-600 font-mono">
                    Sign Here On Screen
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">{t.clientNameLabel}</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-3 text-xs text-white"
                />
              </div>

              <button
                onClick={handleSaveOrder}
                className="w-full py-3.5 bg-amber-400 text-black font-extrabold rounded-xl text-sm shadow-xl hover:bg-amber-300 transition uppercase tracking-wider"
              >
                {t.saveOrder}
              </button>
            </div>

            {/* SAVED RECORD DISPLAY & ACTIONS */}
            {isSaved && savedRecord && (
              <div className="bg-amber-950/20 border border-amber-500/40 p-4 rounded-2xl space-y-3 shadow-2xl">
                <div className="flex items-center justify-between text-amber-400 font-bold text-xs">
                  <span>RECORDED: #{savedRecord.id}</span>
                  <span>${savedRecord.financials.finalTotalWithTax}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleStripePayment(savedRecord)}
                    className="py-3 bg-amber-400 text-black font-extrabold rounded-xl text-xs shadow-lg flex items-center justify-center gap-1.5 hover:bg-amber-300"
                  >
                    {t.collectPayment}
                  </button>

                  <button
                    onClick={() => setShowShareModal(true)}
                    className="py-3 bg-gray-800 border border-gray-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-gray-700"
                  >
                    <QrIcon /> {t.shareClient}
                  </button>
                </div>

                <button
                  onClick={() => handlePrintPdf(savedRecord)}
                  className="w-full py-2.5 bg-[#05070A] border border-gray-800 text-gray-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-gray-800"
                >
                  <PrinterIcon /> {t.printPdf}
                </button>
              </div>
            )}

          </div>
        )}

        {/* --- LOGS HISTORICAL TAB --- */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Site Variation Order Records</h2>
              <button
                onClick={handleExportCsv}
                className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-gray-800 px-3 py-1.5 rounded-xl border border-gray-700 hover:bg-gray-700"
              >
                <DownloadIcon /> Export CSV
              </button>
            </div>

            {allLogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">No variation orders recorded yet.</div>
            ) : (
              allLogs.map(log => (
                <div key={log.id} className="bg-[#0D121B] border border-gray-800 rounded-2xl p-4 space-y-3 shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-amber-400 font-bold">#{log.id}</span>
                      <h4 className="text-sm font-bold text-white">{log.jobName}</h4>
                    </div>
                    <span className="text-sm font-bold text-amber-400">${log.financials?.finalTotalWithTax || '0.00'}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{log.notes || "No notes provided."}</p>
                  
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono pt-2 border-t border-gray-800">
                    <span>{new Date(log.date).toLocaleDateString()}</span>
                    <span>Client: {log.clientName}</span>
                    <button
                      onClick={() => handlePrintPdf(log)}
                      className="text-amber-400 underline font-bold"
                    >
                      View PDF
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === 'settings' && (
          <div className="bg-[#0D121B] border border-gray-800 rounded-2xl p-4 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-amber-400 tracking-wider uppercase">Contractor Financial Engine Settings</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Company Trading Name</label>
                <input
                  type="text"
                  value={settings.companyName}
                  onChange={e => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Labor Rate ($/hr)</label>
                  <input
                    type="number"
                    value={settings.hourlyRate}
                    onChange={e => setSettings({ ...settings, hourlyRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Equipment Rate ($/hr)</label>
                  <input
                    type="number"
                    value={settings.equipmentRate}
                    onChange={e => setSettings({ ...settings, equipmentRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Materials Markup (%)</label>
                  <input
                    type="number"
                    value={settings.materialsMarkup}
                    onChange={e => setSettings({ ...settings, materialsMarkup: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Overhead Rate (%)</label>
                  <input
                    type="number"
                    value={settings.overheadRate}
                    onChange={e => setSettings({ ...settings, overheadRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Target Gross Margin (%)</label>
                  <input
                    type="number"
                    value={settings.targetMargin}
                    onChange={e => setSettings({ ...settings, targetMargin: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-gray-400 mb-1">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={settings.taxRate}
                    onChange={e => setSettings({ ...settings, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  localStorage.setItem("mg_settings", JSON.stringify(settings));
                  alert("Financial Settings Saved!");
                }}
                className="w-full py-2.5 bg-amber-400 text-black font-bold rounded-xl text-xs"
              >
                Save Settings
              </button>

              <button
                onClick={async () => {
                  if (supabase) await supabase.auth.signOut();
                  setUser(null);
                  setAuthMode(true);
                }}
                className="w-full py-2.5 bg-gray-800 border border-gray-700 text-gray-300 font-bold rounded-xl text-xs"
              >
                {t.logout}
              </button>

              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={handleDeleteAccount}
                  className="w-full py-2.5 bg-rose-950/40 border border-rose-800/80 text-rose-400 font-bold rounded-xl text-xs hover:bg-rose-900/60"
                >
                  {t.deleteAccount}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* SHARE / QR MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D121B] border border-gray-800 w-full max-w-sm rounded-2xl p-6 text-center space-y-4">
            <h3 className="text-sm font-bold text-amber-400">Client Remote Approval QR</h3>
            <p className="text-xs text-gray-400">Have the client scan this QR code with their mobile phone camera to review and sign digitally.</p>
            
            <div className="bg-white p-4 rounded-xl inline-block mx-auto shadow-xl">
              {/* QR Code Placeholder Graphic */}
              <div className="w-36 h-36 bg-gray-900 rounded flex items-center justify-center text-white font-mono text-[10px] p-2 text-center">
                [ QR CODE SIMULATOR FOR RECORD #{savedRecord?.id} ]
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(`https://marginguard-web-kappa.vercel.app/approval/${savedRecord?.id}`);
                alert("Approval link copied to clipboard!");
              }}
              className="w-full py-2.5 bg-gray-800 text-amber-400 font-bold rounded-xl text-xs border border-amber-400/30"
            >
              📋 Copy Approval Link
            </button>

            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-2 bg-gray-900 text-gray-400 text-xs rounded-xl"
            >
              Close Window
            </button>
          </div>
        </div>
      )}

      {/* ADD PRESET MODAL */}
      {showAddPresetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D121B] border border-gray-800 w-full max-w-sm rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-amber-400">Add Custom Scope Template</h3>
            <input
              type="text"
              placeholder="Preset Title (e.g., Trenching)"
              value={newPresetLabel}
              onChange={e => setNewPresetLabel(e.target.value)}
              className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
            />
            <textarea
              rows={3}
              placeholder="Template Description / Scope Note"
              value={newPresetNote}
              onChange={e => setNewPresetNote(e.target.value)}
              className="w-full bg-[#05070A] border border-gray-800 rounded-xl p-2.5 text-xs text-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowAddPresetModal(false)} className="px-3 py-1.5 bg-gray-800 text-xs font-bold rounded-xl">Cancel</button>
              <button onClick={handleAddPreset} className="px-3 py-1.5 bg-amber-400 text-black text-xs font-bold rounded-xl">Save Preset</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}