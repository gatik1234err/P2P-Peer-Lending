// ========= STATE =========
let state = {
  amount: 1000000,
  term: 12,
  rate: 14,
  score: 680,
  risk: "med",
  mode: "borrower",
};

// ========= HELPERS =========
function fmt(n) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + "Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function fmtInput(n) {
  return new Intl.NumberFormat("en-IN").format(n);
}

function calcEMI(P, annualRate, N) {
  const r = annualRate / 1200;
  if (r === 0) return P / N;
  return (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
}

function getRiskFromScore(score) {
  if (score >= 720) return "low";
  if (score >= 620) return "med";
  return "high";
}

function getRateForRisk(risk) {
  const map = { low: 11, med: 16, high: 21 };
  return map[risk];
}

// ========= SYNC INPUTS =========
document.getElementById("loanAmount").addEventListener("input", (e) => {
  state.amount = parseInt(e.target.value) || 0;
  document.getElementById("loanAmountRange").value = state.amount;
  document.getElementById("amountDisplay").textContent = fmt(state.amount);
  calculate();
});

document.getElementById("loanAmountRange").addEventListener("input", (e) => {
  state.amount = parseInt(e.target.value);
  document.getElementById("loanAmount").value = state.amount;
  document.getElementById("amountDisplay").textContent = fmt(state.amount);
  calculate();
});

document.getElementById("termRange").addEventListener("input", (e) => {
  state.term = parseInt(e.target.value);
  document.getElementById("termDisplay").textContent = state.term + " months";
  calculate();
});

document.getElementById("rateRange").addEventListener("input", (e) => {
  state.rate = parseFloat(e.target.value);
  document.getElementById("rateDisplay").textContent =
    state.rate.toFixed(1) + "%";
  calculate();
});

document.getElementById("creditScore").addEventListener("input", (e) => {
  state.score = parseInt(e.target.value) || 680;
  document.getElementById("scoreRange").value = state.score;
  document.getElementById("scoreDisplay").textContent = state.score;
  autoSetRisk();
  calculate();
});

document.getElementById("scoreRange").addEventListener("input", (e) => {
  state.score = parseInt(e.target.value);
  document.getElementById("creditScore").value = state.score;
  document.getElementById("scoreDisplay").textContent = state.score;
  autoSetRisk();
  calculate();
});

function autoSetRisk() {
  state.risk = getRiskFromScore(state.score);
  state.rate = getRateForRisk(state.risk);
  document.getElementById("rateRange").value = state.rate;
  document.getElementById("rateDisplay").textContent =
    state.rate.toFixed(1) + "%";
  document.querySelectorAll(".risk-opt").forEach((opt) => {
    opt.classList.toggle("selected", opt.dataset.risk === state.risk);
  });
}

document.querySelectorAll(".risk-opt").forEach((opt) => {
  opt.addEventListener("click", () => {
    state.risk = opt.dataset.risk;
    state.rate = getRateForRisk(state.risk);
    document.getElementById("rateRange").value = state.rate;
    document.getElementById("rateDisplay").textContent =
      state.rate.toFixed(1) + "%";
    document
      .querySelectorAll(".risk-opt")
      .forEach((o) => o.classList.remove("selected"));
    opt.classList.add("selected");
    calculate();
  });
});

// Mode toggle
document.getElementById("borrowerModeBtn").addEventListener("click", () => {
  state.mode = "borrower";
  document.getElementById("borrowerModeBtn").classList.add("active");
  document.getElementById("lenderModeBtn").classList.remove("active");
  document.getElementById("lenderSection").classList.remove("visible");
  calculate();
});

document.getElementById("lenderModeBtn").addEventListener("click", () => {
  state.mode = "lender";
  document.getElementById("lenderModeBtn").classList.add("active");
  document.getElementById("borrowerModeBtn").classList.remove("active");
  document.getElementById("lenderSection").classList.add("visible");
  calculate();
});

document.getElementById("calcBtn").addEventListener("click", calculate);

// Amortization toggle
document.getElementById("amortToggle").addEventListener("click", () => {
  const wrap = document.getElementById("amortTableWrap");
  const btn = document.getElementById("amortToggle");
  const visible = wrap.style.display !== "none";
  wrap.style.display = visible ? "none" : "block";
  btn.textContent = visible ? "Show Full Table ↓" : "Hide Table ↑";
});

// ========= MAIN CALCULATE =========
function calculate() {
  const P = state.amount;
  const N = state.term;
  const r = state.rate / 1200;
  const emi = calcEMI(P, state.rate, N);
  const totalPayment = emi * N;
  const totalInterest = totalPayment - P;
  const intRatio = totalInterest / totalPayment;
  const priRatio = P / totalPayment;

  // Update primary results
  animateValue("emiResult", fmt(emi));
  animateValue("totalInterestResult", fmt(totalInterest));
  animateValue("totalPaymentResult", fmt(totalPayment));

  // Donut chart
  const circumference = 188.5;
  const interestDash = intRatio * circumference;
  const principalOffset = interestDash;
  document
    .getElementById("donutInterest")
    .setAttribute(
      "stroke-dasharray",
      `${interestDash} ${circumference - interestDash}`,
    );
  document
    .getElementById("donutInterest")
    .setAttribute("stroke-dashoffset", circumference - interestDash);
  document
    .getElementById("donutPrincipal")
    .setAttribute("stroke-dashoffset", -interestDash + circumference);

  document.getElementById("legendPrincipal").textContent =
    fmt(P) + " (" + Math.round(priRatio * 100) + "%)";
  document.getElementById("legendInterest").textContent =
    fmt(totalInterest) + " (" + Math.round(intRatio * 100) + "%)";

  // Bar chart — quarterly
  buildBarChart(P, state.rate, N, emi);

  // Amortization
  buildAmortTable(P, state.rate, N, emi);

  // Lender mode
  if (state.mode === "lender") {
    const platformFee = P * 0.005;
    const netReturn = totalInterest - platformFee;
    const apy = (netReturn / P / (N / 12)) * 100;
    animateValue("lenderReturn", fmt(netReturn));
    animateValue("lenderAPY", apy.toFixed(2) + "%");
    animateValue("lenderFee", fmt(platformFee));
  }
}

function animateValue(id, newVal) {
  const el = document.getElementById(id);
  el.style.opacity = "0.3";
  el.style.transform = "translateY(4px)";
  setTimeout(() => {
    el.textContent = newVal;
    el.style.transition = "all 0.35s ease";
    el.style.opacity = "1";
    el.style.transform = "none";
  }, 80);
}

function buildBarChart(P, annualRate, N, emi) {
  const r = annualRate / 1200;
  // Sample quarterly points
  let balance = P;
  const points = [];
  for (let m = 1; m <= N; m++) {
    const intPart = balance * r;
    const priPart = emi - intPart;
    balance -= priPart;
    if (m % Math.max(1, Math.floor(N / 6)) === 0 || m === N) {
      points.push({ month: m, interest: intPart, principal: priPart });
    }
  }
  const maxEMI = emi;
  const html = points
    .map(
      (p) => `
      <div>
        <div style="font-family:'DM Mono',monospace;font-size:0.6rem;color:var(--muted);margin-bottom:0.3rem">Mo ${p.month}</div>
        <div class="bar-row">
          <div class="bar-label" style="color:var(--ink)">Pri</div>
          <div class="bar-track"><div class="bar-fill" style="width:${((p.principal / maxEMI) * 100).toFixed(1)}%;background:var(--ink)"></div></div>
          <div class="bar-val">${fmt(p.principal)}</div>
        </div>
        <div class="bar-row">
          <div class="bar-label" style="color:var(--amber)">Int</div>
          <div class="bar-track"><div class="bar-fill" style="width:${((p.interest / maxEMI) * 100).toFixed(1)}%;background:var(--amber)"></div></div>
          <div class="bar-val">${fmt(p.interest)}</div>
        </div>
      </div>
    `,
    )
    .join("");
  document.getElementById("barChart").innerHTML = html;
}

function buildAmortTable(P, annualRate, N, emi) {
  const r = annualRate / 1200;
  let balance = P;
  const rows = [];
  for (let m = 1; m <= N; m++) {
    const intPart = balance * r;
    const priPart = emi - intPart;
    balance = Math.max(0, balance - priPart);
    rows.push(`<tr>
        <td>Month ${m}</td>
        <td>${fmt(emi)}</td>
        <td class="td-principal">${fmt(priPart)}</td>
        <td class="td-interest">${fmt(intPart)}</td>
        <td class="td-balance">${fmt(balance)}</td>
      </tr>`);
  }
  document.getElementById("amortBody").innerHTML = rows.join("");
}

// Initial
calculate();
