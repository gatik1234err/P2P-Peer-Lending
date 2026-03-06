const POSITIONS = [
  {
    name: "GreenWave Solar",
    meta: "Equipment · 36mo",
    risk: "low",
    invested: 300000,
    rate: 10.5,
    emi: 9750,
    status: "On Track",
  },
  {
    name: "Mehta Organics",
    meta: "Equipment · 24mo",
    risk: "low",
    invested: 450000,
    rate: 11.5,
    emi: 71200,
    status: "On Track",
  },
  {
    name: "Sharma Textiles",
    meta: "Inventory · 18mo",
    risk: "med",
    invested: 220000,
    rate: 16.5,
    emi: 128600,
    status: "On Track",
  },
  {
    name: "BlueSky Logistics",
    meta: "Expansion · 36mo",
    risk: "low",
    invested: 350000,
    rate: 10.8,
    emi: 42100,
    status: "On Track",
  },
  {
    name: "Arjun Tech",
    meta: "Working Capital · 12mo",
    risk: "med",
    invested: 150000,
    rate: 15.0,
    emi: 44300,
    status: "On Track",
  },
  {
    name: "Naik Foods",
    meta: "Equipment · 12mo",
    risk: "high",
    invested: 80000,
    rate: 21.0,
    emi: 44400,
    status: "Overdue",
  },
  {
    name: "Coastal Seafoods",
    meta: "Inventory · 18mo",
    risk: "low",
    invested: 200000,
    rate: 11.0,
    emi: 58900,
    status: "On Track",
  },
  {
    name: "Sunrise Agri",
    meta: "Working Capital · 12mo",
    risk: "med",
    invested: 710000,
    rate: 14.5,
    emi: 58700,
    status: "On Track",
  },
];

function fmt(n) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
  return "₹" + n.toLocaleString("en-IN");
}

function renderPortfolio() {
  const html = POSITIONS.map((p) => {
    const earnedEst = Math.round(((p.invested * p.rate) / 100 / 12) * 3);
    const isOverdue = p.status === "Overdue";
    return `
    <div class="position-row">
      <div>
        <div class="pos-name">${p.name}</div>
        <div class="pos-meta">${p.meta}</div>
      </div>
      <span class="pos-badge pb-${p.risk}">${p.risk === "low" ? "Low" : p.risk === "med" ? "Med" : "High"}</span>
      <div class="pos-amount">${fmt(p.invested)}<br><span style="font-size:0.65rem;color:var(--muted)">${p.rate}% APR</span></div>
      <div class="pos-return ${isOverdue ? "neg" : "pos"}">${isOverdue ? "⚠ Late" : "+" + fmt(earnedEst)}</div>
    </div>`;
  }).join("");
  document.getElementById("portfolioTable").innerHTML = html;
}

function switchView(view, el) {
  event.preventDefault();
  document
    .querySelectorAll(".nav-item")
    .forEach((i) => i.classList.remove("active"));
  el.classList.add("active");
}

function setViewMode(mode, btn) {
  document
    .querySelectorAll(".view-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  if (mode === "borrower") {
    document.querySelector(".topbar-title").textContent =
      "Good morning, Priya 👋";
    document.querySelector(".user-name").textContent = "Priya Sharma";
    document.querySelector(".user-avatar").textContent = "PS";
    document.querySelector(".user-role").textContent = "Borrower · Active";
  } else {
    document.querySelector(".topbar-title").textContent =
      "Good morning, Rahul 👋";
    document.querySelector(".user-name").textContent = "Rahul Kapoor";
    document.querySelector(".user-avatar").textContent = "RK";
    document.querySelector(".user-role").textContent = "Lender · Premium";
  }
}

renderPortfolio();
