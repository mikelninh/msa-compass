import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════
//  MSA COMPASS v2.0 — The All-In-One MSA-C Platform
//  Track · Analyze · Research · Hope
//  Languages: English · Deutsch · Tiếng Việt
// ═══════════════════════════════════════════════════════════

// ─── i18n (3 languages) ──────────────────────────────────
const LANGS = { en: "English", de: "Deutsch", vi: "Tiếng Việt" };
const T = {
  en: {
    appName: "MSA Compass", tagline: "Track · Analyze · Research · Hope",
    home: "Home", track: "Track", analyze: "Analyze", research: "Research", pipeline: "Pipeline", settings: "Settings",
    goodMorning: "Good morning", goodAfternoon: "Good afternoon", goodEvening: "Good evening",
    todaySummary: "Today's Progress", completedOf: "completed of", modules: "modules",
    alertsTitle: "Trend Alerts", noAlerts: "No alerts — keep tracking for insights",
    dailyCheckin: "Daily Check-in", howAreYou: "How is the patient feeling today?",
    much_better: "Much better", somewhat_better: "Somewhat better", same: "About the same",
    somewhat_worse: "Somewhat worse", much_worse: "Much worse",
    walkTest: "Walk Test", walkTestDesc: "2-min walk — phone detects gait patterns",
    voiceTest: "Voice Analysis", voiceTestDesc: "30-sec reading — AI analyzes speech",
    bloodPressure: "Blood Pressure", bpDesc: "Lying & standing — detect orthostatic drop",
    fallsLog: "Falls Log", fallsDesc: "Record falls & near-falls",
    symptoms: "Symptoms", symptomsDesc: "Rate 8 key MSA-C domains",
    meds: "Medications", medsDesc: "Track doses & timing",
    balance: "Balance", walking: "Walking", speech: "Speech", swallowing: "Swallowing",
    dizziness: "Dizziness", fatigue: "Fatigue", bladder: "Bladder", sleep: "Sleep Quality",
    none: "None", mild: "Mild", moderate: "Moderate", severe: "Severe",
    systolic: "Systolic", diastolic: "Diastolic", heartRate: "Heart Rate",
    lying: "Lying down", standing: "Standing", addReading: "Save Reading",
    falls: "Falls today", nearFalls: "Near-falls today",
    notes: "Notes (optional)", save: "Save", saved: "Saved ✓",
    walkInstructions: "Place your phone in your pocket or hold steady. Walk at your normal pace for 2 minutes.",
    startWalking: "Start Walking", stopWalking: "Stop",
    stepsDetected: "movement events", walkingTime: "Walking time",
    voiceInstructions: "Read this passage clearly at your normal pace:",
    voicePassageEN: '"The sun was warm on the hills. Birds sang in the morning air. The river ran quietly through the valley, and the old bridge stood as it always had, patient and strong."',
    startRecording: "Start Recording", stopRecording: "Stop Recording",
    recording: "Recording...", recordingTime: "Recording time",
    completedToday: "Done", pending: "Ready",
    // Analyze
    analyzeTitle: "Analysis", speechAnalysis: "Speech Analysis", gaitAnalysis: "Gait Analysis",
    trendsTitle: "Trends", weeklyTrend: "Weekly Trend", monthlyTrend: "Monthly Trend",
    overallFeeling: "Overall Feeling", symptomTrends: "Symptom Trends",
    noDataYet: "Record data to see analysis here",
    pitchVariability: "Pitch Variability", speakingRate: "Speaking Rate",
    pauseRatio: "Pause Ratio", speechScore: "Speech Score",
    strideRegularity: "Stride Regularity", swayMagnitude: "Sway Intensity",
    walkSymmetry: "Walk Symmetry", gaitScore: "Gait Score",
    normal: "Normal", atRisk: "At Risk", concern: "Concern",
    trendStable: "Stable", trendImproving: "Improving", trendDeclining: "Declining",
    trendAlert: "Accelerating decline detected", trendAlertDesc: "Consider discussing with your neurologist",
    week: "Week", month: "Month", all: "All",
    // Research
    researchTitle: "Research Hub", contributeData: "Contribute to Research",
    contributeDesc: "Share your anonymized tracking data with MSA researchers worldwide. Your data helps make clinical trials faster and brings treatments closer.",
    anonymized: "All personal identifiers are removed",
    contributeBtn: "Prepare Anonymized Export", contributed: "Data exported ✓",
    trialsTitle: "Clinical Trials", trialsDesc: "Active trials recruiting MSA patients",
    findTrials: "Find Trials Near You",
    naturalHistory: "Natural History Project",
    naturalHistoryDesc: "Every day you track builds the largest MSA-C dataset ever assembled. This data can serve as synthetic control arms for future trials — meaning fewer patients need placebos and treatments reach people faster.",
    dataPoints: "data points", daysTracked: "days tracked", patients: "patients worldwide",
    // Pipeline
    pipelineTitle: "Treatment Pipeline", pipelineDesc: "Where hope stands — updated research overview",
    phase1: "Phase 1", phase2: "Phase 2", phase3: "Phase 3", approved: "Approved",
    leadCandidate: "Lead Candidate", mechanism: "Mechanism", status: "Status",
    resultsExpected: "Results Expected", company: "Company",
    mostAdvanced: "Most Advanced",
    // Settings
    language: "Language", exportData: "Export All Data", exportCSV: "Export as CSV",
    exportJSON: "Export as JSON", exportDesc: "Share with your medical team or contribute to research",
    about: "About MSA Compass",
    aboutText: "MSA Compass is the all-in-one platform for patients, caregivers, and researchers fighting Multiple System Atrophy. Every data point brings us closer to effective treatments. Built with love and hope.",
    privacyNote: "All data stays on your device 🔒",
    resetData: "Reset All Data", resetConfirm: "This will permanently delete all data. Are you sure?",
    cancel: "Cancel", confirm: "Yes, reset",
    version: "v2.0 — Built for the MSA community",
    medName: "Medication", medDose: "Dose", medTime: "Time taken", addMed: "Add", removeMed: "✕",
    // Motivational
    quoteOfDay: "Hope is a discipline.",
    hopeTitle: "We Are Not Alone", hopeDesc: "MSA Compass is used by patients and caregivers around the world. Every entry counts.",
  },
  de: {
    appName: "MSA Kompass", tagline: "Erfassen · Analysieren · Forschen · Hoffen",
    home: "Start", track: "Erfassen", analyze: "Analyse", research: "Forschung", pipeline: "Pipeline", settings: "Einstellungen",
    goodMorning: "Guten Morgen", goodAfternoon: "Guten Tag", goodEvening: "Guten Abend",
    todaySummary: "Heutiger Fortschritt", completedOf: "von", modules: "Modulen abgeschlossen",
    alertsTitle: "Trend-Warnungen", noAlerts: "Keine Warnungen — weiter erfassen für Einblicke",
    dailyCheckin: "Täglicher Check-in", howAreYou: "Wie fühlt sich der Patient heute?",
    much_better: "Viel besser", somewhat_better: "Etwas besser", same: "Etwa gleich",
    somewhat_worse: "Etwas schlechter", much_worse: "Viel schlechter",
    walkTest: "Gehtest", walkTestDesc: "2-Min-Gehen — Handy erkennt Gangmuster",
    voiceTest: "Stimmanalyse", voiceTestDesc: "30-Sek-Vorlesen — KI analysiert Sprache",
    bloodPressure: "Blutdruck", bpDesc: "Liegend & stehend — Orthostatik erkennen",
    fallsLog: "Sturzprotokoll", fallsDesc: "Stürze & Beinahe-Stürze erfassen",
    symptoms: "Symptome", symptomsDesc: "8 MSA-C Hauptbereiche bewerten",
    meds: "Medikamente", medsDesc: "Dosen & Zeiten erfassen",
    balance: "Gleichgewicht", walking: "Gehen", speech: "Sprache", swallowing: "Schlucken",
    dizziness: "Schwindel", fatigue: "Müdigkeit", bladder: "Blase", sleep: "Schlafqualität",
    none: "Keine", mild: "Leicht", moderate: "Mäßig", severe: "Schwer",
    systolic: "Systolisch", diastolic: "Diastolisch", heartRate: "Herzfrequenz",
    lying: "Liegend", standing: "Stehend", addReading: "Speichern",
    falls: "Stürze heute", nearFalls: "Beinahe-Stürze heute",
    notes: "Notizen (optional)", save: "Speichern", saved: "Gespeichert ✓",
    walkInstructions: "Handy in die Tasche oder ruhig halten. 2 Minuten im normalen Tempo gehen.",
    startWalking: "Gehen starten", stopWalking: "Stopp",
    stepsDetected: "Bewegungsereignisse", walkingTime: "Gehzeit",
    voiceInstructions: "Lesen Sie diesen Text deutlich in normalem Tempo vor:",
    voicePassageEN: '„Die Sonne wärmte die Hügel. Vögel sangen in der Morgenluft. Der Fluss floss still durch das Tal, und die alte Brücke stand wie immer, geduldig und stark."',
    startRecording: "Aufnahme starten", stopRecording: "Aufnahme beenden",
    recording: "Aufnahme...", recordingTime: "Aufnahmezeit",
    completedToday: "Fertig", pending: "Bereit",
    analyzeTitle: "Analyse", speechAnalysis: "Sprachanalyse", gaitAnalysis: "Ganganalyse",
    trendsTitle: "Trends", weeklyTrend: "Wochentrend", monthlyTrend: "Monatstrend",
    overallFeeling: "Allgemeines Befinden", symptomTrends: "Symptomtrends",
    noDataYet: "Daten erfassen um Analysen zu sehen",
    pitchVariability: "Tonhöhenvariabilität", speakingRate: "Sprechgeschwindigkeit",
    pauseRatio: "Pausenanteil", speechScore: "Sprachwert",
    strideRegularity: "Schrittregelmäßigkeit", swayMagnitude: "Schwankungsintensität",
    walkSymmetry: "Gangsymmetrie", gaitScore: "Gangwert",
    normal: "Normal", atRisk: "Gefährdet", concern: "Auffällig",
    trendStable: "Stabil", trendImproving: "Verbessernd", trendDeclining: "Verschlechternd",
    trendAlert: "Beschleunigter Rückgang erkannt", trendAlertDesc: "Sprechen Sie mit Ihrem Neurologen",
    week: "Woche", month: "Monat", all: "Alle",
    researchTitle: "Forschung", contributeData: "Zur Forschung beitragen",
    contributeDesc: "Teilen Sie anonymisierte Daten mit MSA-Forschern weltweit. Ihre Daten beschleunigen klinische Studien.",
    anonymized: "Alle persönlichen Daten werden entfernt",
    contributeBtn: "Anonymisierten Export vorbereiten", contributed: "Daten exportiert ✓",
    trialsTitle: "Klinische Studien", trialsDesc: "Aktive Studien für MSA-Patienten",
    findTrials: "Studien in Ihrer Nähe finden",
    naturalHistory: "Natürlicher Verlauf Projekt",
    naturalHistoryDesc: "Jeder Tag, den Sie erfassen, baut den größten MSA-C-Datensatz aller Zeiten auf. Diese Daten können als synthetische Kontrollarme für zukünftige Studien dienen.",
    dataPoints: "Datenpunkte", daysTracked: "Tage erfasst", patients: "Patienten weltweit",
    pipelineTitle: "Behandlungspipeline", pipelineDesc: "Wo die Hoffnung steht — aktueller Forschungsstand",
    phase1: "Phase 1", phase2: "Phase 2", phase3: "Phase 3", approved: "Zugelassen",
    leadCandidate: "Kandidat", mechanism: "Mechanismus", status: "Status",
    resultsExpected: "Ergebnisse erwartet", company: "Unternehmen", mostAdvanced: "Am weitesten",
    language: "Sprache", exportData: "Alle Daten exportieren", exportCSV: "Als CSV exportieren",
    exportJSON: "Als JSON exportieren", exportDesc: "Mit Ärzteteam teilen oder zur Forschung beitragen",
    about: "Über MSA Kompass",
    aboutText: "MSA Kompass ist die All-in-One-Plattform für Patienten, Pflegende und Forscher im Kampf gegen MSA. Jeder Datenpunkt bringt uns effektiven Behandlungen näher.",
    privacyNote: "Alle Daten bleiben auf Ihrem Gerät 🔒",
    resetData: "Alle Daten zurücksetzen", resetConfirm: "Dies löscht alle Daten dauerhaft. Sicher?",
    cancel: "Abbrechen", confirm: "Ja, zurücksetzen",
    version: "v2.0 — Für die MSA-Gemeinschaft gebaut",
    medName: "Medikament", medDose: "Dosis", medTime: "Einnahmezeit", addMed: "Hinzufügen", removeMed: "✕",
    quoteOfDay: "Hoffnung ist eine Disziplin.",
    hopeTitle: "Wir sind nicht allein", hopeDesc: "MSA Kompass wird weltweit von Patienten und Pflegenden genutzt.",
  },
  vi: {
    appName: "MSA La Bàn", tagline: "Theo dõi · Phân tích · Nghiên cứu · Hy vọng",
    home: "Trang chủ", track: "Theo dõi", analyze: "Phân tích", research: "Nghiên cứu", pipeline: "Thuốc mới", settings: "Cài đặt",
    goodMorning: "Chào buổi sáng", goodAfternoon: "Chào buổi chiều", goodEvening: "Chào buổi tối",
    todaySummary: "Tiến độ hôm nay", completedOf: "hoàn thành trong", modules: "mục",
    alertsTitle: "Cảnh báo xu hướng", noAlerts: "Không có cảnh báo — tiếp tục theo dõi",
    dailyCheckin: "Kiểm tra hàng ngày", howAreYou: "Hôm nay bệnh nhân cảm thấy thế nào?",
    much_better: "Tốt hơn nhiều", somewhat_better: "Tốt hơn một chút", same: "Như cũ",
    somewhat_worse: "Xấu hơn một chút", much_worse: "Xấu hơn nhiều",
    walkTest: "Bài tập đi", walkTestDesc: "Đi bộ 2 phút — điện thoại phát hiện dáng đi",
    voiceTest: "Phân tích giọng nói", voiceTestDesc: "Đọc 30 giây — AI phân tích lời nói",
    bloodPressure: "Huyết áp", bpDesc: "Nằm & đứng — phát hiện tụt huyết áp",
    fallsLog: "Ghi nhận té ngã", fallsDesc: "Ghi lại té ngã & suýt ngã",
    symptoms: "Triệu chứng", symptomsDesc: "Đánh giá 8 lĩnh vực MSA-C chính",
    meds: "Thuốc", medsDesc: "Theo dõi liều & thời gian",
    balance: "Thăng bằng", walking: "Đi lại", speech: "Nói", swallowing: "Nuốt",
    dizziness: "Chóng mặt", fatigue: "Mệt mỏi", bladder: "Bàng quang", sleep: "Chất lượng giấc ngủ",
    none: "Không", mild: "Nhẹ", moderate: "Vừa", severe: "Nặng",
    systolic: "Tâm thu", diastolic: "Tâm trương", heartRate: "Nhịp tim",
    lying: "Nằm", standing: "Đứng", addReading: "Lưu",
    falls: "Té ngã hôm nay", nearFalls: "Suýt ngã hôm nay",
    notes: "Ghi chú (tùy chọn)", save: "Lưu", saved: "Đã lưu ✓",
    walkInstructions: "Đặt điện thoại trong túi hoặc giữ vững. Đi bộ bình thường trong 2 phút.",
    startWalking: "Bắt đầu đi", stopWalking: "Dừng",
    stepsDetected: "sự kiện chuyển động", walkingTime: "Thời gian đi",
    voiceInstructions: "Đọc đoạn văn này rõ ràng với tốc độ bình thường:",
    voicePassageEN: '"Nắng ấm trên đồi. Chim hót trong gió sớm. Dòng sông chảy êm qua thung lũng, và cây cầu cũ vẫn đứng như xưa, kiên nhẫn và vững chãi."',
    startRecording: "Bắt đầu ghi âm", stopRecording: "Dừng ghi âm",
    recording: "Đang ghi...", recordingTime: "Thời gian ghi",
    completedToday: "Xong", pending: "Sẵn sàng",
    analyzeTitle: "Phân tích", speechAnalysis: "Phân tích giọng nói", gaitAnalysis: "Phân tích dáng đi",
    trendsTitle: "Xu hướng", weeklyTrend: "Xu hướng tuần", monthlyTrend: "Xu hướng tháng",
    overallFeeling: "Cảm giác chung", symptomTrends: "Xu hướng triệu chứng",
    noDataYet: "Ghi dữ liệu để xem phân tích",
    pitchVariability: "Biến đổi cao độ", speakingRate: "Tốc độ nói",
    pauseRatio: "Tỉ lệ ngừng", speechScore: "Điểm giọng nói",
    strideRegularity: "Đều bước", swayMagnitude: "Cường độ lắc",
    walkSymmetry: "Đối xứng bước đi", gaitScore: "Điểm dáng đi",
    normal: "Bình thường", atRisk: "Có nguy cơ", concern: "Cần chú ý",
    trendStable: "Ổn định", trendImproving: "Cải thiện", trendDeclining: "Suy giảm",
    trendAlert: "Phát hiện suy giảm nhanh", trendAlertDesc: "Hãy trao đổi với bác sĩ thần kinh",
    week: "Tuần", month: "Tháng", all: "Tất cả",
    researchTitle: "Trung tâm nghiên cứu", contributeData: "Đóng góp cho nghiên cứu",
    contributeDesc: "Chia sẻ dữ liệu ẩn danh với các nhà nghiên cứu MSA trên toàn thế giới. Dữ liệu của bạn giúp đẩy nhanh thử nghiệm lâm sàng.",
    anonymized: "Mọi thông tin cá nhân được xóa bỏ",
    contributeBtn: "Chuẩn bị xuất ẩn danh", contributed: "Đã xuất dữ liệu ✓",
    trialsTitle: "Thử nghiệm lâm sàng", trialsDesc: "Các thử nghiệm đang tuyển bệnh nhân MSA",
    findTrials: "Tìm thử nghiệm gần bạn",
    naturalHistory: "Dự án lịch sử tự nhiên",
    naturalHistoryDesc: "Mỗi ngày bạn theo dõi giúp xây dựng bộ dữ liệu MSA-C lớn nhất từ trước đến nay. Dữ liệu này giúp các thử nghiệm tương lai nhanh hơn.",
    dataPoints: "điểm dữ liệu", daysTracked: "ngày theo dõi", patients: "bệnh nhân trên thế giới",
    pipelineTitle: "Thuốc đang phát triển", pipelineDesc: "Hy vọng ở đâu — tổng quan nghiên cứu mới nhất",
    phase1: "Giai đoạn 1", phase2: "Giai đoạn 2", phase3: "Giai đoạn 3", approved: "Đã duyệt",
    leadCandidate: "Ứng viên", mechanism: "Cơ chế", status: "Trạng thái",
    resultsExpected: "Kết quả dự kiến", company: "Công ty", mostAdvanced: "Tiên tiến nhất",
    language: "Ngôn ngữ", exportData: "Xuất tất cả dữ liệu", exportCSV: "Xuất CSV",
    exportJSON: "Xuất JSON", exportDesc: "Chia sẻ với bác sĩ hoặc đóng góp cho nghiên cứu",
    about: "Về MSA La Bàn",
    aboutText: "MSA La Bàn là nền tảng tất-cả-trong-một cho bệnh nhân, người chăm sóc và nhà nghiên cứu chống lại MSA. Mỗi dữ liệu đưa chúng ta gần hơn đến phương pháp điều trị hiệu quả.",
    privacyNote: "Mọi dữ liệu được lưu trên thiết bị của bạn 🔒",
    resetData: "Xóa tất cả dữ liệu", resetConfirm: "Xóa vĩnh viễn tất cả dữ liệu. Bạn chắc chứ?",
    cancel: "Hủy", confirm: "Đồng ý, xóa",
    version: "v2.0 — Xây dựng cho cộng đồng MSA",
    medName: "Tên thuốc", medDose: "Liều", medTime: "Giờ uống", addMed: "Thêm", removeMed: "✕",
    quoteOfDay: "Hy vọng là một kỷ luật.",
    hopeTitle: "Chúng ta không đơn độc", hopeDesc: "MSA La Bàn được sử dụng bởi bệnh nhân và người chăm sóc trên toàn thế giới.",
  },
};

const FEELING = ["much_worse", "somewhat_worse", "same", "somewhat_better", "much_better"];
const FEELING_EMOJI = ["😟", "😕", "😐", "🙂", "😊"];
const SEVERITY = ["none", "mild", "moderate", "severe"];
const SEV_COLORS = ["#3a5a3a", "#5a5030", "#6a4020", "#6a2020"];
const SYMPTOM_KEYS = ["balance", "walking", "speech", "swallowing", "dizziness", "fatigue", "bladder", "sleep"];
const dateKey = (d = new Date()) => d.toISOString().split("T")[0];

// ─── Drug Pipeline Data ──────────────────────────────────
const PIPELINE = [
  { name: "Amlenetug", co: "Lundbeck", mech: "α-synuclein antibody", phase: 3, results: "Q3 2027", note: "MASCOT trial — 360 patients, ahead of schedule. FDA Fast Track." },
  { name: "ATH434", co: "Alterity", mech: "Iron chaperone (oral)", phase: 2, results: "Phase 3 planned 2026-27", note: "48% slowing of progression in Phase 2. Best efficacy signal ever in MSA." },
  { name: "Emrusolmin", co: "Teva/MODAG", mech: "α-syn oligomer inhibitor (oral)", phase: 2, results: "Early 2027", note: "TOPAS-MSA trial — 200 patients. FDA Fast Track. Crosses cell membranes." },
  { name: "ONO-2808", co: "Ono Pharma", mech: "S1P5 receptor agonist", phase: 2, results: "2026-27", note: "Targets oligodendrocytes directly. Interim data shows promise. Japan+US trial." },
  { name: "AB-1005", co: "AskBio/Bayer", mech: "Gene therapy (AAV2-GDNF)", phase: 1, results: "2026", note: "First gene therapy for MSA. MSA-P only currently." },
  { name: "Foralumab", co: "Tiziana", mech: "Anti-CD3 (intranasal)", phase: 2, results: "TBD", note: "Targets neuroinflammation via T-cells. FDA IND approved Aug 2025." },
];

// ─── Storage ─────────────────────────────────────────────
const sGet = async (k) => { try { const r = await window.storage.get(k); return r ? JSON.parse(r.value) : null; } catch { return null; } };
const sSet = async (k, v) => { try { await window.storage.set(k, JSON.stringify(v)); } catch(e) { console.error(e); } };

// ─── Speech Analysis Engine ──────────────────────────────
function analyzeSpeechData(audioData) {
  if (!audioData || audioData.length === 0) return null;
  const bufferSize = audioData.length;
  let zeroCrossings = 0, energy = 0, maxAmp = 0, silentFrames = 0;
  const silenceThreshold = 0.02;
  for (let i = 1; i < bufferSize; i++) {
    if ((audioData[i] >= 0 && audioData[i - 1] < 0) || (audioData[i] < 0 && audioData[i - 1] >= 0)) zeroCrossings++;
    const amp = Math.abs(audioData[i]);
    energy += amp * amp;
    if (amp > maxAmp) maxAmp = amp;
    if (amp < silenceThreshold) silentFrames++;
  }
  const avgEnergy = Math.sqrt(energy / bufferSize);
  const zcRate = zeroCrossings / (bufferSize / 44100);
  const pauseRatio = silentFrames / bufferSize;
  const estimatedPitch = zcRate / 2;
  const pitchVariability = Math.min(100, Math.max(0, (estimatedPitch - 80) / 3));
  const speakingRate = Math.min(100, Math.max(0, (1 - pauseRatio) * 100));
  const pauseScore = Math.min(100, pauseRatio * 200);
  const speechScore = Math.round(Math.max(0, Math.min(100, 100 - (pitchVariability * 0.3 + pauseScore * 0.4 + (100 - speakingRate) * 0.3))));
  return { pitchVariability: Math.round(pitchVariability), speakingRate: Math.round(speakingRate), pauseRatio: Math.round(pauseScore), speechScore, avgEnergy: Math.round(avgEnergy * 1000) / 1000 };
}

// ─── Gait Analysis Engine ────────────────────────────────
function analyzeGaitData(motionSamples) {
  if (!motionSamples || motionSamples.length < 20) return null;
  const magnitudes = motionSamples.map(s => Math.sqrt(s.x ** 2 + s.y ** 2 + s.z ** 2));
  const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  const variance = magnitudes.reduce((a, b) => a + (b - mean) ** 2, 0) / magnitudes.length;
  const stdDev = Math.sqrt(variance);
  let peaks = 0, lastPeak = -10;
  for (let i = 2; i < magnitudes.length - 2; i++) {
    if (magnitudes[i] > magnitudes[i-1] && magnitudes[i] > magnitudes[i+1] && magnitudes[i] > mean + stdDev * 0.5 && (i - lastPeak) > 5) {
      peaks++; lastPeak = i;
    }
  }
  const intervals = [];
  let prevPeak = -1;
  for (let i = 2; i < magnitudes.length - 2; i++) {
    if (magnitudes[i] > magnitudes[i-1] && magnitudes[i] > magnitudes[i+1] && magnitudes[i] > mean + stdDev * 0.5) {
      if (prevPeak > 0 && (i - prevPeak) > 5) intervals.push(i - prevPeak);
      prevPeak = i;
    }
  }
  let regularity = 80;
  if (intervals.length > 2) {
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const intervalVar = intervals.reduce((a, b) => a + (b - avgInterval) ** 2, 0) / intervals.length;
    const cv = Math.sqrt(intervalVar) / avgInterval;
    regularity = Math.round(Math.max(0, Math.min(100, (1 - cv) * 100)));
  }
  const swayMagnitude = Math.round(Math.min(100, stdDev * 20));
  const symmetry = Math.round(Math.max(0, 100 - swayMagnitude * 0.5));
  const gaitScore = Math.round((regularity * 0.4 + (100 - swayMagnitude) * 0.3 + symmetry * 0.3));
  return { strideRegularity: regularity, swayMagnitude, walkSymmetry: symmetry, gaitScore, peakCount: peaks };
}

// ─── Trend Detection Engine ──────────────────────────────
function detectTrends(allDays) {
  const entries = Object.entries(allDays).sort((a, b) => a[0].localeCompare(b[0]));
  if (entries.length < 5) return { trend: "stable", alerts: [] };
  const alerts = [];
  const recent = entries.slice(-7);
  const older = entries.slice(-14, -7);
  if (recent.length >= 3 && older.length >= 3) {
    const recentFeelings = recent.filter(([, v]) => v.feeling).map(([, v]) => FEELING.indexOf(v.feeling));
    const olderFeelings = older.filter(([, v]) => v.feeling).map(([, v]) => FEELING.indexOf(v.feeling));
    if (recentFeelings.length >= 2 && olderFeelings.length >= 2) {
      const rAvg = recentFeelings.reduce((a, b) => a + b, 0) / recentFeelings.length;
      const oAvg = olderFeelings.reduce((a, b) => a + b, 0) / olderFeelings.length;
      if (rAvg < oAvg - 0.8) alerts.push({ type: "feeling_decline", severity: "warning" });
    }
  }
  const recentFalls = recent.reduce((sum, [, v]) => sum + (v.falls || 0), 0);
  const olderFalls = older.reduce((sum, [, v]) => sum + (v.falls || 0), 0);
  if (recentFalls > olderFalls + 2) alerts.push({ type: "falls_increase", severity: "alert" });
  const recentGait = recent.filter(([, v]) => v.gaitAnalysis).map(([, v]) => v.gaitAnalysis.gaitScore);
  if (recentGait.length >= 3) {
    const gaitTrend = recentGait[recentGait.length - 1] - recentGait[0];
    if (gaitTrend < -15) alerts.push({ type: "gait_decline", severity: "alert" });
  }
  const trend = alerts.length > 0 ? "declining" : "stable";
  return { trend, alerts };
}

// ═══════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════
export default function MSACompassV2() {
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("home");
  const [sub, setSub] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [today, setToday] = useState({});
  const [allDays, setAllDays] = useState({});
  const [showReset, setShowReset] = useState(false);
  const [flash, setFlash] = useState({});
  const t = T[lang];

  useEffect(() => {
    (async () => {
      const sl = await sGet("msa2-lang"); if (sl) setLang(sl);
      const days = (await sGet("msa2-days")) || {};
      setAllDays(days);
      setToday(days[dateKey()] || {});
      setLoaded(true);
    })();
  }, []);

  const saveDay = useCallback(async (patch) => {
    const k = dateKey();
    const upd = { ...today, ...patch, date: k, ts: new Date().toISOString() };
    setToday(upd);
    const newAll = { ...allDays, [k]: upd };
    setAllDays(newAll);
    await sSet("msa2-days", newAll);
  }, [today, allDays]);

  const doFlash = (id) => { setFlash(p => ({ ...p, [id]: true })); setTimeout(() => setFlash(p => ({ ...p, [id]: false })), 2000); };
  const changeLang = async (l) => { setLang(l); await sSet("msa2-lang", l); };
  const resetAll = async () => { setAllDays({}); setToday({}); await sSet("msa2-days", {}); setShowReset(false); };

  const trends = useMemo(() => detectTrends(allDays), [allDays]);
  const dayCount = Object.keys(allDays).length;
  const dataPoints = Object.values(allDays).reduce((s, d) => {
    let c = 0; if (d.feeling) c++; if (d.symptoms) c += Object.keys(d.symptoms).length;
    if (d.bp) c += d.bp.length; if (d.walkTest) c++; if (d.voiceTest) c++; if (d.falls !== undefined) c++; return s + c;
  }, 0);

  const modules = [
    { id: "checkin", icon: "☀", t: t.dailyCheckin, d: t.howAreYou, done: !!today.feeling },
    { id: "symptoms", icon: "◎", t: t.symptoms, d: t.symptomsDesc, done: !!today.symptoms },
    { id: "walk", icon: "⟡", t: t.walkTest, d: t.walkTestDesc, done: !!today.walkTest },
    { id: "voice", icon: "♪", t: t.voiceTest, d: t.voiceTestDesc, done: !!today.voiceTest },
    { id: "bp", icon: "♡", t: t.bloodPressure, d: t.bpDesc, done: today.bp?.length > 0 },
    { id: "falls", icon: "⚡", t: t.fallsLog, d: t.fallsDesc, done: today.falls !== undefined },
    { id: "meds", icon: "💊", t: t.meds, d: t.medsDesc, done: today.meds?.length > 0 },
  ];
  const doneCount = modules.filter(m => m.done).length;

  if (!loaded) return <div style={S.loadWrap}><div style={S.spinner}><svg width="48" height="48" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" fill="none" stroke="#D4956A" strokeWidth="2" opacity=".3"/><path d="M24 4a20 20 0 0 1 20 20" fill="none" stroke="#D4956A" strokeWidth="2.5" strokeLinecap="round"><animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="1s" repeatCount="indefinite"/></path></svg></div></div>;

  const greeting = () => { const h = new Date().getHours(); return h < 12 ? t.goodMorning : h < 18 ? t.goodAfternoon : t.goodEvening; };

  // ─── Render ────────────────────────────────────────────
  return (
    <div style={S.app}><style>{CSS}</style>
      {/* ── Header ── */}
      <header style={S.header}>
        <div style={S.hInner}>
          <div style={S.logo}>
            <svg width="28" height="28" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="none" stroke="#D4956A" strokeWidth="1.5"/><circle cx="16" cy="16" r="2" fill="#D4956A"/><path d="M16 5l2.5 9h-5z" fill="#D4956A"/><path d="M16 27l-2.5-9h5z" fill="#8B7355" opacity=".5"/></svg>
            <div><h1 style={S.title}>{t.appName}</h1><p style={S.tagline}>{t.tagline}</p></div>
          </div>
          <select value={lang} onChange={e => changeLang(e.target.value)} style={S.langSel}>
            {Object.entries(LANGS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </header>

      {/* ── Nav ── */}
      <nav style={S.nav}>
        {["home","track","analyze","research","pipeline","settings"].map(id => (
          <button key={id} onClick={() => { setTab(id); setSub(null); }}
            style={{ ...S.navBtn, ...(tab === id ? S.navAct : {}) }}>
            <span style={S.navIco}>{{home:"⌂",track:"◉",analyze:"◔",research:"⬡",pipeline:"⧫",settings:"⚙"}[id]}</span>
            <span style={S.navLbl}>{t[id]}</span>
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <main style={S.main}>
        {/* HOME */}
        {tab === "home" && (
          <div style={S.fade}>
            <div style={S.greetCard}>
              <p style={S.greetText}>{greeting()}</p>
              <p style={S.dateText}>{new Date().toLocaleDateString(lang === "vi" ? "vi-VN" : lang === "de" ? "de-DE" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              <div style={S.progBar}><div style={{ ...S.progFill, width: `${(doneCount / modules.length) * 100}%` }}/></div>
              <p style={S.progText}>{doneCount} {t.completedOf} {modules.length} {t.modules}</p>
            </div>
            {/* Trend Alerts */}
            {trends.alerts.length > 0 && (
              <div style={S.alertCard}>
                <div style={S.alertDot}/>
                <div><p style={S.alertTitle}>{t.trendAlert}</p><p style={S.alertDesc}>{t.trendAlertDesc}</p></div>
              </div>
            )}
            {/* Quick stats */}
            <div style={S.statsRow}>
              <div style={S.stat}><span style={S.statN}>{dayCount}</span><span style={S.statL}>{t.daysTracked}</span></div>
              <div style={S.stat}><span style={S.statN}>{dataPoints}</span><span style={S.statL}>{t.dataPoints}</span></div>
            </div>
            {/* Hope quote */}
            <div style={S.hopeCard}>
              <p style={S.hopeQuote}>"{t.quoteOfDay}"</p>
              <p style={S.hopeTitle}>{t.hopeTitle}</p>
              <p style={S.hopeDesc}>{t.hopeDesc}</p>
            </div>
            {/* Quick action */}
            <button onClick={() => { setTab("track"); setSub(null); }} style={S.primaryBtn}>
              {t.todaySummary} →
            </button>
          </div>
        )}

        {/* TRACK */}
        {tab === "track" && !sub && (
          <div style={S.fade}>
            <h2 style={S.secTitle}>{t.track}</h2>
            <div style={S.modGrid}>
              {modules.map(m => (
                <button key={m.id} onClick={() => setSub(m.id)} style={{ ...S.modCard, ...(m.done ? S.modDone : {}) }}>
                  <div style={S.modTop}><span style={S.modIco}>{m.icon}</span>{m.done && <span style={S.check}>✓</span>}</div>
                  <h3 style={S.modTitle}>{m.t}</h3>
                  <p style={S.modDesc}>{m.done ? t.completedToday : m.d}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Track sub-modules */}
        {tab === "track" && sub === "checkin" && <CheckinMod t={t} data={today} save={saveDay} back={() => setSub(null)} fl={flash} doFlash={doFlash}/>}
        {tab === "track" && sub === "symptoms" && <SymptomsMod t={t} data={today} save={saveDay} back={() => setSub(null)} fl={flash} doFlash={doFlash}/>}
        {tab === "track" && sub === "walk" && <WalkMod t={t} data={today} save={saveDay} back={() => setSub(null)} doFlash={doFlash}/>}
        {tab === "track" && sub === "voice" && <VoiceMod t={t} data={today} save={saveDay} back={() => setSub(null)} doFlash={doFlash}/>}
        {tab === "track" && sub === "bp" && <BPMod t={t} data={today} save={saveDay} back={() => setSub(null)} fl={flash} doFlash={doFlash}/>}
        {tab === "track" && sub === "falls" && <FallsMod t={t} data={today} save={saveDay} back={() => setSub(null)} fl={flash} doFlash={doFlash}/>}
        {tab === "track" && sub === "meds" && <MedsMod t={t} data={today} save={saveDay} back={() => setSub(null)} fl={flash} doFlash={doFlash}/>}

        {/* ANALYZE */}
        {tab === "analyze" && <AnalyzeView t={t} allDays={allDays} today={today} trends={trends}/>}

        {/* RESEARCH */}
        {tab === "research" && <ResearchView t={t} allDays={allDays} dayCount={dayCount} dataPoints={dataPoints}/>}

        {/* PIPELINE */}
        {tab === "pipeline" && <PipelineView t={t}/>}

        {/* SETTINGS */}
        {tab === "settings" && <SettingsView t={t} lang={lang} changeLang={changeLang} allDays={allDays} setShowReset={setShowReset}/>}
      </main>

      <footer style={S.footer}><p style={S.footTxt}>{t.privacyNote}</p></footer>

      {showReset && (
        <div style={S.overlay} onClick={() => setShowReset(false)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <p style={S.modalTxt}>{t.resetConfirm}</p>
            <div style={S.modalBtns}>
              <button style={S.cancelBtn} onClick={() => setShowReset(false)}>{t.cancel}</button>
              <button style={S.dangerBtn} onClick={resetAll}>{t.confirm}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  TRACK MODULES
// ═══════════════════════════════════════════════════════════
function Back({ fn }) { return <button onClick={fn} style={S.back}>← </button>; }

function CheckinMod({ t, data, save, back, fl, doFlash }) {
  const [f, setF] = useState(data.feeling || null);
  const [n, setN] = useState(data.checkinNotes || "");
  return (<div style={S.fade}><Back fn={back}/>
    <div style={S.mHead}><span style={S.bIco}>☀</span><h2 style={S.mTitle}>{t.dailyCheckin}</h2></div>
    <p style={S.q}>{t.howAreYou}</p>
    <div style={S.fGrid}>{FEELING.map((fe, i) => (
      <button key={fe} onClick={() => setF(fe)} style={{ ...S.fBtn, ...(f === fe ? S.fAct : {}) }}>
        <span style={{ fontSize: 24 }}>{FEELING_EMOJI[i]}</span><span style={S.fLbl}>{t[fe]}</span>
      </button>
    ))}</div>
    <div style={S.ig}><label style={S.iLbl}>{t.notes}</label><textarea style={S.ta} value={n} onChange={e => setN(e.target.value)} rows={3}/></div>
    <button onClick={() => { save({ feeling: f, checkinNotes: n }); doFlash("ck"); }} style={S.primaryBtn}>{fl.ck ? t.saved : t.save}</button>
  </div>);
}

function SymptomsMod({ t, data, save, back, fl, doFlash }) {
  const [s, setS] = useState(data.symptoms || {});
  return (<div style={S.fade}><Back fn={back}/>
    <div style={S.mHead}><span style={S.bIco}>◎</span><h2 style={S.mTitle}>{t.symptoms}</h2></div>
    <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
      {SYMPTOM_KEYS.map(k => (
        <div key={k}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#c0b8a8", display: "block", marginBottom: 6 }}>{t[k]}</span>
          <div style={{ display: "flex", gap: 6 }}>
            {SEVERITY.map((sv, i) => (
              <button key={sv} onClick={() => setS(p => ({ ...p, [k]: i }))}
                style={{ flex: 1, background: s[k] === i ? SEV_COLORS[i] : "#221f1b", border: `1px solid ${s[k] === i ? "transparent" : "#2a2420"}`, borderRadius: 8, padding: "8px 2px", color: s[k] === i ? "#fff" : "#8a7e6e", fontSize: 11, cursor: "pointer", fontWeight: 500, transition: "all .15s" }}>
                {t[sv]}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
    <button onClick={() => { save({ symptoms: s }); doFlash("sy"); }} style={S.primaryBtn}>{fl.sy ? t.saved : t.save}</button>
  </div>);
}

function WalkMod({ t, data, save, back, doFlash }) {
  const [active, setActive] = useState(false);
  const [sec, setSec] = useState(0);
  const [evts, setEvts] = useState(0);
  const [done, setDone] = useState(!!data.walkTest);
  const timer = useRef(null);
  const samples = useRef([]);
  const evtCount = useRef(0);
  const TARGET = 120;

  useEffect(() => {
    if (!active) return;
    timer.current = setInterval(() => setSec(p => { if (p >= TARGET) { stopW(); return TARGET; } return p + 1; }), 1000);
    const onMotion = (e) => {
      const a = e.accelerationIncludingGravity;
      if (a) {
        samples.current.push({ x: a.x || 0, y: a.y || 0, z: a.z || 0, t: Date.now() });
        const mag = Math.sqrt((a.x||0)**2 + (a.y||0)**2 + (a.z||0)**2);
        if (Math.abs(mag - 9.8) > 2.5) { evtCount.current++; setEvts(evtCount.current); }
      }
    };
    if (typeof DeviceMotionEvent?.requestPermission === "function") DeviceMotionEvent.requestPermission();
    window.addEventListener("devicemotion", onMotion);
    return () => { clearInterval(timer.current); window.removeEventListener("devicemotion", onMotion); };
  }, [active]);

  const startW = () => { setActive(true); setSec(0); setEvts(0); evtCount.current = 0; samples.current = []; setDone(false); };
  const stopW = () => {
    setActive(false); clearInterval(timer.current);
    const gait = analyzeGaitData(samples.current);
    save({ walkTest: { duration: sec, motionEvents: evtCount.current, ts: new Date().toISOString(), sampleCount: samples.current.length }, gaitAnalysis: gait });
    setDone(true); doFlash("wk");
  };

  return (<div style={S.fade}><Back fn={back}/>
    <div style={S.mHead}><span style={S.bIco}>⟡</span><h2 style={S.mTitle}>{t.walkTest}</h2></div>
    <p style={S.instr}>{t.walkInstructions}</p>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0 24px" }}>
      <div style={{ position: "relative", width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" fill="none" stroke="#2a2420" strokeWidth="4"/>
          <circle cx="80" cy="80" r="70" fill="none" stroke="#D4956A" strokeWidth="4" strokeDasharray={`${(sec/TARGET)*440} 440`} strokeLinecap="round" transform="rotate(-90 80 80)" style={{ transition: "stroke-dasharray 1s linear" }}/>
        </svg>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          <span style={{ fontSize: 32, fontFamily: "'Fraunces', serif", color: "#e8e0d4" }}>{Math.floor(sec/60)}:{(sec%60).toString().padStart(2,"0")}</span>
          <br/><span style={{ fontSize: 12, color: "#6a6055" }}>/ 2:00</span>
        </div>
      </div>
      <p style={{ fontSize: 13, color: "#8a7e6e", marginTop: 8 }}>{evts} {t.stepsDetected}</p>
    </div>
    {!active && !done && <button onClick={startW} style={S.primaryBtn}>{t.startWalking}</button>}
    {active && <button onClick={stopW} style={S.stopBtn}>{t.stopWalking}</button>}
    {done && <p style={S.savedMsg}>{t.saved}</p>}
    {done && data.gaitAnalysis && <GaitResults t={t} g={data.gaitAnalysis}/>}
  </div>);
}

function GaitResults({ t, g }) {
  const scoreColor = g.gaitScore > 70 ? "#5a9a5a" : g.gaitScore > 40 ? "#c9a227" : "#b84c4c";
  const scoreLabel = g.gaitScore > 70 ? t.normal : g.gaitScore > 40 ? t.atRisk : t.concern;
  return (
    <div style={{ background: "#221f1b", borderRadius: 14, padding: 16, marginTop: 16, border: "1px solid #2a2420" }}>
      <h3 style={{ fontSize: 14, color: "#8a7e6e", marginBottom: 12 }}>{t.gaitAnalysis}</h3>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 42, fontFamily: "'Fraunces', serif", color: scoreColor }}>{g.gaitScore}</span>
          <span style={{ fontSize: 13, color: scoreColor, display: "block" }}>{scoreLabel}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[["strideRegularity", g.strideRegularity], ["swayMagnitude", g.swayMagnitude], ["walkSymmetry", g.walkSymmetry]].map(([k, v]) => (
          <div key={k} style={{ textAlign: "center", background: "#1a1714", borderRadius: 8, padding: "10px 4px" }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: "#e8e0d4", display: "block" }}>{v}</span>
            <span style={{ fontSize: 10, color: "#8a7e6e" }}>{t[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VoiceMod({ t, data, save, back, doFlash }) {
  const [rec, setRec] = useState(false);
  const [sec, setSec] = useState(0);
  const [done, setDone] = useState(!!data.voiceTest);
  const timer = useRef(null);
  const mediaRef = useRef(null);
  const analyserRef = useRef(null);
  const audioDataRef = useRef([]);

  const startR = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      audioDataRef.current = [];
      const collectData = () => {
        if (!rec && audioDataRef.current.length > 0) return;
        const buf = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(buf);
        audioDataRef.current.push(...buf);
        if (rec) requestAnimationFrame(collectData);
      };
      const mr = new MediaRecorder(stream);
      mr.start(); mediaRef.current = { mr, stream, ctx };
      setRec(true); setSec(0); setDone(false);
      timer.current = setInterval(() => setSec(p => p + 1), 1000);
      // Start collecting after state update
      setTimeout(() => { const collect = () => { if (analyserRef.current) { const buf = new Float32Array(2048); analyserRef.current.getFloatTimeDomainData(buf); audioDataRef.current.push(...buf); } requestAnimationFrame(collect); }; collect(); }, 100);
    } catch (e) { console.error("Mic denied:", e); }
  };

  const stopR = () => {
    if (mediaRef.current) { mediaRef.current.mr.stop(); mediaRef.current.stream.getTracks().forEach(t => t.stop()); mediaRef.current.ctx.close(); }
    clearInterval(timer.current); setRec(false);
    const analysis = analyzeSpeechData(new Float32Array(audioDataRef.current));
    save({ voiceTest: { duration: sec, ts: new Date().toISOString() }, speechAnalysis: analysis });
    setDone(true); doFlash("vc");
  };

  return (<div style={S.fade}><Back fn={back}/>
    <div style={S.mHead}><span style={S.bIco}>♪</span><h2 style={S.mTitle}>{t.voiceTest}</h2></div>
    <p style={S.instr}>{t.voiceInstructions}</p>
    <blockquote style={S.passage}>{t.voicePassageEN}</blockquote>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 0" }}>
      {rec && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#b84c4c", animation: "pulse 1s ease infinite" }}/>}
      <span style={{ fontSize: 14, color: rec ? "#b84c4c" : "transparent", fontWeight: 500 }}>{t.recording} {sec}s</span>
    </div>
    {!rec && !done && <button onClick={startR} style={S.primaryBtn}>{t.startRecording}</button>}
    {rec && <button onClick={stopR} style={S.stopBtn}>{t.stopRecording}</button>}
    {done && <p style={S.savedMsg}>{t.saved}</p>}
    {done && data.speechAnalysis && <SpeechResults t={t} s={data.speechAnalysis}/>}
  </div>);
}

function SpeechResults({ t, s }) {
  const scoreColor = s.speechScore > 70 ? "#5a9a5a" : s.speechScore > 40 ? "#c9a227" : "#b84c4c";
  const scoreLabel = s.speechScore > 70 ? t.normal : s.speechScore > 40 ? t.atRisk : t.concern;
  return (
    <div style={{ background: "#221f1b", borderRadius: 14, padding: 16, marginTop: 16, border: "1px solid #2a2420" }}>
      <h3 style={{ fontSize: 14, color: "#8a7e6e", marginBottom: 12 }}>{t.speechAnalysis}</h3>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <div style={{ textAlign: "center" }}>
          <span style={{ fontSize: 42, fontFamily: "'Fraunces', serif", color: scoreColor }}>{s.speechScore}</span>
          <span style={{ fontSize: 13, color: scoreColor, display: "block" }}>{scoreLabel}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {[["pitchVariability", s.pitchVariability], ["speakingRate", s.speakingRate], ["pauseRatio", s.pauseRatio]].map(([k, v]) => (
          <div key={k} style={{ textAlign: "center", background: "#1a1714", borderRadius: 8, padding: "10px 4px" }}>
            <span style={{ fontSize: 20, fontWeight: 600, color: "#e8e0d4", display: "block" }}>{v}</span>
            <span style={{ fontSize: 10, color: "#8a7e6e" }}>{t[k]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BPMod({ t, data, save, back, fl, doFlash }) {
  const [pos, setPos] = useState("lying");
  const [sys, setSys] = useState(""); const [dia, setDia] = useState(""); const [hr, setHr] = useState("");
  const handleSave = () => {
    const entry = { position: pos, systolic: +sys, diastolic: +dia, heartRate: +hr, time: new Date().toISOString() };
    save({ bp: [...(data.bp || []), entry] }); doFlash("bp"); setSys(""); setDia(""); setHr("");
  };
  return (<div style={S.fade}><Back fn={back}/>
    <div style={S.mHead}><span style={S.bIco}>♡</span><h2 style={S.mTitle}>{t.bloodPressure}</h2></div>
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      {["lying","standing"].map(p => (
        <button key={p} onClick={() => setPos(p)} style={{ flex: 1, background: pos === p ? "#2a2420" : "#221f1b", border: `1.5px solid ${pos === p ? "#D4956A" : "#2a2420"}`, borderRadius: 10, padding: 12, color: pos === p ? "#D4956A" : "#8a7e6e", fontSize: 14, cursor: "pointer", fontWeight: 500 }}>{t[p]}</button>
      ))}
    </div>
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 16 }}>
      {[[t.systolic, sys, setSys, "120"], [t.diastolic, dia, setDia, "80"], [t.heartRate, hr, setHr, "72"]].map(([lbl, val, setVal, ph], i) => (
        <div key={i} style={{ flex: 1 }}>
          <label style={{ fontSize: 10, color: "#8a7e6e", textTransform: "uppercase", letterSpacing: ".5px", display: "block", marginBottom: 4 }}>{lbl}</label>
          <input type="number" value={val} onChange={e => setVal(e.target.value)} placeholder={ph}
            style={{ width: "100%", background: "#221f1b", border: "1px solid #2a2420", borderRadius: 8, padding: "12px 8px", color: "#e8e0d4", fontSize: 18, textAlign: "center", outline: "none", fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}/>
        </div>
      ))}
    </div>
    <button onClick={handleSave} disabled={!sys || !dia} style={{ ...S.primaryBtn, opacity: (!sys || !dia) ? .4 : 1 }}>{fl.bp ? t.saved : t.addReading}</button>
    {data.bp?.length > 0 && <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 6 }}>
      {data.bp.map((r, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#221f1b", borderRadius: 8, padding: "10px 12px", fontSize: 13 }}>
          <span style={{ color: "#8a7e6e", minWidth: 50 }}>{t[r.position]}</span>
          <span style={{ color: "#e8e0d4", fontWeight: 600, fontSize: 16 }}>{r.systolic}/{r.diastolic}</span>
          <span style={{ color: "#D4956A", marginLeft: "auto" }}>♡ {r.heartRate}</span>
        </div>
      ))}
      {data.bp.length >= 2 && (() => {
        const lying = data.bp.find(r => r.position === "lying");
        const standing = data.bp.find(r => r.position === "standing");
        if (lying && standing) {
          const drop = lying.systolic - standing.systolic;
          const isOH = drop >= 20;
          return <div style={{ background: isOH ? "#3a2020" : "#2a3a2a", borderRadius: 8, padding: "10px 12px", marginTop: 4 }}>
            <span style={{ fontSize: 13, color: isOH ? "#e8a0a0" : "#a0c8a0" }}>
              {isOH ? "⚠ " : "✓ "} Orthostatic drop: {drop} mmHg {isOH ? "(≥20 — significant)" : "(< 20 — within range)"}
            </span>
          </div>;
        }
      })()}
    </div>}
  </div>);
}

function FallsMod({ t, data, save, back, fl, doFlash }) {
  const [f, setF] = useState(data.falls ?? 0);
  const [nf, setNf] = useState(data.nearFalls ?? 0);
  const [n, setN] = useState(data.fallNotes || "");
  const Counter = ({ label, val, onChange }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#221f1b", borderRadius: 12, padding: "16px 18px", marginBottom: 12 }}>
      <span style={{ fontSize: 15, color: "#c0b8a8" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button style={S.cBtn} onClick={() => onChange(Math.max(0, val - 1))}>−</button>
        <span style={{ fontSize: 22, fontWeight: 600, color: "#e8e0d4", minWidth: 28, textAlign: "center" }}>{val}</span>
        <button style={S.cBtn} onClick={() => onChange(val + 1)}>+</button>
      </div>
    </div>
  );
  return (<div style={S.fade}><Back fn={back}/>
    <div style={S.mHead}><span style={S.bIco}>⚡</span><h2 style={S.mTitle}>{t.fallsLog}</h2></div>
    <Counter label={t.falls} val={f} onChange={setF}/>
    <Counter label={t.nearFalls} val={nf} onChange={setNf}/>
    <div style={S.ig}><label style={S.iLbl}>{t.notes}</label><textarea style={S.ta} value={n} onChange={e => setN(e.target.value)} rows={2}/></div>
    <button onClick={() => { save({ falls: f, nearFalls: nf, fallNotes: n }); doFlash("fl"); }} style={S.primaryBtn}>{fl.fl ? t.saved : t.save}</button>
  </div>);
}

function MedsMod({ t, data, save, back, fl, doFlash }) {
  const [meds, setMeds] = useState(data.meds || []);
  const [name, setName] = useState(""); const [dose, setDose] = useState(""); const [time, setTime] = useState("");
  const add = () => { if (!name) return; setMeds(p => [...p, { name, dose, time }]); setName(""); setDose(""); setTime(""); };
  const remove = (i) => setMeds(p => p.filter((_, j) => j !== i));
  return (<div style={S.fade}><Back fn={back}/>
    <div style={S.mHead}><span style={S.bIco}>💊</span><h2 style={S.mTitle}>{t.meds}</h2></div>
    {meds.map((m, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, background: "#221f1b", borderRadius: 10, padding: "12px 14px", marginBottom: 8 }}>
        <div style={{ flex: 1 }}><span style={{ color: "#e8e0d4", fontWeight: 500, fontSize: 14 }}>{m.name}</span><span style={{ color: "#8a7e6e", fontSize: 12, marginLeft: 8 }}>{m.dose} — {m.time}</span></div>
        <button onClick={() => remove(i)} style={{ background: "none", border: "none", color: "#6a4040", fontSize: 16, cursor: "pointer" }}>{t.removeMed}</button>
      </div>
    ))}
    <div style={{ display: "flex", gap: 6, marginTop: 12, marginBottom: 16 }}>
      <input placeholder={t.medName} value={name} onChange={e => setName(e.target.value)} style={{ ...S.inp, flex: 2 }}/>
      <input placeholder={t.medDose} value={dose} onChange={e => setDose(e.target.value)} style={{ ...S.inp, flex: 1 }}/>
      <input placeholder={t.medTime} value={time} onChange={e => setTime(e.target.value)} style={{ ...S.inp, flex: 1 }}/>
      <button onClick={add} style={{ background: "#D4956A", border: "none", borderRadius: 8, color: "#1a1714", padding: "0 14px", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>{t.addMed}</button>
    </div>
    <button onClick={() => { save({ meds }); doFlash("md"); }} style={S.primaryBtn}>{fl.md ? t.saved : t.save}</button>
  </div>);
}

// ═══════════════════════════════════════════════════════════
//  ANALYZE VIEW
// ═══════════════════════════════════════════════════════════
function AnalyzeView({ t, allDays, today, trends }) {
  const [range, setRange] = useState("month");
  const entries = Object.entries(allDays).sort((a, b) => a[0].localeCompare(b[0]));
  const now = new Date();
  const filtered = entries.filter(([k]) => { const d = new Date(k); return range === "week" ? (now - d) < 7*864e5 : range === "month" ? (now - d) < 30*864e5 : true; });
  const feelingData = filtered.filter(([, v]) => v.feeling).map(([k, v]) => ({ d: k, v: FEELING.indexOf(v.feeling) }));
  const gaitData = filtered.filter(([, v]) => v.gaitAnalysis).map(([k, v]) => ({ d: k, v: v.gaitAnalysis.gaitScore }));
  const speechData = filtered.filter(([, v]) => v.speechAnalysis).map(([k, v]) => ({ d: k, v: v.speechAnalysis.speechScore }));

  const MiniChart = ({ data, label, color = "#D4956A" }) => {
    if (data.length < 2) return null;
    const w = Math.max(data.length * 40, 160);
    return (
      <div style={{ background: "#221f1b", borderRadius: 12, padding: "14px 12px", marginBottom: 12, border: "1px solid #2a2420" }}>
        <h4 style={{ fontSize: 12, color: "#8a7e6e", marginBottom: 8 }}>{label}</h4>
        <svg viewBox={`0 0 ${w} 80`} style={{ width: "100%", height: 80 }}>
          {[0,25,50,75,100].map(y => <line key={y} x1="0" y1={70-y*.7} x2={w} y2={70-y*.7} stroke="#2a2420" strokeWidth=".5"/>)}
          <polyline fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
            points={data.map((d, i) => `${i * 40 + 20},${70 - d.v * .7}`).join(" ")}/>
          {data.map((d, i) => <circle key={i} cx={i * 40 + 20} cy={70 - d.v * .7} r="3.5" fill={color}/>)}
        </svg>
      </div>
    );
  };

  return (<div style={S.fade}>
    <h2 style={S.secTitle}>{t.analyzeTitle}</h2>
    <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
      {["week","month","all"].map(r => (
        <button key={r} onClick={() => setRange(r)} style={{ background: range === r ? "#2a2420" : "#221f1b", border: `1px solid ${range === r ? "#D4956A" : "#2a2420"}`, borderRadius: 8, padding: "8px 16px", color: range === r ? "#D4956A" : "#8a7e6e", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>{t[r]}</button>
      ))}
    </div>

    {/* Trend status */}
    <div style={{ background: trends.alerts.length > 0 ? "#3a2020" : "#1e2a1e", borderRadius: 12, padding: "14px 16px", marginBottom: 16, border: `1px solid ${trends.alerts.length > 0 ? "#4a2020" : "#2a3a2a"}` }}>
      <span style={{ fontSize: 14, color: trends.alerts.length > 0 ? "#e8a0a0" : "#a0c8a0", fontWeight: 500 }}>
        {trends.alerts.length > 0 ? `⚠ ${t.trendDeclining}` : `✓ ${t.trendStable}`}
      </span>
    </div>

    {filtered.length < 3 ? (
      <p style={{ textAlign: "center", color: "#5a5045", padding: 40, fontSize: 14 }}>{t.noDataYet}</p>
    ) : (
      <>
        <MiniChart data={feelingData} label={t.overallFeeling} color="#D4956A"/>
        <MiniChart data={gaitData} label={t.gaitScore} color="#5a9aaa"/>
        <MiniChart data={speechData} label={t.speechScore} color="#9a7aaa"/>

        {/* Today's scores */}
        {(today.gaitAnalysis || today.speechAnalysis) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
            {today.gaitAnalysis && (
              <div style={{ background: "#221f1b", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #2a2420" }}>
                <span style={{ fontSize: 32, fontFamily: "'Fraunces', serif", color: today.gaitAnalysis.gaitScore > 70 ? "#5a9a5a" : today.gaitAnalysis.gaitScore > 40 ? "#c9a227" : "#b84c4c" }}>{today.gaitAnalysis.gaitScore}</span>
                <span style={{ display: "block", fontSize: 11, color: "#8a7e6e", marginTop: 4 }}>{t.gaitScore}</span>
              </div>
            )}
            {today.speechAnalysis && (
              <div style={{ background: "#221f1b", borderRadius: 12, padding: 16, textAlign: "center", border: "1px solid #2a2420" }}>
                <span style={{ fontSize: 32, fontFamily: "'Fraunces', serif", color: today.speechAnalysis.speechScore > 70 ? "#5a9a5a" : today.speechAnalysis.speechScore > 40 ? "#c9a227" : "#b84c4c" }}>{today.speechAnalysis.speechScore}</span>
                <span style={{ display: "block", fontSize: 11, color: "#8a7e6e", marginTop: 4 }}>{t.speechScore}</span>
              </div>
            )}
          </div>
        )}
      </>
    )}
  </div>);
}

// ═══════════════════════════════════════════════════════════
//  RESEARCH VIEW
// ═══════════════════════════════════════════════════════════
function ResearchView({ t, allDays, dayCount, dataPoints }) {
  const [exported, setExported] = useState(false);
  const exportAnon = () => {
    const anon = {};
    Object.entries(allDays).forEach(([k, v]) => {
      const { checkinNotes, fallNotes, meds, ...safe } = v;
      anon[k] = { ...safe, date: k };
    });
    const blob = new Blob([JSON.stringify({ version: "2.0", type: "anonymized_msa_data", exportDate: new Date().toISOString(), days: anon }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `msa-research-${dateKey()}.json`; a.click();
    URL.revokeObjectURL(url); setExported(true);
  };

  return (<div style={S.fade}>
    <h2 style={S.secTitle}>{t.researchTitle}</h2>

    {/* Natural History */}
    <div style={{ background: "linear-gradient(135deg, #1e2a1e 0%, #1a2020 100%)", borderRadius: 14, padding: "20px 18px", marginBottom: 16, border: "1px solid #2a3a2a" }}>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "#a0c8a0", marginBottom: 8 }}>{t.naturalHistory}</h3>
      <p style={{ fontSize: 13, color: "#7a9a7a", lineHeight: 1.6, marginBottom: 16 }}>{t.naturalHistoryDesc}</p>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, textAlign: "center", background: "#1a2818", borderRadius: 8, padding: 12 }}>
          <span style={{ fontSize: 28, fontFamily: "'Fraunces', serif", color: "#a0c8a0" }}>{dayCount}</span>
          <span style={{ display: "block", fontSize: 11, color: "#6a8a6a" }}>{t.daysTracked}</span>
        </div>
        <div style={{ flex: 1, textAlign: "center", background: "#1a2818", borderRadius: 8, padding: 12 }}>
          <span style={{ fontSize: 28, fontFamily: "'Fraunces', serif", color: "#a0c8a0" }}>{dataPoints}</span>
          <span style={{ display: "block", fontSize: 11, color: "#6a8a6a" }}>{t.dataPoints}</span>
        </div>
      </div>
    </div>

    {/* Contribute */}
    <div style={{ background: "#221f1b", borderRadius: 14, padding: "20px 18px", marginBottom: 16, border: "1px solid #2a2420" }}>
      <h3 style={{ fontSize: 16, color: "#e8e0d4", marginBottom: 8, fontWeight: 600 }}>{t.contributeData}</h3>
      <p style={{ fontSize: 13, color: "#8a7e6e", lineHeight: 1.6, marginBottom: 12 }}>{t.contributeDesc}</p>
      <p style={{ fontSize: 12, color: "#5a9a5a", marginBottom: 16 }}>🔒 {t.anonymized}</p>
      <button onClick={exportAnon} style={S.primaryBtn}>{exported ? t.contributed : t.contributeBtn}</button>
    </div>

    {/* Clinical Trials */}
    <div style={{ background: "#221f1b", borderRadius: 14, padding: "20px 18px", border: "1px solid #2a2420" }}>
      <h3 style={{ fontSize: 16, color: "#e8e0d4", marginBottom: 8, fontWeight: 600 }}>{t.trialsTitle}</h3>
      <p style={{ fontSize: 13, color: "#8a7e6e", lineHeight: 1.6, marginBottom: 16 }}>{t.trialsDesc}</p>
      {[
        { name: "MASCOT (Amlenetug)", url: "https://clinicaltrials.gov/search?cond=Multiple+System+Atrophy&intr=amlenetug" },
        { name: "TOPAS-MSA (Emrusolmin)", url: "https://clinicaltrials.gov/search?cond=Multiple+System+Atrophy&intr=emrusolmin" },
        { name: "All MSA Trials", url: "https://clinicaltrials.gov/search?cond=Multiple+System+Atrophy&aggFilters=status:rec" },
      ].map((trial, i) => (
        <a key={i} href={trial.url} target="_blank" rel="noopener noreferrer"
          style={{ display: "block", background: "#1a1714", borderRadius: 8, padding: "12px 14px", marginBottom: 6, color: "#D4956A", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
          {trial.name} →
        </a>
      ))}
    </div>
  </div>);
}

// ═══════════════════════════════════════════════════════════
//  PIPELINE VIEW
// ═══════════════════════════════════════════════════════════
function PipelineView({ t }) {
  const phaseColors = { 1: "#5a7aaa", 2: "#c9a227", 3: "#5a9a5a" };
  const phaseLabels = { 1: t.phase1, 2: t.phase2, 3: t.phase3 };
  return (<div style={S.fade}>
    <h2 style={S.secTitle}>{t.pipelineTitle}</h2>
    <p style={{ fontSize: 14, color: "#8a7e6e", lineHeight: 1.6, marginBottom: 20 }}>{t.pipelineDesc}</p>

    {/* Phase bar visualization */}
    <div style={{ display: "flex", gap: 4, marginBottom: 24, padding: "0 4px" }}>
      {[1,2,3].map(phase => {
        const count = PIPELINE.filter(p => p.phase === phase).length;
        return (
          <div key={phase} style={{ flex: count, textAlign: "center" }}>
            <div style={{ background: phaseColors[phase], borderRadius: 6, padding: "6px 0", marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#1a1714" }}>{phaseLabels[phase]}</span>
            </div>
            <span style={{ fontSize: 11, color: "#6a6055" }}>{count} drugs</span>
          </div>
        );
      })}
    </div>

    {/* Drug cards */}
    {PIPELINE.map((drug, i) => (
      <div key={i} style={{ background: "#221f1b", borderRadius: 14, padding: "16px 18px", marginBottom: 10, border: `1px solid ${i === 0 ? "#3a5a3a" : "#2a2420"}`, borderLeft: `3px solid ${phaseColors[drug.phase]}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: "#e8e0d4" }}>{drug.name}</h3>
            <p style={{ fontSize: 12, color: "#8a7e6e" }}>{drug.co}</p>
          </div>
          <span style={{ background: phaseColors[drug.phase], borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#1a1714" }}>
            {phaseLabels[drug.phase]}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#D4956A", marginBottom: 4 }}>{drug.mech}</p>
        <p style={{ fontSize: 12, color: "#8a7e6e", lineHeight: 1.5, marginBottom: 4 }}>{drug.note}</p>
        <p style={{ fontSize: 11, color: "#6a6055" }}>{t.resultsExpected}: {drug.results}</p>
        {i === 0 && <span style={{ fontSize: 10, background: "#2a3a2a", color: "#7a9a7a", padding: "2px 8px", borderRadius: 4, marginTop: 6, display: "inline-block" }}>{t.mostAdvanced}</span>}
      </div>
    ))}
  </div>);
}

// ═══════════════════════════════════════════════════════════
//  SETTINGS VIEW
// ═══════════════════════════════════════════════════════════
function SettingsView({ t, lang, changeLang, allDays, setShowReset }) {
  const exportCSV = () => {
    const hdrs = ["date","feeling",...SYMPTOM_KEYS.map(k=>`symptom_${k}`),"falls","nearFalls","bp_readings","walk_duration","gait_score","voice_duration","speech_score","notes"];
    const rows = Object.entries(allDays).sort((a,b)=>a[0].localeCompare(b[0])).map(([d,v]) => [
      d, v.feeling||"",...SYMPTOM_KEYS.map(k=>v.symptoms?.[k]!==undefined?SEVERITY[v.symptoms[k]]:""), v.falls??"", v.nearFalls??"",
      v.bp?.map(r=>`${r.position}:${r.systolic}/${r.diastolic}`).join(";")||"", v.walkTest?.duration??"", v.gaitAnalysis?.gaitScore??"",
      v.voiceTest?.duration??"", v.speechAnalysis?.speechScore??"", v.checkinNotes||""
    ].map(x=>`"${x}"`).join(","));
    const csv = [hdrs.join(","),...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `msa-compass-${dateKey()}.csv`; a.click(); URL.revokeObjectURL(url);
  };
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(allDays, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `msa-compass-${dateKey()}.json`; a.click(); URL.revokeObjectURL(url);
  };

  return (<div style={S.fade}>
    <h2 style={S.secTitle}>{t.settings}</h2>
    <div style={{ padding: "16px 0", borderBottom: "1px solid #2a2420" }}>
      <span style={{ fontSize: 15, color: "#c0b8a8", display: "block", marginBottom: 8 }}>{t.language}</span>
      <div style={{ display: "flex", gap: 6 }}>
        {Object.entries(LANGS).map(([k, v]) => (
          <button key={k} onClick={() => changeLang(k)} style={{ flex: 1, background: lang === k ? "#2a2420" : "#221f1b", border: `1.5px solid ${lang === k ? "#D4956A" : "#2a2420"}`, borderRadius: 8, padding: "10px 8px", color: lang === k ? "#D4956A" : "#8a7e6e", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>{v}</button>
        ))}
      </div>
    </div>
    <div style={{ padding: "16px 0", borderBottom: "1px solid #2a2420" }}>
      <span style={{ fontSize: 15, color: "#c0b8a8", display: "block", marginBottom: 8 }}>{t.exportData}</span>
      <p style={{ fontSize: 13, color: "#8a7e6e", marginBottom: 12 }}>{t.exportDesc}</p>
      <button onClick={exportCSV} style={{ ...S.primaryBtn, marginBottom: 8 }}>{t.exportCSV}</button>
      <button onClick={exportJSON} style={{ ...S.primaryBtn, background: "transparent", border: "1.5px solid #D4956A", color: "#D4956A" }}>{t.exportJSON}</button>
    </div>
    <div style={{ background: "#221f1b", borderRadius: 14, padding: "20px 18px", marginTop: 20, border: "1px solid #2a2420" }}>
      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 18, marginBottom: 10 }}>{t.about}</h3>
      <p style={{ fontSize: 14, color: "#8a7e6e", lineHeight: 1.6, marginBottom: 12 }}>{t.aboutText}</p>
      <p style={{ fontSize: 12, color: "#5a5045" }}>{t.version}</p>
    </div>
    <button onClick={() => setShowReset(true)} style={{ width: "100%", background: "transparent", border: "1.5px solid #4a2020", borderRadius: 12, padding: 14, color: "#b84c4c", fontSize: 14, fontWeight: 500, cursor: "pointer", marginTop: 20 }}>{t.resetData}</button>
  </div>);
}

// ═══════════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,300&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{background:#1a1714}
input,textarea,button,select{font-family:'DM Sans',sans-serif}
input[type=number]::-webkit-inner-spin-button{opacity:1}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
`;

const S = {
  app: { fontFamily: "'DM Sans',sans-serif", background: "#1a1714", color: "#e8e0d4", minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" },
  loadWrap: { display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#1a1714" },
  spinner: { animation: "pulse 1.5s ease infinite" },
  fade: { animation: "fadeUp .35s ease" },
  header: { padding: "14px 16px 8px", borderBottom: "1px solid #2a2420" },
  hInner: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  title: { fontFamily: "'Fraunces',serif", fontSize: 20, fontWeight: 400, letterSpacing: "-.5px" },
  tagline: { fontSize: 10, color: "#6a6055", letterSpacing: "1px", textTransform: "uppercase" },
  langSel: { background: "#2a2420", border: "1px solid #3a3530", color: "#D4956A", fontSize: 12, padding: "6px 8px", borderRadius: 6, cursor: "pointer", outline: "none" },
  nav: { display: "flex", borderBottom: "1px solid #2a2420", overflowX: "auto" },
  navBtn: { flex: "1 0 auto", background: "none", border: "none", color: "#5a5045", padding: "10px 6px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 1, borderBottom: "2px solid transparent", transition: "all .2s", minWidth: 54 },
  navAct: { color: "#D4956A", borderBottom: "2px solid #D4956A" },
  navIco: { fontSize: 14 },
  navLbl: { fontSize: 9, fontWeight: 500, letterSpacing: ".3px" },
  main: { flex: 1, padding: "16px 16px 80px", overflow: "auto" },
  secTitle: { fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 400, marginBottom: 16 },
  greetCard: { background: "linear-gradient(135deg,#2a2420 0%,#1e1b17 100%)", borderRadius: 14, padding: "20px 18px 14px", marginBottom: 16, border: "1px solid #332e28" },
  greetText: { fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 300 },
  dateText: { fontSize: 12, color: "#8a7e6e", marginTop: 3 },
  progBar: { height: 3, background: "#2a2420", borderRadius: 2, marginTop: 14, overflow: "hidden" },
  progFill: { height: "100%", background: "linear-gradient(90deg,#D4956A,#e0b88a)", borderRadius: 2, transition: "width .5s ease" },
  progText: { fontSize: 11, color: "#8a7e6e", marginTop: 4, textAlign: "right" },
  alertCard: { display: "flex", alignItems: "center", gap: 12, background: "#3a2020", borderRadius: 12, padding: "14px 16px", marginBottom: 16, border: "1px solid #4a2020" },
  alertDot: { width: 10, height: 10, borderRadius: "50%", background: "#e87070", animation: "pulse 2s ease infinite", flexShrink: 0 },
  alertTitle: { fontSize: 14, fontWeight: 600, color: "#e8a0a0" },
  alertDesc: { fontSize: 12, color: "#a08080" },
  statsRow: { display: "flex", gap: 10, marginBottom: 16 },
  stat: { flex: 1, background: "#221f1b", border: "1px solid #2a2420", borderRadius: 10, padding: "14px 12px", textAlign: "center", display: "flex", flexDirection: "column", gap: 2 },
  statN: { fontSize: 26, fontFamily: "'Fraunces',serif", fontWeight: 300, color: "#D4956A" },
  statL: { fontSize: 11, color: "#8a7e6e" },
  hopeCard: { background: "linear-gradient(135deg,#2a2820 0%,#1e2018 100%)", borderRadius: 14, padding: "18px 18px", marginBottom: 16, border: "1px solid #2a3028", textAlign: "center" },
  hopeQuote: { fontFamily: "'Fraunces',serif", fontSize: 18, fontStyle: "italic", color: "#D4956A", marginBottom: 10 },
  hopeTitle: { fontSize: 14, fontWeight: 600, color: "#c0b8a8", marginBottom: 4 },
  hopeDesc: { fontSize: 12, color: "#8a7e6e" },
  modGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  modCard: { background: "#221f1b", border: "1px solid #2a2420", borderRadius: 12, padding: "16px 14px", textAlign: "left", cursor: "pointer", transition: "all .2s", display: "flex", flexDirection: "column", gap: 4 },
  modDone: { borderColor: "#3a5a3a", background: "#1e2a1e" },
  modTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  modIco: { fontSize: 20, color: "#D4956A" },
  check: { fontSize: 13, color: "#5a9a5a", fontWeight: 600 },
  modTitle: { fontSize: 13, fontWeight: 600 },
  modDesc: { fontSize: 11, color: "#8a7e6e", lineHeight: 1.3 },
  back: { background: "none", border: "none", color: "#D4956A", fontSize: 14, cursor: "pointer", padding: "2px 0 10px", fontWeight: 500 },
  mHead: { display: "flex", alignItems: "center", gap: 10, marginBottom: 18 },
  bIco: { fontSize: 32, color: "#D4956A" },
  mTitle: { fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 400 },
  q: { fontSize: 14, color: "#b0a898", marginBottom: 14 },
  fGrid: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 18 },
  fBtn: { display: "flex", alignItems: "center", gap: 10, background: "#221f1b", border: "1.5px solid #2a2420", borderRadius: 10, padding: "12px 14px", cursor: "pointer", transition: "all .2s" },
  fAct: { borderColor: "#D4956A", background: "#2a2420" },
  fLbl: { fontSize: 14, color: "#e8e0d4" },
  ig: { marginBottom: 18 },
  iLbl: { display: "block", fontSize: 12, color: "#8a7e6e", marginBottom: 4 },
  ta: { width: "100%", background: "#221f1b", border: "1px solid #2a2420", borderRadius: 8, padding: "10px 12px", color: "#e8e0d4", fontSize: 14, resize: "vertical", outline: "none" },
  inp: { background: "#221f1b", border: "1px solid #2a2420", borderRadius: 8, padding: "10px 10px", color: "#e8e0d4", fontSize: 13, outline: "none" },
  instr: { fontSize: 13, color: "#8a7e6e", lineHeight: 1.5, marginBottom: 16 },
  passage: { background: "#221f1b", borderLeft: "3px solid #D4956A", borderRadius: "0 10px 10px 0", padding: "14px 16px", fontSize: 14, fontStyle: "italic", lineHeight: 1.6, color: "#c0b8a8", marginBottom: 20 },
  primaryBtn: { width: "100%", background: "#D4956A", color: "#1a1714", border: "none", borderRadius: 10, padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all .2s" },
  stopBtn: { width: "100%", background: "#b84c4c", color: "#fff", border: "none", borderRadius: 10, padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  savedMsg: { textAlign: "center", color: "#5a9a5a", fontSize: 14, fontWeight: 500, padding: 14 },
  cBtn: { width: 38, height: 38, borderRadius: "50%", background: "#2a2420", border: "1px solid #3a3530", color: "#D4956A", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  footer: { padding: "10px 16px", textAlign: "center", borderTop: "1px solid #2a2420" },
  footTxt: { fontSize: 10, color: "#4a4540" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 },
  modal: { background: "#221f1b", borderRadius: 14, padding: "22px 18px", maxWidth: 320, width: "100%", border: "1px solid #3a3530" },
  modalTxt: { fontSize: 14, color: "#c0b8a8", lineHeight: 1.5, marginBottom: 18 },
  modalBtns: { display: "flex", gap: 8 },
  cancelBtn: { flex: 1, background: "#2a2420", border: "1px solid #3a3530", borderRadius: 8, padding: 12, color: "#8a7e6e", fontSize: 13, cursor: "pointer" },
  dangerBtn: { flex: 1, background: "#5a2020", border: "none", borderRadius: 8, padding: 12, color: "#e8b0b0", fontSize: 13, cursor: "pointer", fontWeight: 600 },
};
