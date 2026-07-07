import { useState } from "react";
import useFinanceStore from "../../store/financeStore";
import { formatCurrency, formatDate, formatCurrencyInput, parseCurrencyInput } from "../../utils/format";
import { Plus, CreditCard, Calendar, Check, AlertCircle, Trash2 } from "lucide-react";

export default function PaymentMethodsPage() {
  const {
    paymentMethods,
    installments,
    categories,
    addPaymentMethod,
    payInstallment,
    removeInstallmentPurchase,
  } = useFinanceStore();

  // Form State
  const [alias, setAlias] = useState("");
  const [methodType, setMethodType] = useState("credit"); // credit or personal
  const [creditLimit, setCreditLimit] = useState("");
  const [personalLimit, setPersonalLimit] = useState("");
  const [closingDay, setClosingDay] = useState("");
  const [dueDay, setDueDay] = useState("");

  const [selectedCardId, setSelectedCardId] = useState(null);

  // Gradient helper mapping
  const gradients = [
    "card-gradient-1",
    "card-gradient-2",
    "card-gradient-3",
    "card-gradient-4",
    "card-gradient-5",
  ];

  // Submit new payment method
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!alias) return;

    try {
      const pmData = {
        alias,
        closing_day: methodType === "credit" && closingDay ? parseInt(closingDay) : null,
        due_day: methodType === "credit" && dueDay ? parseInt(dueDay) : null,
        credit_limit: methodType === "credit" ? parseCurrencyInput(creditLimit) || 0 : null,
        personal_limit: methodType === "personal" ? parseCurrencyInput(personalLimit) || 0 : null,
      };

      await addPaymentMethod(pmData);

      // Reset
      setAlias("");
      setCreditLimit("");
      setPersonalLimit("");
      setClosingDay("");
      setDueDay("");
    } catch (err) {
      console.error("Error adding payment method:", err);
    }
  };

  // Get current card installments
  const getCardInstallments = (pmId) => {
    return installments.filter((inst) => inst.payment_method_id === pmId);
  };

  // Handle pay installment
  const handlePayInstallment = async (inst) => {
    // Find a default category to link the paid transaction to
    const defaultCat = categories.find((c) => c.name.toLowerCase().includes("servicios")) || categories[0];
    const catId = defaultCat ? defaultCat.id : null;

    const txData = {
      type: "expense",
      description: `Pago Cuota ${inst.installment_number}/${inst.total_installments} — ${inst.description}`,
      amount: inst.amount,
      category_id: catId,
      transaction_date: new Date().toISOString().split("T")[0],
      payment_method_id: inst.payment_method_id,
    };

    try {
      await payInstallment(inst.id, txData);
    } catch (err) {
      console.error("Error paying installment:", err);
    }
  };

  // Handle delete entire installment purchase
  const handleDeleteInstallmentPurchase = async (inst) => {
    if (window.confirm(`¿Eliminar todas las cuotas de "${inst.description}"?`)) {
      try {
        await removeInstallmentPurchase(inst.description, inst.payment_method_id);
      } catch (err) {
        console.error("Error deleting installment purchase:", err);
      }
    }
  };

  return (
    <>
      {/* Left Section - Cards & Installments */}
      <div className="page-section page-section-wide animate-in">
        <div className="section-header">
          <h2>MIS TARJETAS Y CUENTAS</h2>
        </div>

        <div className="scroll-area">
          {/* Card list */}
          {paymentMethods.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>
              <div className="cards-grid">
                {paymentMethods.map((pm, idx) => {
                  const cardInsts = getCardInstallments(pm.id);
                  const monthlyConsumption = cardInsts.reduce((sum, inst) => sum + parseFloat(inst.amount), 0);
                  const isSelected = selectedCardId === pm.id || (!selectedCardId && idx === 0);

                  // Auto select first card on load if not set
                  if (!selectedCardId && idx === 0) {
                    setSelectedCardId(pm.id);
                  }

                  const gradClass = gradients[idx % gradients.length];
                  const totalLimit = pm.credit_limit || pm.personal_limit || 0;
                  const usagePercent = totalLimit > 0 ? (monthlyConsumption / totalLimit) * 100 : 0;

                  return (
                    <div
                      key={pm.id}
                      className={`payment-card ${gradClass}`}
                      onClick={() => setSelectedCardId(pm.id)}
                      style={{
                        outline: isSelected ? "2px solid var(--accent)" : "none",
                        outlineOffset: "4px",
                      }}
                    >
                      <div>
                        <div className="card-alias">{pm.alias}</div>
                        <div className="card-type">
                          {pm.credit_limit ? "Tarjeta de Crédito" : "Cuenta de Débito/Efectivo"}
                        </div>
                      </div>

                      <div style={{ marginTop: "1rem" }}>
                        <div className="card-limit">
                          Consumido este mes: <strong>{formatCurrency(monthlyConsumption)}</strong>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", opacity: 0.8, marginTop: "0.5rem" }}>
                          <span>Límite: {formatCurrency(totalLimit)}</span>
                          <span>{usagePercent.toFixed(0)}%</span>
                        </div>
                        <div className="progress-bar" style={{ height: "4px", background: "rgba(255,255,255,0.15)", marginTop: "0.25rem" }}>
                          <div
                            className="progress-fill"
                            style={{
                              width: `${Math.min(usagePercent, 100)}%`,
                              background: "rgba(255, 255, 255, 0.95)",
                            }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6875rem", opacity: 0.7 }}>
                        {pm.closing_day && <span>Cierre: día {pm.closing_day}</span>}
                        {pm.due_day && <span>Vencimiento: día {pm.due_day}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Card Installments */}
              {selectedCardId && (
                <div className="glass-card" style={{ padding: "var(--space-lg)", marginTop: "var(--space-md)" }}>
                  <h3 style={{ marginBottom: "var(--space-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Calendar size={18} />
                    Cuotas de este Período (
                    {paymentMethods.find((pm) => pm.id === selectedCardId)?.alias})
                  </h3>

                  {getCardInstallments(selectedCardId).length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {getCardInstallments(selectedCardId).map((inst) => (
                        <div
                          key={inst.id}
                          className={`installment-row ${inst.is_paid ? "is-paid" : ""}`}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.625rem 0.875rem",
                            borderRadius: "var(--radius-md)",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <span className="inst-desc" style={{ fontWeight: 600 }}>{inst.description}</span>
                            <span className="inst-number" style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              Cuota {inst.installment_number} de {inst.total_installments} — Vence: {formatDate(inst.due_date)}
                            </span>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-md)" }}>
                            <span className="inst-amount" style={{ fontWeight: 600 }}>
                              {formatCurrency(inst.amount)}
                            </span>
                            {!inst.is_paid ? (
                              <div style={{ display: "flex", gap: "0.25rem" }}>
                                <button
                                  onClick={() => handlePayInstallment(inst)}
                                  className="btn btn-primary"
                                  style={{ padding: "0.25rem 0.625rem", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
                                >
                                  Pagar
                                </button>
                                <button
                                  onClick={() => handleDeleteInstallmentPurchase(inst)}
                                  className="btn btn-danger"
                                  style={{ padding: "0.25rem", borderRadius: "var(--radius-sm)" }}
                                  title="Eliminar Plan Completo"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            ) : (
                              <span
                                className="badge badge-income"
                                style={{ display: "flex", alignItems: "center", gap: "0.125rem", fontSize: "0.65rem" }}
                              >
                                <Check size={10} /> Pagada
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state" style={{ padding: "var(--space-xl) 0" }}>
                      <AlertCircle size={32} />
                      <p style={{ fontSize: "0.875rem" }}>No hay cuotas programadas para este mes en este método de pago.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-state">
              <CreditCard size={48} />
              <p>No tienes métodos de pago configurados.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="page-section page-section-narrow animate-in">
        <div className="section-header">
          <h2>NUEVO MÉTODO</h2>
        </div>

        <div className="scroll-area">
          <form onSubmit={handleSubmit} className="form-panel">
            {/* Alias */}
            <div className="form-group">
              <label htmlFor="pm-alias">Alias de la Cuenta/Tarjeta</label>
              <input
                id="pm-alias"
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Ej. Visa Santander, Efectivo, MP"
                required
              />
            </div>

            {/* Type Toggler */}
            <div className="form-group">
              <label>Tipo de Cuenta</label>
              <div className="type-toggle">
                <button
                  type="button"
                  className={methodType === "credit" ? "active-expense" : ""}
                  onClick={() => setMethodType("credit")}
                >
                  TARJETA DE CRÉDITO
                </button>
                <button
                  type="button"
                  className={methodType === "personal" ? "active-income" : ""}
                  onClick={() => setMethodType("personal")}
                >
                  DÉBITO / EFECTIVO
                </button>
              </div>
            </div>

            {methodType === "credit" ? (
              <>
                {/* Credit Limit */}
                <div className="form-group">
                  <label htmlFor="pm-limit">Límite de Crédito</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="pm-limit"
                      type="text"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(formatCurrencyInput(e.target.value))}
                      placeholder="Ej. 300.000"
                      required
                      style={{ paddingRight: "2.25rem" }}
                    />
                    {creditLimit && !creditLimit.includes(",") && (
                      <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                        ,00
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  {/* Closing Day */}
                  <div className="form-group">
                    <label htmlFor="pm-closing">Día de Cierre</label>
                    <input
                      id="pm-closing"
                      type="number"
                      min="1"
                      max="31"
                      value={closingDay}
                      onChange={(e) => setClosingDay(e.target.value)}
                      placeholder="Día"
                    />
                  </div>

                  {/* Due Day */}
                  <div className="form-group">
                    <label htmlFor="pm-due">Día de Vencimiento</label>
                    <input
                      id="pm-due"
                      type="number"
                      min="1"
                      max="31"
                      value={dueDay}
                      onChange={(e) => setDueDay(e.target.value)}
                      placeholder="Día"
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Personal Limit */
              <div className="form-group">
                <label htmlFor="pm-plimit">Límite Personal (Presupuesto Global Opcional)</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="pm-plimit"
                    type="text"
                    value={personalLimit}
                    onChange={(e) => setPersonalLimit(formatCurrencyInput(e.target.value))}
                    placeholder="Ej. 150.000"
                    style={{ paddingRight: "2.25rem" }}
                  />
                  {personalLimit && !personalLimit.includes(",") && (
                    <span style={{ position: "absolute", right: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}>
                      ,00
                    </span>
                  )}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ marginTop: "var(--space-sm)" }}>
              <Plus size={16} /> Agregar Método de Pago
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
