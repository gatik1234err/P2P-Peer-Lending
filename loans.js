const LOANS = [
  {
    id: 1,
    name: "Mehta Organics Pvt. Ltd.",
    purpose: "Equipment",
    sector: "Agriculture",
    risk: "low",
    amount: 1500000,
    rate: 11.5,
    term: 24,
    score: 742,
    funded: 68,
    daysLeft: 8,
  },
  {
    id: 2,
    name: "Arjun Tech Solutions",
    purpose: "Working Capital",
    sector: "IT",
    risk: "med",
    amount: 800000,
    rate: 15.0,
    term: 12,
    score: 665,
    funded: 45,
    daysLeft: 14,
  },
  {
    id: 3,
    name: "Sharma Textiles Co.",
    purpose: "Inventory",
    sector: "Retail",
    risk: "med",
    amount: 2200000,
    rate: 16.5,
    term: 18,
    score: 638,
    funded: 82,
    daysLeft: 3,
  },
  {
    id: 4,
    name: "BlueSky Logistics",
    purpose: "Expansion",
    sector: "Logistics",
    risk: "low",
    amount: 3500000,
    rate: 10.8,
    term: 36,
    score: 758,
    funded: 22,
    daysLeft: 21,
  },
  {
    id: 5,
    name: "Naik Foods & Beverages",
    purpose: "Equipment",
    sector: "F&B",
    risk: "high",
    amount: 500000,
    rate: 21.0,
    term: 12,
    score: 591,
    funded: 55,
    daysLeft: 6,
  },
  {
    id: 6,
    name: "KR Constructions Ltd.",
    purpose: "Bridge",
    sector: "Construction",
    risk: "high",
    amount: 4500000,
    rate: 22.5,
    term: 6,
    score: 605,
    funded: 30,
    daysLeft: 18,
  },
  {
    id: 7,
    name: "Pinnacle Healthcare",
    purpose: "Equipment",
    sector: "Healthcare",
    risk: "low",
    amount: 1800000,
    rate: 12.0,
    term: 24,
    score: 731,
    funded: 91,
    daysLeft: 2,
  },
  {
    id: 8,
    name: "Sunrise Agri Exports",
    purpose: "Working Capital",
    sector: "Agriculture",
    risk: "med",
    amount: 950000,
    rate: 14.5,
    term: 12,
    score: 689,
    funded: 60,
    daysLeft: 11,
  },
  {
    id: 9,
    name: "Zephyr EV Solutions",
    purpose: "Expansion",
    sector: "EV / Auto",
    risk: "high",
    amount: 2800000,
    rate: 19.5,
    term: 24,
    score: 610,
    funded: 18,
    daysLeft: 25,
  },
  {
    id: 10,
    name: "Coastal Seafoods Pvt.",
    purpose: "Inventory",
    sector: "F&B",
    risk: "low",
    amount: 1200000,
    rate: 11.0,
    term: 18,
    score: 745,
    funded: 74,
    daysLeft: 7,
  },
  {
    id: 11,
    name: "Nova Apparel Studio",
    purpose: "Working Capital",
    sector: "Retail",
    risk: "med",
    amount: 600000,
    rate: 17.0,
    term: 12,
    score: 655,
    funded: 40,
    daysLeft: 16,
  },
  {
    id: 12,
    name: "GreenWave Solar",
    purpose: "Equipment",
    sector: "Energy",
    risk: "low",
    amount: 5000000,
    rate: 10.5,
    term: 36,
    score: 762,
    funded: 55,
    daysLeft: 20,
  },
];

let activeFilters = {
  risk: "all",
  purpose: "all",
  sort: "newest",
  search: "",
  maxAmount: 5000000,
};
let currentLoans = [...LOANS];

function formatAmount(n) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(1) + "Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  return "₹" + n.toLocaleString("en-IN");
}

function getRiskLabel(r) {
  return { low: "Low Risk", med: "Med Risk", high: "High Risk" }[r];
}

function renderCard(loan) {
  return `
  <div class="loan-card" data-risk="${loan.risk}" data-id="${loan.id}">
    <div class="card-top">
      <div>
        <div class="biz-name">${loan.name}</div>
        <div class="biz-meta">
          <span class="biz-purpose">${loan.purpose}</span>
          <span class="biz-sector">${loan.sector}</span>
        </div>
      </div>
      <span class="risk-badge risk-${loan.risk}">${getRiskLabel(loan.risk)}</span>
    </div>
    <div class="card-middle">
      <div>
        <div class="loan-amount">${formatAmount(loan.amount)}</div>
        <div class="loan-amount-label">Requested</div>
      </div>
      <div class="card-metrics-row">
        <div class="metric">
          <div class="metric-lbl">Interest</div>
          <div class="metric-v">${loan.rate}%</div>
        </div>
        <div class="metric">
          <div class="metric-lbl">Term</div>
          <div class="metric-v">${loan.term} mo</div>
        </div>
        <div class="metric">
          <div class="metric-lbl">Credit Score</div>
          <div class="metric-v">${loan.score}</div>
        </div>
        <div class="metric">
          <div class="metric-lbl">EMI (est.)</div>
          <div class="metric-v">${formatAmount(calcEMI(loan.amount, loan.rate, loan.term))}/mo</div>
        </div>
      </div>
    </div>
    <div class="card-bottom">
      <div class="fund-progress">
        <div class="progress-top">
          <span>${loan.funded}% funded</span>
          <span>${formatAmount(Math.round((loan.amount * (100 - loan.funded)) / 100))} remaining</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width:${loan.funded}%"></div>
        </div>
      </div>
      <span class="days-left"><strong>${loan.daysLeft}</strong>d left</span>
      <button class="invest-btn" onclick="event.stopPropagation(); alert('Opening investment flow for: ' + '${loan.name}')">Invest →</button>
    </div>
  </div>`;
}

function calcEMI(principal, annualRate, months) {
  const r = annualRate / 1200;
  return Math.round(
    (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1),
  );
}

function applyFilters() {
  let result = [...LOANS];

  if (activeFilters.risk !== "all")
    result = result.filter((l) => l.risk === activeFilters.risk);
  if (activeFilters.purpose !== "all")
    result = result.filter((l) => l.purpose === activeFilters.purpose);
  if (activeFilters.search)
    result = result.filter((l) =>
      l.name.toLowerCase().includes(activeFilters.search.toLowerCase()),
    );
  result = result.filter((l) => l.amount <= activeFilters.maxAmount);

  // Credit score sidebar
  const checkedScores = Array.from(
    document.querySelectorAll(".score-filter-cb:checked"),
  ).map((el) => parseInt(el.value));
  result = result.filter((l) => {
    if (l.score >= 720 && checkedScores.includes(720)) return true;
    if (l.score >= 680 && l.score < 720 && checkedScores.includes(680))
      return true;
    if (l.score >= 620 && l.score < 680 && checkedScores.includes(620))
      return true;
    if (l.score < 620 && checkedScores.includes(580)) return true;
    return false;
  });

  if (activeFilters.sort === "rate-high")
    result.sort((a, b) => b.rate - a.rate);
  else if (activeFilters.sort === "rate-low")
    result.sort((a, b) => a.rate - b.rate);
  else if (activeFilters.sort === "amount-high")
    result.sort((a, b) => b.amount - a.amount);
  else if (activeFilters.sort === "funding")
    result.sort((a, b) => b.funded - a.funded);

  currentLoans = result;
  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById("loansGrid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("resultsCount");
  document.getElementById("activeCount").textContent = currentLoans.length;

  if (currentLoans.length === 0) {
    grid.innerHTML = "";
    empty.classList.add("visible");
    count.textContent = "0 results";
  } else {
    empty.classList.remove("visible");
    grid.innerHTML = currentLoans.map(renderCard).join("");
    count.textContent = `${currentLoans.length} loan${currentLoans.length !== 1 ? "s" : ""}`;
    // Animate in
    grid.querySelectorAll(".loan-card").forEach((c, i) => {
      c.style.opacity = "0";
      c.style.transform = "translateY(16px)";
      setTimeout(() => {
        c.style.transition = "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)";
        c.style.opacity = "1";
        c.style.transform = "none";
      }, i * 60);
    });
  }

  renderTopLoans();
}

function renderTopLoans() {
  const top = [...LOANS].sort((a, b) => b.rate - a.rate).slice(0, 3);
  document.getElementById("topLoans").innerHTML = top
    .map(
      (l) => `
    <div class="top-loan">
      <div class="tl-name">${l.name}</div>
      <div class="tl-row">
        <span class="tl-amount">${formatAmount(l.amount)} · ${l.term}mo</span>
        <span class="tl-rate">${l.rate}% APR</span>
      </div>
    </div>
  `,
    )
    .join("");
}

// Event Listeners
document.querySelectorAll('[data-filter="risk"]').forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll('[data-filter="risk"]')
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilters.risk = btn.dataset.value;
    applyFilters();
  });
});

document.getElementById("purposeFilter").addEventListener("change", (e) => {
  activeFilters.purpose = e.target.value;
  applyFilters();
});

document.getElementById("sortFilter").addEventListener("change", (e) => {
  activeFilters.sort = e.target.value;
  applyFilters();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  activeFilters.search = e.target.value;
  applyFilters();
});

document.getElementById("amountRange").addEventListener("input", (e) => {
  const val = parseInt(e.target.value);
  activeFilters.maxAmount = val;
  document.getElementById("rangeDisplay").textContent = formatAmount(val);
  applyFilters();
});

document.querySelectorAll(".score-filter-cb").forEach((cb) => {
  cb.addEventListener("change", applyFilters);
});

// Init
applyFilters();
