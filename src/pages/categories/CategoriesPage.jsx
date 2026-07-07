import { useState } from "react";
import useFinanceStore from "../../store/financeStore";
import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from "../../utils/format";
import * as Lucide from "lucide-react";
import { Plus, Tag, Trash2, Edit2, Check, X, AlertTriangle } from "lucide-react";

// Dynamic Icon Renderer
function CategoryIcon({ name, size = 20, color = "currentColor" }) {
  const IconComponent = Lucide[name] || Tag;
  return <IconComponent size={size} color={color} />;
}

export default function CategoriesPage() {
  const {
    categories,
    transactions,
    addCategory,
    removeCategory,
    addBudget,
    updateBudget,
    deleteBudget,
  } = useFinanceStore();

  // Form State
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState("#4ade80");
  const [selectedIcon, setSelectedIcon] = useState("Tag");
  const [catType, setCatType] = useState("expense");

  // Filter State
  const [filter, setFilter] = useState("all");

  // Budget Edit State
  const [editingBudgetCatId, setEditingBudgetCatId] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState("");

  // Presets
  const colorPresets = [
    "#4ade80", // Mint
    "#f87171", // Coral
    "#60a5fa", // Sky Blue
    "#fbbf24", // Yellow/Amber
    "#c084fc", // Purple
    "#2dd4bf", // Teal
    "#818cf8", // Indigo
    "#f43f5e", // Rose
    "#fb923c", // Orange
  ];

  const iconPresets = [
    "Tag",
    "TrendingUp",
    "Utensils",
    "Car",
    "Zap",
    "Tv",
    "BookOpen",
    "Heart",
    "ShoppingBag",
    "Gift",
    "Compass",
    "Briefcase",
    "Home",
    "Smartphone",
  ];

  // Submit Category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      await addCategory({
        name,
        color: selectedColor,
        icon: selectedIcon,
        type: catType,
      });

      setName("");
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  // Get total spent in category for current month
  const getCategorySpending = (catId) => {
    return transactions
      .filter((t) => t.type === "expense" && t.category_id === catId)
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  // Budget handlers
  const handleOpenBudgetEdit = (cat) => {
    setEditingBudgetCatId(cat.id);
    const existingBudget = cat.budgets?.[0];
    setBudgetAmount(existingBudget ? formatCurrencyInput(existingBudget.amount.toString()) : "");
  };

  const handleSaveBudget = async (cat) => {
    const existingBudget = cat.budgets?.[0];
    const amountVal = parseCurrencyInput(budgetAmount);

    try {
      if (isNaN(amountVal) || amountVal <= 0) {
        // Delete if empty
        if (existingBudget) {
          await deleteBudget(existingBudget.id, cat.id);
        }
      } else {
        if (existingBudget) {
          await updateBudget(existingBudget.id, cat.id, amountVal);
        } else {
          await addBudget(cat.id, amountVal);
        }
      }
      setEditingBudgetCatId(null);
      setBudgetAmount("");
    } catch (err) {
      console.error("Error setting budget:", err);
    }
  };

  return (
    <>
      {/* Left Section - Categories Grid */}
      <div className="page-section page-section-wide animate-in">
        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "var(--space-sm)" }}>
          <h2>CATEGORÍAS Y PRESUPUESTOS</h2>
          <div className="type-toggle" style={{ width: "auto", display: "flex" }}>
            <button
              type="button"
              className={filter === "all" ? "active-all" : ""}
              onClick={() => setFilter("all")}
              style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
            >
              TODAS
            </button>
            <button
              type="button"
              className={filter === "income" ? "active-income" : ""}
              onClick={() => setFilter("income")}
              style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
            >
              INGRESOS
            </button>
            <button
              type="button"
              className={filter === "expense" ? "active-expense" : ""}
              onClick={() => setFilter("expense")}
              style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem" }}
            >
              EGRESOS
            </button>
          </div>
        </div>

        <div className="scroll-area">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "var(--space-md)",
            }}
          >
            {categories
              .filter((cat) => {
                const typeVal = cat.type || "expense";
                return filter === "all" || typeVal === filter;
              })
              .map((cat) => {
                const spent = getCategorySpending(cat.id);
                const budgetObj = cat.budgets?.[0];
                const budgetLimit = budgetObj ? budgetObj.amount : 0;
                const hasBudget = budgetLimit > 0;
                const percent = hasBudget ? (spent / budgetLimit) * 100 : 0;

                let progressClass = "";
                if (percent > 100) progressClass = "danger";
                else if (percent > 80) progressClass = "warning";

                const isEditingBudget = editingBudgetCatId === cat.id;

                return (
                  <div
                    key={cat.id}
                    className="glass-card"
                    style={{
                      padding: "var(--space-md)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      gap: "var(--space-sm)",
                      borderLeft: `4px solid ${cat.color}`,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "2.25rem",
                            height: "2.25rem",
                            borderRadius: "var(--radius-sm)",
                            background: `${cat.color}15`,
                          }}
                        >
                          <CategoryIcon name={cat.icon} color={cat.color} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                            <span style={{ fontWeight: 600, fontSize: "1rem" }}>{cat.name}</span>
                            <span 
                              className={`badge ${cat.type === "income" ? "badge-income" : "badge-expense"}`}
                              style={{ 
                                fontSize: "0.625rem", 
                                padding: "0.125rem 0.375rem", 
                                borderRadius: "4px",
                                fontWeight: 600,
                                background: cat.type === "income" ? "var(--income-bg)" : "var(--expense-bg)",
                                color: cat.type === "income" ? "var(--income-color)" : "var(--expense-color)",
                              }}
                            >
                              {cat.type === "income" ? "Ingreso" : "Egreso"}
                            </span>
                          </div>
                          <span className="text-secondary" style={{ fontSize: "0.75rem" }}>
                            Consumo: {formatCurrency(spent)}
                          </span>
                        </div>
                      </div>

                    <button
                      onClick={() => removeCategory(cat.id)}
                      className="btn btn-ghost btn-icon"
                      style={{ width: "1.75rem", height: "1.75rem", color: "var(--text-muted)" }}
                      title="Eliminar Categoría"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Budget details / Edit */}
                  <div style={{ background: "var(--bg-base)", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.8125rem" }}>
                    {isEditingBudget ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        <span className="text-secondary" style={{ marginRight: "0.25rem" }}>Presupuesto: $</span>
                        <div style={{ position: "relative", flex: 1, display: "flex" }}>
                          <input
                            type="text"
                            value={budgetAmount}
                            onChange={(e) => setBudgetAmount(formatCurrencyInput(e.target.value))}
                            placeholder="Monto / Vacío"
                            style={{
                              padding: "0.25rem 1.5rem 0.25rem 0.5rem",
                              fontSize: "0.8125rem",
                              height: "1.75rem",
                              width: "100%",
                            }}
                            autoFocus
                          />
                          {budgetAmount && !budgetAmount.includes(",") && (
                            <span style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none", fontSize: "0.8125rem" }}>
                              ,00
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleSaveBudget(cat)}
                          className="btn btn-primary"
                          style={{ padding: "0", width: "1.75rem", height: "1.75rem", borderRadius: "50%" }}
                        >
                          <Check size={12} />
                        </button>
                        <button
                          onClick={() => setEditingBudgetCatId(null)}
                          className="btn btn-secondary"
                          style={{ padding: "0", width: "1.75rem", height: "1.75rem", borderRadius: "50%" }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <span className="text-muted">Presupuesto mensual: </span>
                          <strong style={{ color: hasBudget ? "var(--text-primary)" : "var(--text-muted)" }}>
                            {hasBudget ? formatCurrency(budgetLimit) : "No asignado"}
                          </strong>
                        </div>
                        <button
                          onClick={() => handleOpenBudgetEdit(cat)}
                          style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", display: "flex", alignItems: "center" }}
                          title="Editar Presupuesto"
                        >
                          <Edit2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  {hasBudget && (
                    <div style={{ marginTop: "0.25rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", marginBottom: "0.125rem" }}>
                        <span className="text-secondary">{percent.toFixed(0)}% Utilizado</span>
                        {percent > 100 && (
                          <span className="text-expense" style={{ display: "flex", alignItems: "center", gap: "0.125rem" }}>
                            <AlertTriangle size={10} /> Excedido
                          </span>
                        )}
                      </div>
                      <div className={`progress-bar ${progressClass}`}>
                        <div className="progress-fill" style={{ width: `${Math.min(percent, 100)}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="page-section page-section-narrow animate-in">
        <div className="section-header">
          <h2>NUEVA CATEGORÍA</h2>
        </div>

        <div className="scroll-area">
          <form onSubmit={handleSubmit} className="form-panel">
            {/* Category Type Selector */}
            <div className="form-group">
              <label>Tipo de Categoría</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={catType === "income" ? "active-income" : ""}
                  onClick={() => setCatType("income")}
                >
                  INGRESO
                </button>
                <button
                  type="button"
                  className={catType === "expense" ? "active-expense" : ""}
                  onClick={() => setCatType("expense")}
                >
                  EGRESO
                </button>
              </div>
            </div>

            {/* Category Name */}
            <div className="form-group">
              <label htmlFor="cat-name">Nombre de Categoría</label>
              <input
                id="cat-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Compras, Salud, Regalos"
                required
              />
            </div>

            {/* Colors presets grid */}
            <div className="form-group">
              <label>Color Vibrante</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "0.5rem",
                  marginTop: "0.25rem",
                }}
              >
                {colorPresets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{
                      height: "2.25rem",
                      borderRadius: "var(--radius-sm)",
                      border: selectedColor === color ? "2px solid white" : "1px solid var(--border-subtle)",
                      background: color,
                      cursor: "pointer",
                      boxShadow: selectedColor === color ? "0 0 10px rgba(255,255,255,0.4)" : "none",
                      transition: "transform 0.1s ease",
                      transform: selectedColor === color ? "scale(1.05)" : "none",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Icon picker grid */}
            <div className="form-group">
              <label>Icono Representativo</label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 1fr)",
                  gap: "0.5rem",
                  maxHeight: "150px",
                  overflowY: "auto",
                  padding: "2px",
                  border: "1px solid var(--border-default)",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-base)",
                  marginTop: "0.25rem",
                }}
              >
                {iconPresets.map((ico) => (
                  <button
                    key={ico}
                    type="button"
                    onClick={() => setSelectedIcon(ico)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "2.25rem",
                      borderRadius: "var(--radius-sm)",
                      border: selectedIcon === ico ? "1px solid var(--accent)" : "none",
                      background: selectedIcon === ico ? "var(--bg-elevated)" : "transparent",
                      color: selectedIcon === ico ? "var(--accent)" : "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "all 0.1s ease",
                    }}
                    title={ico}
                  >
                    <CategoryIcon name={ico} size={16} />
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: "var(--space-sm)" }}>
              <Plus size={16} /> Crear Categoría
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
