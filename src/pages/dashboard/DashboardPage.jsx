import { useState } from "react";
import useFinanceStore from "../../store/financeStore";
import { formatCurrency } from "../../utils/format";
import { TrendingUp, TrendingDown, Wallet, AlertTriangle, Trash2, Plus, Info } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const transactions        = useFinanceStore((s) => s.transactions);
  const installments        = useFinanceStore((s) => s.installments);
  const categories          = useFinanceStore((s) => s.categories);
  const removeTransaction   = useFinanceStore((s) => s.removeTransaction);
  const isDemoMode          = useFinanceStore((s) => s.isDemoMode);

  const [hoveredCategory, setHoveredCategory] = useState(null);

  /* ── Computed values ─────────────────────────── */
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const directExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const unpaidInstallments = installments
    .filter((inst) => !inst.is_paid)
    .reduce((sum, inst) => sum + parseFloat(inst.amount), 0);

  const expense = directExpense + unpaidInstallments;
  const balance = income - expense;

  /* ── Chart data ──────────────────────────────── */
  const totalExpenses = directExpense + unpaidInstallments;

  const categoryMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const key   = t.categories?.name  || "Otros";
      const color = t.categories?.color || "#5a7a4d";
      if (!categoryMap[key]) categoryMap[key] = { name: key, color, amount: 0 };
      categoryMap[key].amount += parseFloat(t.amount);
    });

  if (unpaidInstallments > 0) {
    categoryMap["Cuotas Tarjeta"] = { name: "Cuotas Tarjeta", color: "#a78bfa", amount: unpaidInstallments };
  }

  const chartData = Object.values(categoryMap);

  /* ── SVG donut ───────────────────────────────── */
  const radius        = 40;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  /* ── Budgets ─────────────────────────────────── */
  const totalBudget = categories.reduce(
    (sum, cat) => sum + (cat.budgets?.[0]?.amount || 0),
    0
  );
  const budgetPct   = totalBudget > 0 ? (expense / totalBudget) * 100 : 0;
  const budgetClass = budgetPct > 100 ? "danger" : budgetPct > 80 ? "warning" : "";

  return (
    <>
      {/* ── Left panel ───────────────────────────── */}
      <div className="page-section page-section-wide animate-in">

        {/* Demo mode banner */}
        {isDemoMode && (
          <div
            className="toast toast-success"
            style={{
              position: "relative", bottom: "auto", right: "auto",
              margin: "0 0 1rem 0", display: "flex", gap: "0.5rem",
              alignItems: "center", width: "100%", animation: "none",
            }}
          >
            <Info size={16} />
            <div>
              <strong>Modo Demo:</strong> No hay conexión a Supabase. Los datos son locales de muestra.
            </div>
          </div>
        )}

        <div className="section-header">
          <h2>RESUMEN MENSUAL</h2>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card income">
            <div className="stat-label">Ingresos</div>
            <div className="stat-value">{formatCurrency(income)}</div>
            <div className="stat-change text-income">
              <TrendingUp size={14} /> ingresos del mes
            </div>
          </div>
          <div className="stat-card expense">
            <div className="stat-label">Egresos</div>
            <div className="stat-value">{formatCurrency(expense)}</div>
            <div className="stat-change text-expense">
              <TrendingDown size={14} /> egresos + cuotas impagas
            </div>
          </div>
          <div className="stat-card balance">
            <div className="stat-label">Disponible</div>
            <div
              className="stat-value"
              style={{ color: balance >= 0 ? "var(--income-color)" : "var(--expense-color)" }}
            >
              {formatCurrency(balance)}
            </div>
            <div className="stat-change" style={{ color: balance >= 0 ? "var(--income-color)" : "var(--expense-color)" }}>
              <Wallet size={14} /> saldo del período
            </div>
          </div>
        </div>

        {/* Budget progress */}
        <div className="glass-card" style={{ padding: "var(--space-lg)", marginBottom: "var(--space-lg)" }}>
          <h3 style={{ marginBottom: "var(--space-md)" }}>Presupuesto Total</h3>
          {totalBudget > 0 ? (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-xs)", fontSize: "0.875rem" }}>
                <span className="text-secondary">{formatCurrency(expense)} de {formatCurrency(totalBudget)}</span>
                <span style={{ fontWeight: 600 }}>{budgetPct.toFixed(0)}%</span>
              </div>
              <div className={`progress-bar ${budgetClass}`}>
                <div className="progress-fill" style={{ width: `${Math.min(budgetPct, 100)}%` }} />
              </div>
              {budgetPct > 100 && (
                <div className="text-expense" style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.75rem", marginTop: "0.5rem" }}>
                  <AlertTriangle size={12} /> ¡Presupuesto excedido!
                </div>
              )}
            </>
          ) : (
            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
              No configuraste presupuestos aún.{" "}
              <Link to="/categories" style={{ color: "var(--accent)" }}>Configurar ahora</Link>
            </p>
          )}
        </div>

        {/* Donut chart */}
        <div className="glass-card" style={{ padding: "var(--space-lg)", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ marginBottom: "var(--space-sm)" }}>Desglose de Egresos</h3>
          {chartData.length > 0 ? (
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-around", flex: 1 }}>
              <div className="chart-container" style={{ width: 200, height: 200 }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r={radius} fill="transparent" stroke="var(--bg-base)" strokeWidth="8" />
                  {chartData.map((item, i) => {
                    const pct         = totalExpenses > 0 ? item.amount / totalExpenses : 0;
                    const dash        = pct * circumference;
                    const offset      = circumference - dash + cumulativeOffset;
                    cumulativeOffset -= dash;
                    const isHovered   = hoveredCategory === item.name;
                    return (
                      <circle
                        key={i}
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke={item.color}
                        strokeWidth={isHovered ? 11 : 8}
                        strokeDasharray={`${dash} ${circumference - dash}`}
                        strokeDashoffset={offset}
                        transform="rotate(-90 50 50)"
                        style={{ transition: "stroke-width 0.2s", cursor: "pointer", opacity: hoveredCategory && !isHovered ? 0.5 : 1 }}
                        onMouseEnter={() => setHoveredCategory(item.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      />
                    );
                  })}
                </svg>
                <div className="chart-center-text">
                  <span className="chart-center-label">{hoveredCategory ?? "Total"}</span>
                  <span className="chart-center-value">
                    {formatCurrency(
                      hoveredCategory
                        ? (chartData.find((c) => c.name === hoveredCategory)?.amount ?? 0)
                        : totalExpenses
                    )}
                  </span>
                </div>
              </div>

              <div className="chart-legend">
                {chartData.map((item, i) => (
                  <div
                    key={i}
                    className="legend-item"
                    onMouseEnter={() => setHoveredCategory(item.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    style={{
                      opacity:    hoveredCategory && hoveredCategory !== item.name ? 0.5 : 1,
                      fontWeight: hoveredCategory === item.name ? 600 : 400,
                    }}
                  >
                    <span className="legend-dot" style={{ backgroundColor: item.color }} />
                    {item.name} ({totalExpenses > 0 ? ((item.amount / totalExpenses) * 100).toFixed(0) : 0}%)
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ flex: 1 }}>
              <TrendingDown size={40} />
              <p>No hay gastos registrados este mes.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Right panel — recent transactions ────── */}
      <div className="page-section page-section-narrow animate-in">
        <div className="section-header">
          <h2>RECIENTES</h2>
          <Link to="/transactions" className="btn btn-secondary" style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}>
            <Plus size={14} /> Nueva
          </Link>
        </div>

        <div className="scroll-area">
          {transactions.length > 0 ? (
            <div className="tx-list">
              {transactions.slice(0, 10).map((tx) => (
                <div key={tx.id} className="tx-row">
                  <div className={`tx-dot ${tx.type}`} />
                  <div className="tx-desc" style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                    <span>{tx.description}</span>
                    <span className="tx-category" style={{ color: tx.categories?.color || "var(--text-muted)" }}>
                      {tx.categories?.name || "Sin categoría"}
                    </span>
                  </div>
                  <div className={`tx-amount ${tx.type}`}>
                    {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                  </div>
                  <div className="tx-actions">
                    <button onClick={() => removeTransaction(tx.id)} title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <TrendingUp size={48} />
              <p>Sin transacciones este mes.</p>
              <Link to="/transactions" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                Agregar Transacción
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}