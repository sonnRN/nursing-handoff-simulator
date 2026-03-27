(function initStitchUiSelector(root) {
  const ui = root.StitchUi || (root.StitchUi = {});

  function railButton(icon, target, active, label, e) {
    const tone = active
      ? "selector-rail__button selector-rail__button--active"
      : "selector-rail__button";
    return `<button type="button" class="${tone}" data-action="goto" data-target="${target}" aria-label="${e(label)}">
      <span class="material-symbols-outlined">${e(icon)}</span>
    </button>`;
  }

  function wardCard(option, selected, e) {
    return `<button
      type="button"
      class="selector-choice ${selected ? "selector-choice--active" : ""}"
      data-action="select-ward"
      data-ward="${option.id}"
    >
      <div class="selector-choice__badge">
        <span class="material-symbols-outlined">${e(option.icon)}</span>
      </div>
      <div class="selector-choice__title">${e(option.label)}</div>
      <div class="selector-choice__subtitle">${e(option.description)}</div>
    </button>`;
  }

  function departmentButton(option, selected, e) {
    return `<button
      type="button"
      class="selector-dept ${selected ? "selector-dept--active" : ""}"
      data-action="select-department"
      data-department="${option.id}"
    >
      <span class="material-symbols-outlined text-[16px]">${e(option.icon)}</span>
      <span>${e(option.label)}</span>
    </button>`;
  }

  ui.selectorView = function selectorView(vm) {
    const e = vm.e;
    const departmentSection = vm.selector.departmentVisible
      ? `<section class="selector-section">
          <div class="selector-section__label">${e(vm.t("selectorDeptTitle"))}</div>
          <div class="selector-dept-grid">
            ${vm.selector.departmentOptions.map(function (option) {
              return departmentButton(option, option.id === vm.selector.department, e);
            }).join("")}
          </div>
        </section>`
      : "";
    return `<div class="selector-screen screen-fade">
      <aside class="selector-rail hidden md:flex">
        <div class="selector-rail__brand">
          <div class="selector-rail__logo">D</div>
        </div>
        <div class="selector-rail__nav">
          ${railButton("home", "landing", false, vm.t("landingLabel"), e)}
          ${railButton("dashboard", "dashboard", false, vm.t("dashboardLabel"), e)}
          ${railButton("apartment", "selector", true, vm.t("unitSetupLabel"), e)}
          ${railButton("person_search", "worklist", false, vm.t("worklistLabel"), e)}
        </div>
        <div class="selector-rail__footer">
          <button type="button" class="selector-rail__button" data-action="restart-app" aria-label="${e(vm.t("resetSessionLabel"))}">
            <span class="material-symbols-outlined">restart_alt</span>
          </button>
        </div>
      </aside>

      <main class="selector-stage">
        <div class="selector-topbar">
          <div class="selector-topbar__icons">
            <span class="material-symbols-outlined">notifications</span>
            <span class="material-symbols-outlined">${vm.theme === "dark" ? "dark_mode" : "light_mode"}</span>
            <span class="material-symbols-outlined">account_circle</span>
          </div>
        </div>

        <div class="selector-panel">
          <header class="selector-header">
            <h1>${e(vm.t("selectorTitle"))}</h1>
            <p>${e(vm.t("selectorSubtitle"))}</p>
          </header>

          <section class="selector-section">
            <div class="selector-section__label">${e(vm.t("selectorWardTitle"))}</div>
            <div class="selector-ward-grid">
              ${vm.selector.wardOptions.map(function (option) {
                return wardCard(option, option.id === vm.selector.wardType, e);
              }).join("")}
            </div>
          </section>

          ${departmentSection}

          <footer class="selector-footer">
            <div class="selector-footer__meta">
              <div class="selector-footer__block">
                <span>${e(vm.t("selectorFooterSelection"))}</span>
                <strong>${e(vm.selection.summary)}</strong>
              </div>
              <div class="selector-footer__block selector-footer__block--right">
                <span>${e(vm.t("selectorFooterStatus"))}</span>
                <strong>${e(vm.t("selectorFooterReady"))}</strong>
              </div>
            </div>
            <button type="button" class="selector-enter ${vm.selector.ready ? "" : "selector-enter--disabled"}" data-action="goto" data-target="dashboard" ${vm.selector.ready ? "" : "aria-disabled=\"true\""}>
              <span>${e(vm.t("enterDashboard"))}</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </footer>
        </div>
      </main>
    </div>`;
  };
})(typeof globalThis !== "undefined" ? globalThis : this);
