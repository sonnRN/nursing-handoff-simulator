(function initStitchUiAdmin(root) {
  const ui = root.StitchUi || (root.StitchUi = {});
  const assets = ui.assets || (ui.assets = {});

  Object.assign(assets, {
    worklistPatientA: "https://lh3.googleusercontent.com/aida-public/AB6AXuCj2Z4jTX2TYU6NpqOZWEKIUyUxj50FtWzkwmhzsh_sO3VulscWMYOfaoTYpOSjAtKbsOYRkmiwnpTfF0PtCEhFXNYfpFibsd7kSsFuFlCwCTyGG1bsFmawviMNFMqKqqfSIpL4wHdqojaKeyJqraDTLMUHBZA_Ret7xz3OZbAUh-Xb8vB9JUGUL0VsA8pUUqYiknMitZrggs36SGy4t1COWe9PDBS7gbF1xTElUsDDKmczuayB2nxXVS_VLdXIQLk-BVuUCFh9auzl",
    worklistPatientB: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdrOWLIxsPzp7DGW_NK6ugyTA2o0GXuZrhaGnQbibDlBD7zab7YQ5pqoZRVj2Ipx5jYvuQ3wNdMmh0xrcwEN5qvDXY2EeZLhfoqfL9U1EEtHoepxgwS7_I0_3wSEIRpZhclew547wYlyXt7R1FD7l60ZesO1zAGldwc62h4M4AdSaexM07SvfjXWmNGDkY153QgXN4v6YO2jDVSccFAyYucf1N28zbO3qILpAKYU54Fr_W63GOWC30h1F3wJDtnCO6mOUNMHQidiny",
    worklistPatientC: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjN9I3oCgiGlUiwMmKy9HY8lvbJcfGQWPYqY0pVCCm1uYMFu47ioLUNqJFp94uNtQrJ0iXczggl4M57JJ7DmRHirWRmzd5Ki_1q5GLlApg-cV-6763fbZ04NQngqJeO3dvepj54oEr1IZBByK6ixXOuz7eDY1ZWXdIH4eIGX1Uuw07crYQSPfQJwlUx20t8rDeHlSa8_cGBpSE0dLzEanLmMNRnArE7m6B3aYs1qexj4a1GV96Dnc92MaVQL6_jct14w_Vw9cGK4dJ",
    worklistPatientD: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLRlnZG9cZwml4S-b2kmgGkHT9kuK7AXP5rCiE0mwOCrMFoeTwYVn7AR6p9Ye3DQ2LFdJf3ezmPGkrS-jWFn7WuXS33hRE6VPtL5gh3O6pYJmPichU50gTLWdRpKE7wwficF7ZfED-LPkT_k1oCoyKu9TmEJnqnKUo3cQW-2p-I54i3E0S2ip0KSeD9vnsbSwVRiFhXoe-iYMhGg0DYkzcI_1bZockGJg8eQaZ9dHP2JNl2fg129agHmFQj9QgbNg95a-uBt1WQWQo"
  });

  function qa(vm) {
    if (!vm.qaMode) return "";
    return `<div class="qa-shell"><div class="qa-panel bg-white border border-slate-200 shadow-ambient rounded-2xl p-4">
      <p class="text-[11px] font-bold uppercase tracking-[0.24em] text-primary mb-3">QA tools</p>
      <div class="grid grid-cols-2 gap-2">
        <button class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors" data-action="run-demo-session">Run demo</button>
        <button class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors" data-action="goto" data-target="dashboard">Dashboard</button>
        <button class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors" data-action="goto" data-target="worklist">Worklist</button>
        <button class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors" data-action="goto" data-target="emr">EMR</button>
        <button class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors" data-action="goto" data-target="records">Records</button>
        <button class="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors" data-action="goto" data-target="feedback">Report</button>
      </div>
    </div>
    <div class="qa-fab"><button type="button" class="qa-trigger rounded-full bg-primary text-white px-4 py-2 text-xs font-bold shadow-ambient">QA MODE</button></div></div>`;
  }

  function topBar(vm, placeholder) {
    const e = vm.e;
    return `<header class="fixed top-0 right-0 left-0 md:left-64 z-50 bg-white/70 backdrop-blur-xl shadow-sm flex justify-between items-center px-6 py-3">
      <div class="flex items-center gap-4 flex-1">
        <div class="relative w-full max-w-md">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
          <input class="w-full bg-surface-container-high border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/40 placeholder:text-slate-500 font-label" placeholder="${e(placeholder)}" type="text"/>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <button class="p-2 text-slate-500 hover:bg-slate-100/50 rounded-full transition-colors"><span class="material-symbols-outlined">notifications</span></button>
        <button class="p-2 text-slate-500 hover:bg-slate-100/50 rounded-full transition-colors"><span class="material-symbols-outlined">settings</span></button>
        <div class="flex items-center gap-3 pl-4 border-l border-slate-200 ml-2">
          <div class="text-right hidden sm:block">
            <p class="text-xs font-bold text-on-surface">${e(vm.receiverName)}</p>
            <p class="text-[10px] text-on-surface-variant font-label">${e(vm.receiverRole)}</p>
          </div>
          <img alt="Nurse Profile" class="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed" src="${assets.clinicianAvatar || assets.emrAvatar}">
        </div>
      </div>
    </header>`;
  }

  function sideNav(active, e) {
    function item(icon, label, target, isActive) {
      const classes = isActive
        ? "flex items-center gap-3 px-4 py-3 text-blue-700 font-bold bg-blue-50 rounded-lg translate-x-1 transition-transform"
        : "flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-blue-600 transition-colors";
      return `<button class="${classes} w-full text-left" data-action="goto" data-target="${target}">
        <span class="material-symbols-outlined">${icon}</span>
        <span class="text-sm font-sans tracking-normal">${e(label)}</span>
      </button>`;
    }

    return `<aside class="hidden md:flex flex-col w-64 bg-slate-50 p-4 pb-6 space-y-2 shrink-0 fixed inset-y-0 left-0 overflow-y-auto">
      <div class="mb-8 px-4 py-6">
        <h1 class="text-lg font-black text-blue-900 tracking-tighter">Digital Clinician</h1>
        <p class="text-xs text-slate-500 font-medium">${e("4W Telemetry Nursing")}</p>
      </div>
      <nav class="flex-1 space-y-1">
        ${item("dashboard", "대시보드", "dashboard", active === "dashboard")}
        ${item("person_search", "환자 명단", "worklist", active === "worklist")}
        ${item("model_training", "시뮬레이션", "emr", active === "simulation")}
        ${item("school", "학습 기록", "records", active === "records")}
      </nav>
      <div class="mt-auto pt-4 space-y-1 border-t border-slate-200">
        ${item("home", "랜딩", "landing", false)}
        ${item("restart_alt", "세션 초기화", "landing", false)}
      </div>
    </aside>`;
  }

  function metricChip(label, value, tone) {
    return `<div class="rounded-xl border ${tone || "border-slate-200"} bg-white px-4 py-3">
      <p class="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold mb-1">${label}</p>
      <p class="text-xl font-black text-slate-900">${value}</p>
    </div>`;
  }

  function progressBar(value, tone) {
    return `<div class="h-2 rounded-full bg-slate-100 overflow-hidden"><div class="h-full ${tone || "bg-primary"} rounded-full" style="width:${Math.max(6, Math.min(100, value))}%"></div></div>`;
  }

  function statusPill(status) {
    if (status === "In Progress") {
      return `<span class="px-3 py-1.5 rounded-full text-[11px] font-bold bg-primary-fixed text-on-primary-fixed-variant flex items-center gap-1.5 whitespace-nowrap"><span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1;">mic</span>진행 중 (STT)</span>`;
    }
    if (status === "Completed") {
      return `<span class="px-3 py-1.5 rounded-full text-[11px] font-bold bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center gap-1.5 whitespace-nowrap"><span class="material-symbols-outlined text-[14px]" style="font-variation-settings:'FILL' 1;">check_circle</span>완료</span>`;
    }
    return `<span class="px-3 py-1.5 rounded-full text-[11px] font-bold bg-secondary-container text-on-secondary-container flex items-center gap-1.5 whitespace-nowrap"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span>준비 완료</span>`;
  }

  function worklistCard(card, e) {
    return `<div class="bg-surface-container-low rounded-2xl p-4 sm:p-5 hover:bg-surface-container transition-colors group ${card.emphasis || ""}">
      <div class="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div class="flex items-center gap-4 lg:w-[300px] shrink-0">
          <img alt="Patient Avatar" class="w-12 h-12 rounded-full object-cover shrink-0 ${card.imageTone || ""}" src="${card.image}">
          <div class="min-w-0">
            <h3 class="text-lg font-bold text-on-surface leading-tight truncate">${e(card.name)}</h3>
            <div class="flex items-center flex-wrap gap-2 text-xs text-on-surface-variant font-label mt-1">
              <span class="bg-primary-fixed px-2 py-0.5 rounded text-on-primary-fixed-variant font-bold">${e(card.room)}</span>
              <span>${e(card.meta)}</span>
              <span class="hidden sm:inline">${e(card.idLine)}</span>
            </div>
          </div>
        </div>
        <div class="flex-1 lg:min-w-0">
          <p class="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">상태 요약</p>
          <p class="text-sm font-semibold text-on-surface lg:truncate">${e(card.summary)}</p>
        </div>
        <div class="grid grid-cols-3 gap-2 sm:gap-4 lg:w-[260px] bg-surface-container-lowest/50 p-3 rounded-xl shrink-0">
          <div class="text-center"><p class="text-[9px] text-slate-500 font-bold font-label">혈압</p><p class="text-sm font-black text-on-surface font-label">${e(card.bp)}</p></div>
          <div class="text-center"><p class="text-[9px] text-slate-500 font-bold font-label">맥박</p><p class="text-sm font-black ${card.hrTone || "text-primary"} font-label">${e(card.hr)}</p></div>
          <div class="text-center"><p class="text-[9px] text-slate-500 font-bold font-label">SpO2</p><p class="text-sm font-black ${card.spo2Tone || "text-on-surface"} font-label">${e(card.spo2)}</p></div>
        </div>
        <div class="flex flex-col sm:flex-row items-center gap-4 lg:w-[320px] shrink-0 justify-end">
          <div class="w-full sm:w-auto flex justify-center">${statusPill(card.status)}</div>
          <div class="flex gap-2 w-full sm:w-auto">
            ${card.secondaryAction ? `<button class="flex-1 sm:flex-none bg-surface-container-highest text-on-surface-variant px-3 py-2 rounded-lg text-[11px] font-bold hover:bg-slate-200 transition-colors whitespace-nowrap" data-action="${card.secondaryAction.action}" ${card.secondaryAction.target ? `data-target="${card.secondaryAction.target}"` : ""}>${e(card.secondaryAction.label)}</button>` : ""}
            <button class="flex-1 sm:flex-none ${card.primaryAction.tone || "bg-primary text-white"} px-3 py-2 rounded-lg text-[11px] font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap" data-action="${card.primaryAction.action}" ${card.primaryAction.target ? `data-target="${card.primaryAction.target}"` : ""}>
              <span class="material-symbols-outlined text-sm">${e(card.primaryAction.icon)}</span>${e(card.primaryAction.label)}
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }

  ui.dashboardView = function dashboardView(vm) {
    const e = vm.e;
    return `<div class="screen-fade bg-background min-h-screen flex">
      ${sideNav("dashboard", e)}
      <div class="flex-1 flex flex-col min-w-0 md:ml-64">
        ${topBar(vm, "환자 또는 시뮬레이션 검색")}
        <main class="flex-1 overflow-y-auto bg-surface p-6 md:p-10 pt-28 md:pt-32">
          <div class="max-w-7xl mx-auto">
            <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 class="text-3xl font-bold tracking-tight text-on-surface mb-2 font-headline">간호 인수인계 대시보드</h1>
                <p class="text-on-surface-variant font-label max-w-xl">${e(vm.scenario.briefing.objective)}</p>
              </div>
              <button class="flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all active:scale-95" data-action="goto" data-target="worklist">
                <span class="material-symbols-outlined">play_circle</span><span>시뮬레이션 시작</span>
              </button>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div class="lg:col-span-2 group relative bg-surface-container-lowest rounded-xl p-6 transition-all hover:translate-y-[-4px]">
                <div class="absolute top-0 left-0 w-full h-1 bg-primary-fixed rounded-t-xl group-hover:bg-primary transition-colors"></div>
                <div class="flex justify-between items-start mb-6">
                  <div>
                    <span class="text-[0.6875rem] font-bold font-label uppercase tracking-widest text-outline mb-1 block">${e(vm.patient.room)}</span>
                    <h3 class="text-xl font-bold text-on-surface">${e(vm.patient.name)}</h3>
                    <p class="text-sm text-on-surface-variant font-label">${e(vm.patient.age + "세 / " + vm.patient.gender)}</p>
                  </div>
                  <div class="bg-error-container text-on-error-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">고위험</div>
                </div>
                <div class="space-y-4 mb-8">
                  <div class="bg-surface-container-low p-4 rounded-lg">
                    <span class="text-[10px] font-bold text-primary block mb-1 uppercase tracking-tighter">핵심 상황</span>
                    <p class="text-sm text-on-surface leading-relaxed">${e(vm.analysisSummary)}</p>
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    ${metricChip("현재 산소", e(vm.day.handover.vent[0].detail), "border-slate-200")}
                    ${metricChip("미해결 과제", String(vm.day.pendingTasks.length), "border-slate-200")}
                    ${metricChip("안전 리스크", String(vm.day.safetyRisks.length), "border-slate-200")}
                    ${metricChip("최근 점수", vm.dashboardMetrics.latestScoreLabel, "border-slate-200")}
                  </div>
                </div>
                <button class="w-full py-3 bg-surface-container-high hover:bg-primary hover:text-white text-primary font-bold rounded-lg transition-colors flex items-center justify-center gap-2" data-action="goto" data-target="emr">
                  <span class="material-symbols-outlined text-sm">model_training</span><span>EMR 열고 인계 준비</span>
                </button>
              </div>
              <div class="space-y-6">
                <div class="bg-white rounded-xl border border-slate-200 p-6">
                  <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-3">현재 세션</p>
                  <p class="text-2xl font-black text-slate-900 mb-1">${e(vm.sessionStatus.label)}</p>
                  <p class="text-sm text-slate-600 mb-4">${e(vm.sessionStatus.body)}</p>
                  ${progressBar(vm.dashboardMetrics.completionPercent, "bg-primary")}
                </div>
                <div class="bg-white rounded-xl border border-slate-200 p-6">
                  <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-3">다음 간호사에게 남길 것</p>
                  <div class="space-y-3">${vm.day.pendingTasks.slice(0, 3).map(function (task) {
                    return `<div class="flex items-start gap-3 text-sm text-slate-700"><span class="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span><span>${e(task)}</span></div>`;
                  }).join("")}</div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
              <div class="bg-white rounded-2xl border border-slate-200 p-6">
                <div class="flex items-center justify-between mb-6">
                  <div>
                    <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Multi-day evolution</p>
                    <h2 class="text-2xl font-bold mt-2">이번 입원에서 바뀐 핵심 흐름</h2>
                  </div>
                  <button class="rounded-full bg-primary-fixed px-4 py-2 text-sm font-semibold text-on-primary-fixed" data-action="goto" data-target="worklist">환자 명단 보기</button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">${vm.scenario.shiftHistory.map(function (shift, index) {
                  return `<div class="bg-surface rounded-xl border border-slate-200 p-5">
                    <div class="flex items-center gap-3 mb-3">
                      <div class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">${index + 1}</div>
                      <div><p class="text-sm font-bold text-on-surface">${e(shift.label)}</p><p class="text-xs text-on-surface-variant uppercase tracking-wider">Shift summary</p></div>
                    </div>
                    <p class="text-sm leading-relaxed text-on-surface-variant">${e(shift.summary)}</p>
                  </div>`;
                }).join("")}</div>
              </div>
              <div class="bg-white rounded-2xl border border-slate-200 p-6">
                <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-4">학습 포커스</p>
                <div class="space-y-4">${vm.scenario.currentFocusChecklist.map(function (item) {
                  return `<div class="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700 leading-relaxed">${e(item)}</div>`;
                }).join("")}</div>
                <button class="mt-6 w-full rounded-xl bg-slate-900 text-white py-3 font-bold hover:bg-slate-800 transition-colors" data-action="goto" data-target="records">학습 기록 보기</button>
              </div>
            </div>
          </div>
        </main>
        ${qa(vm)}
      </div>
    </div>`;
  };

  ui.worklistView = function worklistView(vm) {
    const e = vm.e;
    return `<div class="screen-fade bg-background min-h-screen flex">
      ${sideNav("worklist", e)}
      <div class="flex-1 flex flex-col min-w-0 md:ml-64">
        ${topBar(vm, "환자 이름 또는 등록번호 검색")}
        <main class="flex-1 pt-28 md:pt-32 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8">
          <div class="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 max-w-[1400px] mx-auto">
            <div>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight mb-1">환자 명단</h2>
              <p class="text-on-surface-variant text-sm font-label">Telemetry handoff practice queue | ${e(vm.patient.admissionDate)}</p>
            </div>
            <div class="flex gap-2">
              <button class="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl text-xs font-bold hover:bg-surface-container-highest transition-colors flex items-center gap-2" data-action="goto" data-target="dashboard">
                <span class="material-symbols-outlined text-sm">dashboard</span>대시보드
              </button>
              <button class="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-colors flex items-center gap-2" data-action="goto" data-target="emr">
                <span class="material-symbols-outlined text-sm">add</span>새 시뮬레이션
              </button>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-4 max-w-[1400px] mx-auto">
            ${vm.worklistCards.map(function (card) { return worklistCard(card, e); }).join("")}
          </div>
        </main>
        ${qa(vm)}
      </div>
    </div>`;
  };

  ui.recordsView = function recordsView(vm) {
    const e = vm.e;
    return `<div class="screen-fade bg-surface font-body text-on-surface antialiased min-h-screen">
      ${sideNav("records", e)}
      <div class="flex flex-col md:ml-64 min-h-screen">
        ${topBar(vm, "기록 또는 모듈 검색")}
        <main class="flex-1 overflow-y-auto bg-surface p-8 pt-28 md:pt-32">
          <div class="max-w-7xl mx-auto mb-10">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 class="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">학습 기록 및 통계</h1>
                <p class="text-on-surface-variant max-w-2xl font-body">동일 시나리오를 반복 수행한 결과를 기준으로 완성도, 우선순위, 안전성의 추이를 봅니다.</p>
              </div>
              <div class="flex gap-3">
                <button class="px-6 py-2.5 bg-primary text-white rounded-full font-label text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2" data-action="goto" data-target="feedback">
                  <span class="material-symbols-outlined text-lg">description</span>최근 리포트 보기
                </button>
              </div>
            </div>
          </div>
          <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
            <div class="md:col-span-8 bg-surface-container-lowest rounded-xl p-8">
              <div class="flex justify-between items-start mb-10">
                <div>
                  <h3 class="text-lg font-bold text-primary mb-1">기술 성장 추이</h3>
                  <p class="text-xs text-on-surface-variant font-label uppercase tracking-widest">최근 수행 점수</p>
                </div>
                <div class="flex gap-4">
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-primary"></span><span class="text-xs font-label text-on-surface-variant">완성도</span></div>
                  <div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-secondary"></span><span class="text-xs font-label text-on-surface-variant">안전성</span></div>
                </div>
              </div>
              <div class="relative h-64 w-full flex items-end justify-between gap-2">
                <div class="absolute inset-0 flex flex-col justify-between">
                  <div class="border-t border-outline-variant/15 w-full h-0"></div>
                  <div class="border-t border-outline-variant/15 w-full h-0"></div>
                  <div class="border-t border-outline-variant/15 w-full h-0"></div>
                  <div class="border-t border-outline-variant/15 w-full h-0"></div>
                </div>
                ${vm.recordsChart.map(function (bar) {
                  return `<div class="flex-1 flex flex-col justify-end group">
                    <div class="w-full ${bar.highlight ? "bg-primary/20" : "bg-primary/10"} rounded-t-lg transition-all ${bar.highlight ? "group-hover:bg-primary/30" : "group-hover:bg-primary/20"} relative" style="height:${bar.height}%">
                      <div class="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>
                      <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">${bar.score}%</div>
                    </div>
                    <span class="text-[10px] font-label text-center mt-3 text-on-surface-variant/60">${e(bar.label)}</span>
                  </div>`;
                }).join("")}
              </div>
            </div>
            <div class="md:col-span-4 space-y-6">
              <div class="bg-surface-container-lowest rounded-xl p-6">
                <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-2">최고 점수</p>
                <p class="text-4xl font-black text-slate-900">${e(String(vm.recordsMetrics.bestScore))}</p>
                <p class="text-sm text-slate-600 mt-2">${e(vm.recordsMetrics.totalRuns + "회 수행")}</p>
              </div>
              <div class="bg-surface-container-lowest rounded-xl p-6">
                <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-2">평균 점수</p>
                <p class="text-4xl font-black text-slate-900">${e(String(vm.recordsMetrics.averageScore))}</p>
                <p class="text-sm text-slate-600 mt-2">최신 리포트 기준 추세 반영</p>
              </div>
              <div class="bg-surface-container-lowest rounded-xl p-6">
                <p class="text-xs font-bold uppercase tracking-[0.22em] text-slate-500 mb-3">다음 보완 포인트</p>
                <div class="space-y-3">${vm.recordsMetrics.focusAreas.map(function (item) {
                  return `<div class="rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-700">${e(item)}</div>`;
                }).join("")}</div>
              </div>
            </div>
            <div class="md:col-span-12 bg-surface-container-lowest rounded-xl p-8">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h3 class="text-lg font-bold text-primary">최근 수행 기록</h3>
                  <p class="text-xs text-on-surface-variant font-label uppercase tracking-widest">Same scenario replay history</p>
                </div>
                <button class="rounded-full bg-surface-container-high px-4 py-2 text-sm font-semibold hover:bg-surface-container-highest transition-colors" data-action="goto" data-target="worklist">새로 시작</button>
              </div>
              <div class="space-y-4">${vm.sessionHistory.map(function (entry) {
                return `<div class="grid grid-cols-1 md:grid-cols-[1.2fr_120px_120px_1fr] gap-4 rounded-2xl border border-slate-200 p-4">
                  <div><p class="text-sm font-bold text-slate-900">${e(entry.label)}</p><p class="text-xs text-slate-500 mt-1">${e(entry.dateLabel)} · ${e(entry.note)}</p></div>
                  <div><p class="text-[10px] uppercase tracking-[0.22em] text-slate-500">Score</p><p class="text-xl font-black text-slate-900">${e(String(entry.score))}</p></div>
                  <div><p class="text-[10px] uppercase tracking-[0.22em] text-slate-500">Duration</p><p class="text-xl font-black text-slate-900">${e(entry.duration)}</p></div>
                  <div><p class="text-[10px] uppercase tracking-[0.22em] text-slate-500">Focus</p><p class="text-sm text-slate-700">${e(entry.focus)}</p></div>
                </div>`;
              }).join("")}</div>
            </div>
          </div>
        </main>
        ${qa(vm)}
      </div>
    </div>`;
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
