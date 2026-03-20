(function stitchUiSimulationApp() {
  const SIMULATION_PROGRESS = ["landing", "worklist", "emr", "record", "confirm", "followup", "feedback"];
  const HISTORY_SEED = [
    {
      id: "attempt-01",
      label: "Practice Run 01",
      dateLabel: "2026-03-12 19:10",
      note: "First full attempt",
      score: 84,
      duration: "2분 16초",
      focus: "Pending tasks and electrolyte follow-up were too vague."
    },
    {
      id: "attempt-02",
      label: "Practice Run 02",
      dateLabel: "2026-03-15 07:40",
      note: "Improved prioritization",
      score: 90,
      duration: "2분 02초",
      focus: "Respiratory and renal priorities were clearer, but safety language was still broad."
    },
    {
      id: "attempt-03",
      label: "Practice Run 03",
      dateLabel: "2026-03-17 21:05",
      note: "Pre-brief shift rehearsal",
      score: 93,
      duration: "1분 54초",
      focus: "Needed tighter explanation of antibiotic reassessment and discharge hold."
    }
  ];
  const THEME_STORAGE_KEY = "digital-clinician-theme";
  const LOCALE_STORAGE_KEY = "digital-clinician-locale";
  const DEFAULT_SELECTION = { wardType: "general", department: "internal" };
  const WARD_OPTIONS = [
    {
      id: "general",
      icon: "bed",
      label: { ko: "일반 병동", en: "General Ward" },
      description: {
        ko: "표준 병동 인수인계 흐름과 다직종 조율에 집중합니다.",
        en: "Focuses on standard inpatient handoff flow and cross-team coordination."
      }
    },
    {
      id: "icu",
      icon: "monitor_heart",
      label: { ko: "중환자실", en: "ICU" },
      description: {
        ko: "고위험 감시와 즉시 에스컬레이션 관점을 강조합니다.",
        en: "Emphasizes high-acuity monitoring and rapid escalation."
      }
    }
  ];
  const DEPARTMENT_OPTIONS = [
    { id: "internal", icon: "local_hospital", label: { ko: "내과", en: "Internal Medicine" } },
    { id: "surgery", icon: "medical_services", label: { ko: "외과", en: "Surgery" } },
    { id: "orthopedics", icon: "orthopedics", label: { ko: "정형외과", en: "Orthopedics" } },
    { id: "neurosurgery", icon: "neurology", label: { ko: "신경외과", en: "Neurosurgery" } },
    { id: "pediatrics", icon: "child_care", label: { ko: "소아과", en: "Pediatrics" } }
  ];
  const COPY = {
    ko: {
      handoffTitle: "간호 인수인계",
      searchPrompt: "환자 기록 검색...",
      startSimulation: "시뮬레이션 시작",
      openChart: "차트 보기",
      selectorKicker: "Simulation Setup",
      selectorTitle: "병동 및 진료과 선택",
      selectorSubtitle: "시뮬레이션 시작 전, 현재 세션에 적용할 병동 유형과 진료과를 선택하세요.",
      selectorStatusLabel: "Current configuration",
      selectorStatusCopy: "선택값은 대시보드와 시뮬레이션 세션에 즉시 반영됩니다.",
      selectorWardEyebrow: "Ward Type",
      selectorWardTitle: "병동 유형 선택",
      selectorWardHint: "Choose one",
      selectorDeptEyebrow: "Department",
      selectorDeptTitle: "진료과 선택",
      selectorDeptHint: "Required",
      selectorSummaryTitle: "Selection Summary",
      selectorMetricCase: "Current case",
      selectorMetricOxygen: "Current oxygen",
      selectorMetricPending: "Pending tasks",
      selectorNote: "현재 MVP는 단일 텔레메트리 환자 케이스를 유지하면서 UI와 세션 컨텍스트만 업데이트합니다.",
      selectorFooterSelection: "선택된 구성",
      selectorFooterStatus: "세션 상태",
      selectorFooterReady: "대시보드 진입 준비 완료",
      enterDashboard: "대시보드 입장",
      selected: "선택됨",
      choose: "선택",
      landingLabel: "랜딩",
      dashboardLabel: "대시보드",
      worklistLabel: "환자 명단",
      unitSetupLabel: "병동 선택",
      resetSessionLabel: "세션 초기화",
      themeLabel: "테마",
      languageLabel: "언어",
      themeLight: "밝음",
      themeDark: "어두움",
      languageKo: "KR",
      languageEn: "EN"
    },
    en: {
      handoffTitle: "Nursing Handoff",
      searchPrompt: "Search patient records...",
      startSimulation: "Start Simulation",
      openChart: "Open Chart",
      selectorKicker: "Simulation Setup",
      selectorTitle: "Choose Unit and Department",
      selectorSubtitle: "Before you start, select the ward type and department context for this session.",
      selectorStatusLabel: "Current configuration",
      selectorStatusCopy: "Selections are applied immediately to the dashboard and session framing.",
      selectorWardEyebrow: "Ward Type",
      selectorWardTitle: "Select Ward Type",
      selectorWardHint: "Choose one",
      selectorDeptEyebrow: "Department",
      selectorDeptTitle: "Select Department",
      selectorDeptHint: "Required",
      selectorSummaryTitle: "Selection Summary",
      selectorMetricCase: "Current case",
      selectorMetricOxygen: "Current oxygen",
      selectorMetricPending: "Pending tasks",
      selectorNote: "This MVP keeps the single telemetry case while updating the UI context for the selected care area.",
      selectorFooterSelection: "Selected setup",
      selectorFooterStatus: "Session status",
      selectorFooterReady: "Ready to enter dashboard",
      enterDashboard: "Enter Dashboard",
      selected: "Selected",
      choose: "Choose",
      landingLabel: "Landing",
      dashboardLabel: "Dashboard",
      worklistLabel: "Worklist",
      unitSetupLabel: "Unit Setup",
      resetSessionLabel: "Reset session",
      themeLabel: "Theme",
      languageLabel: "Language",
      themeLight: "Light",
      themeDark: "Dark",
      languageKo: "KR",
      languageEn: "EN"
    }
  };

  const app = {
    scenario: null,
    analysis: null,
    config: {
      openaiConfigured: false,
      transcriptionProvider: "browser-or-manual",
      qaMode: false
    },
    state: {
      step: "landing",
      theme: "light",
      locale: "ko",
      selection: Object.assign({}, DEFAULT_SELECTION),
      selectedDate: "",
      emrTab: "overview",
      prepNotes: "",
      handoffTranscript: "",
      recordingStatus: "idle",
      recordingMessage: "Review the chart, identify the unstable problems, and organize the handoff before you start speaking.",
      followUp: { opening: "", questions: [], answers: [] },
      answerDraft: "",
      feedback: null,
      sessionHistory: seedHistory(),
      lastHistoryId: null
    },
    media: {
      recorder: null,
      chunks: [],
      stream: null,
      recognition: null,
      browserTranscript: "",
      mode: "handoff"
    }
  };

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    app.scenario = window.HANDOFF_SIM_DATA.getScenario();
    loadPreferences();
    applyPreferences();
    app.state.selectedDate = app.scenario.patient.currentDate;
    app.config.qaMode = window.location.hostname === "localhost" || window.location.search.includes("qa=1");
    document.addEventListener("click", onClick);
    document.addEventListener("input", onInput);
    fetchConfig()
      .catch(function () { return null; })
      .finally(function () {
        buildAnalysis();
        render();
      });
  }

  function seedHistory() {
    return HISTORY_SEED.map(function clone(entry) {
      return Object.assign({}, entry);
    });
  }

  async function fetchConfig() {
    const response = await fetch(api("/api/simulation"));
    if (!response.ok) return;
    const payload = await response.json();
    app.config.openaiConfigured = Boolean(payload.openaiConfigured);
    app.config.transcriptionProvider = payload.transcriptionProvider || "browser-or-manual";
    app.config.qaMode = Boolean(payload.qaMode) || app.config.qaMode;
  }

  function loadPreferences() {
    app.state.theme = readPreference(THEME_STORAGE_KEY, ["light", "dark"], "light");
    app.state.locale = readPreference(LOCALE_STORAGE_KEY, ["ko", "en"], "ko");
  }

  function readPreference(key, allowedValues, fallback) {
    try {
      const value = window.localStorage.getItem(key);
      return allowedValues.includes(value) ? value : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function persistPreference(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return null;
    }
    return value;
  }

  function applyPreferences() {
    const isDark = app.state.theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.classList.toggle("light", !isDark);
    document.documentElement.lang = app.state.locale;
    if (document.body) {
      document.body.classList.toggle("theme-dark", isDark);
    }
  }

  function setTheme(theme) {
    if (!["light", "dark"].includes(theme) || app.state.theme === theme) return;
    app.state.theme = theme;
    persistPreference(THEME_STORAGE_KEY, theme);
    applyPreferences();
    render();
  }

  function setLocale(locale) {
    if (!["ko", "en"].includes(locale) || app.state.locale === locale) return;
    app.state.locale = locale;
    persistPreference(LOCALE_STORAGE_KEY, locale);
    applyPreferences();
    render();
  }

  function api(path) {
    const base = window.AI_HANDOFF_RUNTIME_CONFIG && window.AI_HANDOFF_RUNTIME_CONFIG.apiBase
      ? String(window.AI_HANDOFF_RUNTIME_CONFIG.apiBase).replace(/\/$/, "")
      : "";
    return base ? base + path : path;
  }

  function buildAnalysis() {
    if (!window.handoffAppApi || typeof window.handoffAppApi.buildHandoffAnalysis !== "function") return;
    app.analysis = window.handoffAppApi.buildHandoffAnalysis(app.scenario.patient, timelineDates());
  }

  function timelineDates() {
    return window.HANDOFF_SIM_DATA.getTimelineDates();
  }

  function currentDay() {
    return app.scenario.patient.dailyData[app.state.selectedDate];
  }

  function latestShift() {
    return app.scenario.shiftHistory[app.scenario.shiftHistory.length - 1];
  }

  function t(key) {
    const pack = COPY[app.state.locale] || COPY.ko;
    return pack[key] || COPY.ko[key] || key;
  }

  function optionLabel(options, selectedId) {
    const match = options.find(function findOption(option) {
      return option.id === selectedId;
    }) || options[0];
    return match.label[app.state.locale] || match.label.ko;
  }

  function selectionData() {
    const wardLabel = optionLabel(WARD_OPTIONS, app.state.selection.wardType);
    const departmentLabel = optionLabel(DEPARTMENT_OPTIONS, app.state.selection.department);
    return {
      wardType: app.state.selection.wardType,
      department: app.state.selection.department,
      wardLabel: wardLabel,
      departmentLabel: departmentLabel,
      summary: wardLabel + " / " + departmentLabel,
      wardOptions: WARD_OPTIONS.map(function mapWard(option) {
        return {
          id: option.id,
          icon: option.icon,
          label: option.label[app.state.locale] || option.label.ko,
          description: option.description[app.state.locale] || option.description.ko,
          selectedLabel: t("selected"),
          chooseLabel: t("choose")
        };
      }),
      departmentOptions: DEPARTMENT_OPTIONS.map(function mapDepartment(option) {
        return {
          id: option.id,
          icon: option.icon,
          label: option.label[app.state.locale] || option.label.ko
        };
      })
    };
  }

  function resolveStep(step) {
    if (step === "briefing") return "dashboard";
    return step;
  }

  function isSimulationStep(step) {
    return ["emr", "record", "confirm", "followup"].includes(step);
  }

  function currentSessionStatus() {
    if (app.state.feedback) {
      return {
        label: "Completed",
        body: "A structured report is available and this attempt has been scored."
      };
    }
    if (isSimulationStep(app.state.step)) {
      return {
        label: "In Progress",
        body: "The active case is open and the handoff session is underway."
      };
    }
    return {
      label: "Ready",
      body: "The case is queued for a new handoff attempt."
    };
  }

  function latestHistoryEntry() {
    const history = app.state.sessionHistory;
    return history.length ? history[history.length - 1] : null;
  }

  function formatDateLabel(value) {
    const parts = String(value || "").split("-");
    if (parts.length === 3) return parts[1] + "." + parts[2];
    return String(value || "");
  }

  function getDashboardMetrics() {
    const history = app.state.sessionHistory;
    const latest = latestHistoryEntry();
    const completionPercent = app.state.feedback
      ? 100
      : isSimulationStep(app.state.step)
        ? 56
        : app.state.handoffTranscript
          ? 42
          : 18;
    return {
      completionPercent: completionPercent,
      latestScoreLabel: latest ? latest.score + "/100" : "--",
      completedCount: history.length,
      bestScore: history.reduce(function max(maxValue, item) {
        return Math.max(maxValue, Number(item.score || 0));
      }, 0)
    };
  }

  function getRecordsMetrics() {
    const history = app.state.sessionHistory;
    const totalRuns = history.length;
    const averageScore = totalRuns
      ? Math.round(history.reduce(function sum(total, item) { return total + Number(item.score || 0); }, 0) / totalRuns)
      : 0;
    const bestScore = history.reduce(function max(maxValue, item) {
      return Math.max(maxValue, Number(item.score || 0));
    }, 0);
    const focusAreas = app.state.feedback
      ? []
          .concat(app.state.feedback.criticalOmissions || [])
          .concat(app.state.feedback.missingInformation || [])
          .slice(0, 3)
      : [
          "Lead with oxygen need, renal trend, and fall risk before lower-priority detail.",
          "Tie medication changes directly to why discharge is delayed.",
          "State concrete next-shift tasks, not just what already happened."
        ];

    return {
      totalRuns: totalRuns,
      averageScore: averageScore,
      bestScore: bestScore,
      focusAreas: focusAreas.length ? focusAreas : ["No active gaps. Keep reinforcing concise prioritization."]
    };
  }

  function getRecordsChart() {
    return app.state.sessionHistory.map(function toBar(entry, index, list) {
      return {
        label: "Run " + (index + 1),
        score: entry.score,
        height: Math.max(24, Math.min(100, Number(entry.score || 0))),
        highlight: index === list.length - 1
      };
    });
  }

  function getWorklistCards() {
    const day = currentDay();
    const latest = latestHistoryEntry();
    const status = currentSessionStatus().label;
    return [
      {
        name: app.scenario.patient.name,
        room: app.scenario.patient.room,
        meta: app.scenario.patient.gender + " / " + app.scenario.patient.age + "Y",
        idLine: "#" + app.scenario.patient.mrn,
        summary: day.nursingProblem,
        bp: day.vital.bp,
        hr: String(day.vital.hr) + " bpm",
        spo2: String(day.vital.spo2) + "%",
        status: status,
        image: (window.StitchUi && window.StitchUi.assets && window.StitchUi.assets.patientPortrait) || "",
        primaryAction: {
          action: "goto",
          target: status === "Completed" ? "feedback" : "emr",
          icon: status === "Completed" ? "visibility" : "play_arrow",
          label: status === "Completed" ? "결과 보기" : "시작"
        },
        secondaryAction: {
          action: "goto",
          target: "emr",
          label: "EMR 조회"
        }
      },
      {
        name: app.scenario.patient.name,
        room: "Current Session",
        meta: "Simulation Flow",
        idLine: "Step " + simulationProgress(app.state.step).index + " / " + simulationProgress(app.state.step).count,
        summary: status === "In Progress"
          ? "The handoff session is open. Continue recording, transcript review, or follow-up."
          : "Use the same case to rehearse another handoff attempt with the current chart state.",
        bp: day.vital.bp,
        hr: String(day.vital.hr) + " bpm",
        spo2: String(day.vital.spo2) + "%",
        status: status === "Completed" ? "In Progress" : status,
        image: (window.StitchUi && window.StitchUi.assets && window.StitchUi.assets.worklistPatientB) || "",
        emphasis: "border-l-4 border-primary",
        primaryAction: {
          action: "goto",
          target: status === "In Progress" ? app.state.step : "record",
          icon: status === "In Progress" ? "resume" : "mic",
          label: status === "In Progress" ? "계속" : "인계 시작"
        },
        secondaryAction: {
          action: "goto",
          target: "confirm",
          label: "기록 확인"
        }
      },
      {
        name: app.scenario.patient.name,
        room: "Last Report",
        meta: "Most recent scored attempt",
        idLine: latest ? latest.dateLabel : "No report yet",
        summary: latest
          ? latest.focus
          : "A completed attempt will appear here once the feedback report is generated.",
        bp: latest ? latest.score + "/100" : "--",
        hr: latest ? latest.duration : "--",
        spo2: latest ? "Ready" : "--",
        status: "Completed",
        image: (window.StitchUi && window.StitchUi.assets && window.StitchUi.assets.worklistPatientC) || "",
        imageTone: latest ? "grayscale" : "",
        primaryAction: {
          action: "goto",
          target: app.state.feedback ? "feedback" : "records",
          icon: app.state.feedback ? "visibility" : "school",
          label: app.state.feedback ? "결과" : "기록"
        },
        secondaryAction: {
          action: "goto",
          target: "records",
          label: "리포트"
        }
      }
    ];
  }

  function render() {
    const root = document.getElementById("appRoot");
    if (!root) return;

    const ui = window.StitchUi || {};
    const step = resolveStep(app.state.step);
    const vm = viewModel(step);

    if (step === "landing" && typeof ui.landingView === "function") {
      root.innerHTML = ui.landingView(vm);
    } else if (step === "selector" && typeof ui.selectorView === "function") {
      root.innerHTML = ui.selectorView(vm);
    } else if (step === "dashboard" && typeof ui.dashboardView === "function") {
      root.innerHTML = ui.dashboardView(vm);
    } else if (step === "worklist" && typeof ui.worklistView === "function") {
      root.innerHTML = ui.worklistView(vm);
    } else if (step === "records" && typeof ui.recordsView === "function") {
      root.innerHTML = ui.recordsView(vm);
    } else if (step === "feedback" && typeof ui.feedbackView === "function") {
      root.innerHTML = ui.feedbackView(vm);
    } else if (typeof ui.simulationView === "function") {
      root.innerHTML = ui.simulationView(vm);
    } else {
      root.innerHTML = "";
    }

    if (step === "landing") {
      root.insertAdjacentHTML("beforeend", renderGlobalControls(vm));
    }
    decorateRenderedView(step, root);

    syncHooks();
  }

  function renderGlobalControls(vm) {
    return `<div class="global-dock" aria-label="Display controls">
      <div class="global-dock__group">
        <span class="global-dock__label">${vm.e(vm.t("themeLabel"))}</span>
        <button type="button" class="global-dock__option ${vm.theme === "light" ? "is-active" : ""}" data-action="set-theme" data-theme="light">${vm.e(vm.t("themeLight"))}</button>
        <button type="button" class="global-dock__option ${vm.theme === "dark" ? "is-active" : ""}" data-action="set-theme" data-theme="dark">${vm.e(vm.t("themeDark"))}</button>
      </div>
      <div class="global-dock__group">
        <span class="global-dock__label">${vm.e(vm.t("languageLabel"))}</span>
        <button type="button" class="global-dock__option ${vm.locale === "ko" ? "is-active" : ""}" data-action="set-locale" data-locale="ko">${vm.e(vm.t("languageKo"))}</button>
        <button type="button" class="global-dock__option ${vm.locale === "en" ? "is-active" : ""}" data-action="set-locale" data-locale="en">${vm.e(vm.t("languageEn"))}</button>
      </div>
    </div>`;
  }

  function decorateRenderedView(step, root) {
    if (step === "landing") {
      decorateLanding(root);
    }
  }

  function decorateLanding(root) {
    const copy = app.state.locale === "en"
      ? {
          navCta: "Start Simulation",
          heroTitle: "Hear the signal,\nHand off the change.",
          heroBody: "Review a realistic inpatient chart, deliver a spoken nursing handoff, respond to focused receiver questions, and get structured AI feedback in one continuous training loop.",
          heroCta: "Open Unit Setup",
          processTitle: "Training flow",
          processBody: "Chart review, verbal handoff, AI follow-up, and final report are connected as one premium simulation loop."
        }
      : {
          navCta: "시뮬레이션 시작",
          heroTitle: "변화를 포착하고,\n우선순위로 인계하세요.",
          heroBody: "실제 EMR 흐름과 유사한 다일자 차트를 검토하고, 음성 간호 인수인계를 수행한 뒤, AI 수신자 질문과 구조화된 피드백까지 한 번에 경험합니다.",
          heroCta: "병동 선택으로 이동",
          processTitle: "학습 프로세스",
          processBody: "차트 검토, 음성 인계, AI 후속 질문, 최종 리포트가 하나의 연속된 시뮬레이션으로 이어집니다."
        };

    const navButton = root.querySelector("nav button[data-action='goto'][data-target='dashboard']");
    if (navButton && !navButton.closest(".qa-shell")) {
      navButton.textContent = copy.navCta;
    }

    const heroTitle = root.querySelector("main > section:first-of-type h1");
    if (heroTitle) {
      const parts = copy.heroTitle.split("\n");
      heroTitle.innerHTML = parts.map(escapeHtml).join("<br>");
    }

    const heroBody = root.querySelector("main > section:first-of-type p.text-lg");
    if (heroBody) heroBody.textContent = copy.heroBody;

    const heroButton = root.querySelector("main > section:first-of-type button[data-action='goto'][data-target='dashboard']");
    if (heroButton) heroButton.textContent = copy.heroCta;

    const processTitle = root.querySelector("main > section:nth-of-type(2) h2");
    if (processTitle) processTitle.textContent = copy.processTitle;

    const processBody = root.querySelector("main > section:nth-of-type(2) .text-on-surface-variant.max-w-2xl");
    if (processBody) processBody.textContent = copy.processBody;
  }

  function simulationProgress(step) {
    const current = resolveStep(step);
    const index = Math.max(0, SIMULATION_PROGRESS.indexOf(current));
    return {
      index: index >= 0 ? index + 1 : 1,
      count: SIMULATION_PROGRESS.length
    };
  }

  function viewModel(step) {
    const current = currentDay();
    const meta = recordingMeta();
    const progress = simulationProgress(step);
    const dashboardMetrics = getDashboardMetrics();
    const recordsMetrics = getRecordsMetrics();
    const selection = selectionData();

    return {
      e: escapeHtml,
      t: t,
      step: step,
      stepLabel: stepLabel(step),
      stepIndex: progress.index,
      stepCount: progress.count,
      theme: app.state.theme,
      locale: app.state.locale,
      patient: app.scenario.patient,
      scenario: app.scenario,
      day: current,
      latestShift: latestShift(),
      selection: selection,
      selector: selection,
      selectedDate: app.state.selectedDate,
      dates: timelineDates(),
      emrTab: app.state.emrTab,
      qaMode: app.config.qaMode,
      openAiText: app.config.openaiConfigured
        ? (app.state.locale === "en" ? "OpenAI ready" : "OpenAI 연결됨")
        : (app.state.locale === "en" ? "Fallback mode" : "기본 모드"),
      analysisSummary: analysisSummary(current),
      recordingStatus: app.state.recordingStatus,
      recordingMessage: app.state.recordingMessage,
      recordingPulse: meta.pulse,
      statusLabel: meta.label,
      statusTone: meta.tone,
      transcript: app.state.handoffTranscript,
      prepNotes: app.state.prepNotes,
      followUp: app.state.followUp,
      answerDraft: app.state.answerDraft,
      receiverName: app.scenario.receiverName,
      receiverRole: app.scenario.receiverRole,
      feedback: app.state.feedback || buildPlaceholderFeedback(),
      reportAvailable: Boolean(app.state.feedback),
      duration: durationLabel(),
      delta: formatDelta,
      shortDate: formatDateLabel,
      waveBars: waveBars(meta.pulse),
      meterPercent: microphoneMeterPercent(),
      meterBars: meterBars(microphoneMeterPercent()),
      footerControls: footerControls(step),
      sessionStatus: currentSessionStatus(),
      dashboardMetrics: dashboardMetrics,
      worklistCards: getWorklistCards(),
      sessionHistory: app.state.sessionHistory.slice().reverse(),
      recordsMetrics: recordsMetrics,
      recordsChart: getRecordsChart()
    };
  }

  function buildPlaceholderFeedback() {
    const latest = latestHistoryEntry();
    return {
      overallScore: latest ? latest.score : 0,
      categoryScores: {
        completeness: latest ? latest.score : 0,
        prioritization: latest ? Math.max(0, latest.score - 2) : 0,
        clarity: latest ? Math.max(0, latest.score - 4) : 0,
        organization: latest ? Math.max(0, latest.score - 3) : 0,
        safety: latest ? Math.max(0, latest.score - 1) : 0
      },
      strengths: ["Current report will appear here after the first completed attempt."],
      missingInformation: ["No active report generated yet."],
      criticalOmissions: [],
      prioritizationProblems: [],
      communicationClarity: "No live feedback available yet.",
      clinicalOrganization: "No live feedback available yet.",
      safetyIssuesMissed: [],
      improvedHandoff: app.scenario.exemplarHandoff,
      anticipatedFollowUpQuestions: [],
      progressDelta: 0
    };
  }

  function analysisSummary(current) {
    if (app.analysis && app.analysis.longitudinalSummary && app.analysis.longitudinalSummary.conciseSummary) {
      const summary = app.analysis.longitudinalSummary.conciseSummary;
      if (!/summary unavailable/i.test(summary)) return summary;
    }
    return current.providerUpdate;
  }

  function recordingMeta() {
    if (app.state.recordingStatus === "recording") {
      return { label: "Recording", tone: "text-red-600", pulse: true };
    }
    if (app.state.recordingStatus === "processing") {
      return { label: "Processing", tone: "text-blue-700", pulse: false };
    }
    if (app.state.recordingStatus === "ready") {
      return { label: "Transcript Ready", tone: "text-emerald-700", pulse: false };
    }
    return { label: "Ready", tone: "text-slate-500", pulse: false };
  }

  function waveBars(active) {
    const colors = active
      ? ["bg-blue-400", "bg-blue-400", "bg-blue-300", "bg-blue-500", "bg-blue-400", "bg-blue-300", "bg-blue-400", "bg-blue-500", "bg-blue-300", "bg-blue-400"]
      : ["bg-slate-400", "bg-slate-400", "bg-slate-300", "bg-slate-500", "bg-slate-400", "bg-slate-300", "bg-slate-400", "bg-slate-500", "bg-slate-300", "bg-slate-400"];
    const heights = [12, 24, 18, 32, 20, 28, 14, 26, 18, 10];
    return colors.map(function renderBar(color, index) {
      return `<div class="${active ? "wave-bar" : ""} w-1 ${color} rounded-full" style="animation-delay:${(index + 1) / 10}s;height:${heights[index]}px;"></div>`;
    }).join("");
  }

  function microphoneMeterPercent() {
    if (app.state.recordingStatus === "recording") return 62;
    if (app.state.recordingStatus === "processing") return 44;
    return 28;
  }

  function meterBars(percent) {
    return Array.from({ length: 6 }, function (_, index) {
      const filled = (index + 1) * 16 <= percent;
      const tone = index < 3 ? "bg-green-400" : index === 3 ? "bg-yellow-400" : "bg-slate-200";
      return `<div class="h-full ${filled ? tone : "bg-slate-200"} w-1/6"></div>`;
    }).join("");
  }

  function footerControls(step) {
    if (step === "emr") {
      return `<div class="flex gap-2">
        <button class="w-10 h-10 flex items-center justify-center border-2 border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-action="goto" data-target="worklist"><span class="material-symbols-outlined text-xl">arrow_back</span></button>
      </div>
      <button class="flex-1 bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg" data-action="goto" data-target="record"><span class="material-symbols-outlined">play_circle</span>핸드오프 시작</button>`;
    }

    if (step === "record") {
      const primary = app.state.recordingStatus === "recording"
        ? `<button class="flex-1 bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg" data-action="stop-recording"><span class="material-symbols-outlined">stop</span>녹음 중지</button>`
        : `<button class="flex-1 bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg" data-action="start-recording"><span class="material-symbols-outlined">mic_external_on</span>인수인계 녹음</button>`;
      const review = app.state.handoffTranscript
        ? `<button class="flex-1 bg-slate-900 text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg" data-action="goto" data-target="confirm"><span class="material-symbols-outlined">check</span>전사 확인</button>`
        : "";
      return `<div class="flex gap-2">
        <button class="w-10 h-10 flex items-center justify-center border-2 border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-action="goto" data-target="emr"><span class="material-symbols-outlined text-xl">arrow_back</span></button>
        ${app.config.qaMode ? `<button class="w-10 h-10 flex items-center justify-center border-2 border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-action="load-demo-transcript"><span class="material-symbols-outlined text-xl">smart_toy</span></button>` : ""}
      </div>${primary}${review}`;
    }

    if (step === "confirm") {
      return `<div class="flex gap-2">
        <button class="w-10 h-10 flex items-center justify-center border-2 border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-action="goto" data-target="record"><span class="material-symbols-outlined text-xl">arrow_back</span></button>
        ${app.config.qaMode ? `<button class="w-10 h-10 flex items-center justify-center border-2 border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-action="load-demo-transcript"><span class="material-symbols-outlined text-xl">smart_toy</span></button>` : ""}
      </div>
      <button class="flex-1 bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg" data-action="start-followup"><span class="material-symbols-outlined">auto_fix_high</span>AI receiver 전달</button>`;
    }

    const next = app.state.followUp.questions[app.state.followUp.answers.length];
    if (!next) {
      return `<div class="flex gap-2">
        <button class="w-10 h-10 flex items-center justify-center border-2 border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-action="goto" data-target="confirm"><span class="material-symbols-outlined text-xl">arrow_back</span></button>
      </div>
      <button class="flex-1 bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg" data-action="finish-followup"><span class="material-symbols-outlined">assignment_turned_in</span>최종 피드백 생성</button>`;
    }

    const record = app.state.recordingStatus === "recording"
      ? `<button class="flex-1 bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg" data-action="stop-answer-recording"><span class="material-symbols-outlined">stop</span>응답 중지</button>`
      : `<button class="flex-1 bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 transition-all shadow-lg" data-action="start-answer-recording"><span class="material-symbols-outlined">mic_external_on</span>응답 녹음</button>`;

    return `<div class="flex gap-2">
      <button class="w-10 h-10 flex items-center justify-center border-2 border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-action="goto" data-target="confirm"><span class="material-symbols-outlined text-xl">arrow_back</span></button>
      ${app.config.qaMode ? `<button class="w-10 h-10 flex items-center justify-center border-2 border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-all shadow-sm" data-action="load-demo-answer"><span class="material-symbols-outlined text-xl">smart_toy</span></button>` : ""}
    </div>${record}<button class="flex-1 bg-slate-900 text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg" data-action="submit-followup-answer"><span class="material-symbols-outlined">check</span>답변 저장</button>`;
  }

  function onClick(event) {
    const node = event.target.closest("[data-action]");
    if (!node) return;

    const action = node.getAttribute("data-action");
    if (action === "goto") {
      const target = node.getAttribute("data-target");
      const icon = node.querySelector(".material-symbols-outlined");
      const iconName = icon ? icon.textContent.trim() : "";
      if (target === "landing" && iconName === "restart_alt") return restartSimulation();
      if (target === "dashboard" && app.state.step === "landing" && !node.closest(".qa-shell")) {
        return setStep("selector");
      }
      return setStep(target);
    }
    if (action === "set-theme") return setTheme(node.getAttribute("data-theme"));
    if (action === "set-locale") return setLocale(node.getAttribute("data-locale"));
    if (action === "select-ward") {
      app.state.selection.wardType = node.getAttribute("data-ward") || app.state.selection.wardType;
      return render();
    }
    if (action === "select-department") {
      app.state.selection.department = node.getAttribute("data-department") || app.state.selection.department;
      return render();
    }
    if (action === "select-date") {
      app.state.selectedDate = node.getAttribute("data-date");
      return render();
    }
    if (action === "select-tab") {
      app.state.emrTab = node.getAttribute("data-tab");
      return render();
    }
    if (action === "start-recording") return startRecording("handoff");
    if (action === "stop-recording") return stopRecording();
    if (action === "load-demo-transcript") {
      app.state.handoffTranscript = app.scenario.demo.initialTranscript;
      app.state.recordingStatus = "ready";
      app.state.recordingMessage = "A demo transcript was loaded for review.";
      showToast("Demo transcript loaded.", "success");
      return setStep("confirm");
    }
    if (action === "start-followup") return createFollowUp();
    if (action === "start-answer-recording") return startRecording("followup");
    if (action === "stop-answer-recording") return stopRecording();
    if (action === "submit-followup-answer") return saveFollowUpAnswer();
    if (action === "finish-followup") return createFeedback();
    if (action === "load-demo-answer") {
      const next = app.state.followUp.questions[app.state.followUp.answers.length];
      if (!next) return;
      app.state.answerDraft = app.scenario.demo.followUpAnswers[next.id] || "My priority is oxygenation, renal labs, and fall prevention before discharge planning resumes.";
      return render();
    }
    if (action === "run-demo-session") return runDemo();
    if (action === "retry-session") return retrySession();
    if (action === "restart-app") return restartSimulation();
  }

  function onInput(event) {
    if (event.target.id === "prepNotesInput") app.state.prepNotes = event.target.value;
    if (event.target.id === "handoffTranscriptInput") app.state.handoffTranscript = event.target.value;
    if (event.target.id === "followupAnswerInput") app.state.answerDraft = event.target.value;
  }

  function setStep(step) {
    const nextStep = resolveStep(step);
    app.state.step = nextStep;
    if (nextStep === "record" && app.state.recordingStatus === "idle") {
      app.state.recordingMessage = "Review the chart, then speak the handoff in SBAR order with the unstable issues first.";
    }
    if (typeof window.scrollTo === "function") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    render();
  }

  async function startRecording(mode) {
    app.media.mode = mode;
    app.media.browserTranscript = "";
    app.state.recordingStatus = "recording";
    app.state.recordingMessage = mode === "handoff"
      ? "Recording handoff. Lead with the unstable problems, then name what the next nurse must watch."
      : "Recording follow-up answer. Respond directly to the receiver's question.";
    render();

    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      app.media.recognition = new Recognition();
      app.media.recognition.continuous = true;
      app.media.recognition.interimResults = true;
      app.media.recognition.onresult = function onResult(resultEvent) {
        app.media.browserTranscript = Array.from(resultEvent.results).map(function (result) {
          return result[0].transcript;
        }).join(" ").trim();
      };
      app.media.recognition.start();
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Media devices unavailable");
      }

      app.media.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      app.media.chunks = [];
      app.media.recorder = new MediaRecorder(app.media.stream);
      app.media.recorder.ondataavailable = function onData(chunkEvent) {
        if (chunkEvent.data.size) app.media.chunks.push(chunkEvent.data);
      };
      app.media.recorder.start();
    } catch (error) {
      if (app.media.recognition) app.media.recognition.stop();
      app.state.recordingStatus = "ready";
      app.state.recordingMessage = "Microphone access is unavailable. Use manual transcript editing or the QA demo path.";
      showToast("Microphone unavailable. Falling back to manual entry.", "error");
      render();
    }
  }

  async function stopRecording() {
    app.state.recordingStatus = "processing";
    app.state.recordingMessage = "Processing the transcript...";
    render();

    if (app.media.recognition) app.media.recognition.stop();

    const audioBlob = await new Promise(function (resolve) {
      if (!app.media.recorder) return resolve(null);
      app.media.recorder.onstop = function onStop() {
        resolve(new Blob(app.media.chunks, { type: app.media.recorder.mimeType || "audio/webm" }));
      };
      app.media.recorder.stop();
    });

    if (app.media.stream) {
      app.media.stream.getTracks().forEach(function (track) { track.stop(); });
    }

    const base64Audio = audioBlob ? await blobToDataUrl(audioBlob) : "";
    let transcript = app.media.browserTranscript;

    try {
      const payload = await postAction("transcribe", {
        audioBase64: base64Audio,
        mimeType: audioBlob && audioBlob.type,
        fileName: app.media.mode === "handoff" ? "handoff.webm" : "followup.webm",
        browserTranscript: app.media.browserTranscript
      });
      transcript = payload && payload.transcript ? payload.transcript : app.media.browserTranscript;
    } catch (error) {
      console.error(error);
      showToast("Server transcription failed. Using browser or manual fallback.", "error");
    }

    app.state.recordingStatus = "ready";
    app.state.recordingMessage = transcript
      ? "Transcript ready for review."
      : "No transcript was captured. Manual editing is required.";

    showToast(
      transcript ? "Transcript ready for review." : "No transcript captured. Manual edit required.",
      transcript ? "success" : "error"
    );

    if (app.media.mode === "handoff") {
      app.state.handoffTranscript = transcript;
      return setStep("confirm");
    }

    app.state.answerDraft = transcript;
    render();
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve) {
      const reader = new FileReader();
      reader.onloadend = function () { resolve(reader.result || ""); };
      reader.readAsDataURL(blob);
    });
  }

  async function createFollowUp() {
    try {
      const payload = await postAction("followup", { transcript: app.state.handoffTranscript });
      app.state.followUp.opening = payload.opening || "";
      app.state.followUp.questions = payload.questions || [];
      app.state.followUp.answers = [];
      app.state.answerDraft = "";
      showToast("Receiver follow-up questions are ready.", "success");
      setStep("followup");
    } catch (error) {
      console.error(error);
      showToast("Unable to generate follow-up questions right now.", "error");
    }
  }

  function saveFollowUpAnswer() {
    const next = app.state.followUp.questions[app.state.followUp.answers.length];
    if (!next || !app.state.answerDraft.trim()) return;

    app.state.followUp.answers.push({
      id: next.id,
      question: next.question,
      answer: app.state.answerDraft.trim()
    });
    app.state.answerDraft = "";
    app.state.recordingStatus = "idle";
    app.state.recordingMessage = "Ready for the next follow-up question.";
    showToast("Follow-up answer saved.", "success");
    render();
  }

  async function createFeedback() {
    try {
      const payload = await postAction("feedback", {
        transcript: app.state.handoffTranscript,
        followUpResponses: app.state.followUp.answers
      });
      app.state.feedback = payload;
      recordFeedbackHistory(payload);
      showToast("Structured feedback generated.", "success");
      setStep("feedback");
    } catch (error) {
      console.error(error);
      showToast("Unable to generate feedback right now.", "error");
    }
  }

  function recordFeedbackHistory(payload) {
    if (!payload) return;
    const entryId = "attempt-live-" + Date.now();
    app.state.lastHistoryId = entryId;
    app.state.sessionHistory.push({
      id: entryId,
      label: "Current Attempt",
      dateLabel: new Date().toISOString().slice(0, 16).replace("T", " "),
      note: "Latest scored run",
      score: payload.overallScore,
      duration: durationLabel(),
      focus: (payload.criticalOmissions && payload.criticalOmissions[0])
        || (payload.missingInformation && payload.missingInformation[0])
        || "Maintain the same clarity and prioritization on the next replay."
    });
  }

  async function postAction(action, payload) {
    const response = await fetch(api("/api/simulation"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ action: action }, payload || {}))
    });
    if (!response.ok) {
      throw new Error("Simulation API failed with " + response.status);
    }
    return response.json();
  }

  function retrySession() {
    app.state.handoffTranscript = "";
    app.state.recordingStatus = "idle";
    app.state.recordingMessage = "Review the chart, identify the unstable problems, and organize the handoff before you start speaking.";
    app.state.followUp = { opening: "", questions: [], answers: [] };
    app.state.answerDraft = "";
    app.state.feedback = null;
    setStep("emr");
  }

  function restartSimulation() {
    app.state.selectedDate = app.scenario.patient.currentDate;
    app.state.emrTab = "overview";
    app.state.prepNotes = "";
    app.state.handoffTranscript = "";
    app.state.recordingStatus = "idle";
    app.state.recordingMessage = "Review the chart, identify the unstable problems, and organize the handoff before you start speaking.";
    app.state.followUp = { opening: "", questions: [], answers: [] };
    app.state.answerDraft = "";
    app.state.feedback = null;
    setStep("landing");
  }

  function runDemo() {
    const answers = app.scenario.demo.followUpAnswers;
    app.state.handoffTranscript = app.scenario.demo.initialTranscript;
    app.state.followUp.opening = "I heard the initial handoff. Clarify the unstable priorities before I take the patient.";
    app.state.followUp.questions = window.HANDOFF_SIM_EVAL.pickFollowUpQuestions(app.state.handoffTranscript, app.scenario, 3).questions;
    app.state.followUp.answers = [];
    app.state.feedback = null;

    const sequence = [
      function () { setStep("dashboard"); },
      function () { setStep("worklist"); },
      function () { setStep("emr"); },
      function () { setStep("confirm"); },
      function () {
        setStep("followup");
        app.state.followUp.answers = [{
          id: app.state.followUp.questions[0].id,
          answer: answers[app.state.followUp.questions[0].id] || "Demo answer"
        }];
        render();
      },
      function () {
        app.state.followUp.answers = app.state.followUp.questions.slice(0, 2).map(function (question) {
          return {
            id: question.id,
            answer: answers[question.id] || "Demo answer"
          };
        });
        render();
      },
      function () {
        app.state.followUp.answers = app.state.followUp.questions.map(function (question) {
          return {
            id: question.id,
            answer: answers[question.id] || "Demo answer"
          };
        });
        render();
      },
      function () {
        const feedback = window.HANDOFF_SIM_EVAL.buildFeedback(app.state.handoffTranscript, app.state.followUp.answers, app.scenario);
        app.state.feedback = feedback;
        recordFeedbackHistory(feedback);
        setStep("feedback");
      }
    ];

    sequence.forEach(function (run, index) {
      window.setTimeout(run, index * 700);
    });
  }

  function showToast(message, tone) {
    const element = document.getElementById("appToast");
    if (!element || !message) return;

    element.textContent = message;
    element.className = "app-toast";
    if (tone === "error") element.classList.add("is-error");
    if (tone === "success") element.classList.add("is-success");

    window.clearTimeout(showToast.timerId);
    window.requestAnimationFrame(function () {
      element.classList.add("show");
    });
    showToast.timerId = window.setTimeout(function () {
      element.classList.remove("show");
    }, 2800);
  }

  function syncHooks() {
    window.render_game_to_text = function renderGameToText() {
      return JSON.stringify({
        step: app.state.step,
        theme: app.state.theme,
        locale: app.state.locale,
        selection: selectionData().summary,
        selectedDate: app.state.selectedDate,
        emrTab: app.state.emrTab,
        recordingStatus: app.state.recordingStatus,
        transcriptReady: Boolean(app.state.handoffTranscript),
        followupQuestions: app.state.followUp.questions.length,
        followupAnswers: app.state.followUp.answers.length,
        feedbackReady: Boolean(app.state.feedback),
        historyCount: app.state.sessionHistory.length
      });
    };

    window.advanceTime = function advanceTime(ms) {
      return new Promise(function (resolve) {
        window.setTimeout(resolve, Math.min(ms, 50));
      });
    };
  }

  function stepLabel(step) {
    return {
      landing: "랜딩",
      dashboard: "대시보드",
      worklist: "환자 명단",
      emr: "EMR 검토",
      record: "음성 인계",
      confirm: "전사 확인",
      followup: "AI 후속 질문",
      feedback: "결과 리포트",
      records: "학습 기록"
    }[step] || step;
  }

  function formatDelta(value) {
    const numeric = Number(value || 0);
    return (numeric >= 0 ? "+" : "") + numeric + "%";
  }

  function stepLabel(step) {
    const labels = {
      ko: {
        landing: "랜딩",
        selector: "병동 선택",
        dashboard: "대시보드",
        worklist: "환자 명단",
        emr: "EMR 검토",
        record: "음성 인계",
        confirm: "전사 확인",
        followup: "AI 후속 질문",
        feedback: "결과 리포트",
        records: "학습 기록"
      },
      en: {
        landing: "Landing",
        selector: "Unit Setup",
        dashboard: "Dashboard",
        worklist: "Worklist",
        emr: "EMR Review",
        record: "Handoff",
        confirm: "Transcript",
        followup: "AI Follow-up",
        feedback: "Feedback",
        records: "Records"
      }
    };
    const localeLabels = labels[app.state.locale] || labels.ko;
    return localeLabels[step] || step;
  }

  function durationLabel() {
    const fullText = [app.state.handoffTranscript]
      .concat(app.state.followUp.answers.map(function (item) { return item.answer; }))
      .join(" ")
      .trim();

    if (!fullText) return "0분 00초";
    const words = fullText.split(/\s+/).filter(Boolean).length;
    const seconds = Math.max(60, Math.round((words / 130) * 60));
    const minutesPart = Math.floor(seconds / 60);
    const secondsPart = String(seconds % 60).padStart(2, "0");
    return minutesPart + "분 " + secondsPart + "초";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
