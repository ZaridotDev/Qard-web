import { useState } from "react";
import useFinanceStore from "../../store/financeStore";
import { formatCurrency, formatDate, formatCurrencyInput, parseCurrencyInput } from "../../utils/format";
import * as Lucide from "lucide-react";
import { Plus, RefreshCw, Trash2, Tag, Calendar, TrendingUp, TrendingDown } from "lucide-react";

// Dynamic Icon Resolver
function CategoryIcon({ name, size = 16, color = "currentColor" }) {
  const IconComponent = Lucide[name] || Tag;
  return <IconComponent size={size} color={color} />;
}

export default function RecurrentsPage() {
  const {
    recurrents,
    categories,
    addRecurring,
    removeRecurring,
  } = useFinanceStore();

  // Form State
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [categoryId, setCategoryId] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  // Frequency mapping for display
  const frequencyMap = {
    weekly: "Semanal",
    monthly: "Mensual",
    yearly: "Anual",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !startDate) return;

    try {
      await addRecurring({
        description,
        amount: parseCurrencyInput(amount),
        type,
        category_id: categoryId || null,
        frequency,
        start_date: startDate,
      });

      // Reset Form
      setDescription("");
      setAmount("");
      setCategoryId("");
      setFrequency("monthly");
      setStartDate(new Date().toISOString().split("T")[0]);
    } catch (err) {
      console.error("Error creating recurring transaction:", err);
    }
  };

  return (
    <>
      {/* Left Section - Recurring List */}
      <div className="page-section page-section-wide animate-in">
        <div className="section-header">
          <h2>TRANSACCIONES RECURRENTES</h2>
          <span className="text-secondary" style={{ fontSize: "0.875rem" }}>
            {recurrents.length} transacciones automatizadas
          </span>
        </div>

        <div className="scroll-area">
          {recurrents.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {recurrents.map((rec) => {
                const catColor = rec.categories?.color || "#5a7a4d";
                return (
                  <div
                    key={rec.id}
                    className="recurrent-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0.75rem 1rem",
                      borderRadius: "var(--radius-md)",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-subtle)",
                      borderLeft: `4px solid ${rec.type === "income" ? "var(--income-color)" : "var(--expense-color)"}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "2rem",
                          height: "2rem",
                          borderRadius: "var(--radius-sm)",
                          background: `${catColor}15`,
                        }}
                      >
                        <CategoryIcon name={rec.categories?.icon} color={catColor} />
                      </div>
                      <div className="recurrent-info" style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                        <span className="recurrent-desc" style={{ fontWeight: 600 }}>{rec.description}</span>
                        <span className="recurrent-freq" style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <RefreshCw size={10} /> {frequencyMap[rec.frequency] || rec.frequency} — Inicio: {formatDate(rec.start_date)}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                      <span
                        className={`recurrent-amount ${rec.type}`}
                        style={{
                          fontWeight: 600,
                          color: rec.type === "income" ? "var(--income-color)" : "var(--expense-color)",
                        }}
                      >
                        {rec.type === "income" ? "+" : "-"} {formatCurrency(rec.amount)}
                      </span>
                      <button
                        onClick={() => removeRecurring(rec.id)}
                        className="btn btn-ghost btn-icon"
                        style={{ width: "1.75rem", height: "1.75rem", color: "var(--text-muted)" }}
                        title="Eliminar Recurrente"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <RefreshCw size={48} />
              <p>No tienes transacciones recurrentes registradas.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="page-section page-section-narrow animate-in">
        <div className="section-header">
          <h2>NUEVO PERIÓDICO</h2>
        </div>

        <div className="scroll-area">
          <form onSubmit={handleSubmit} className="form-panel">
            {/* Toggler */}
            <div className="type-toggle">
              <button
                type="button"
                className={type === "income" ? "active-income" : ""}
                onClick={() => {
                  setType("income");
                  // Clear category selection if not compatible
                  const selectedCat = categories.find((c) => c.id === categoryId);
                  if (selectedCat && (selectedCat.type || "expense") !== "income") {
                    setCategoryId("");
                  }
                }}
              >
                INGRESO
              </button>
              <button
                type="button"
                className={type === "expense" ? "active-expense" : ""}
                onClick={() => {
                  setType("expense");
                  // Clear category selection if not compatible
                  const selectedCat = categories.find((c) => c.id === categoryId);
                  if (selectedCat && (selectedCat.type || "expense") !== "expense") {
                    setCategoryId("");
                  }
                }}
              >
                EGRESO
              </button>
            </div>

            {/* Description */}
            <div className="form-group">
              <label htmlFor="rec-desc">Descripción</label>
              <input
                id="rec-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Netflix, Alquiler, Sueldo"
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="rec-cat">Categoría (Opcional)</label>
              <select
                id="rec-cat"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">Ninguna</option>
                {categories
                  .filter((cat) => (cat.type || "expense") === type)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Frequency */}
            <div className="form-group">
              <label htmlFor="rec-freq">Frecuencia</label>
              <select
                id="rec-freq"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                required
              >
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensual</option>
                <option value="yearly">Anual</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label htmlFor="rec-start">Fecha de Inicio</label>
              <input
                id="rec-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* Amount */}
            <div className="form-group">
              <label htmlFor="rec-amount">Monto Periódico</label>
              <div style={{ position: "relative" }}>
                <input
                  id="rec-amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(formatCurrencyInput(e.target.value))}
                  placeholder="0,00"
                  required
                  style={{ paddingLeft: "1.75rem", paddingRight: "2.25rem" }}
                />
                <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}>$</span>
                {amount && !amount.includes(",") && (
                  <span style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                    ,00
                  </span>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: "var(--space-sm)" }}>
              {type === "income" ? (
                <>
                  <TrendingUp size={16} /> Crear Ingreso Recurrente
                </>
              ) : (
                <>
                  <TrendingDown size={16} /> Crear Gasto Recurrente
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
