import { useState, useEffect } from "react";
import useFinanceStore from "../../store/financeStore";
import { formatCurrency, formatDate, formatCurrencyInput, parseCurrencyInput } from "../../utils/format";
import { Trash2, Plus, ShoppingBag, CreditCard, Sparkles } from "lucide-react";

export default function TransactionsPage() {
  const {
    transactions,
    categories,
    paymentMethods,
    addTransaction,
    removeTransaction,
    addInstallmentPurchase,
    monthRange,
  } = useFinanceStore();

  // Form State
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethodId, setPaymentMethodId] = useState("");

  // Installments state
  const [isInstallment, setIsInstallment] = useState(false);
  const [installmentsCount, setInstallmentsCount] = useState(3);

  // Shopping Items state
  const [isShoppingItems, setIsShoppingItems] = useState(false);
  const [shoppingItems, setShoppingItems] = useState([]);
  const [siDesc, setSiDesc] = useState("");
  const [siQty, setSiQty] = useState(1);
  const [siPrice, setSiPrice] = useState("");

  // Credit card payment methods only
  const creditCards = paymentMethods.filter((pm) => pm.credit_limit !== null);

  // Synchronize main amount when shopping items update
  useEffect(() => {
    if (isShoppingItems) {
      const total = shoppingItems.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      );
      setAmount(total > 0 ? formatCurrencyInput(total.toString()) : "");
    }
  }, [shoppingItems, isShoppingItems]);

  // Add item to breakdown
  const handleAddShoppingItem = (e) => {
    e.preventDefault();
    if (!siDesc || !siPrice) return;
    const newItem = {
      id: Date.now(),
      description: siDesc,
      quantity: parseInt(siQty) || 1,
      price: parseCurrencyInput(siPrice) || 0,
    };
    setShoppingItems([...shoppingItems, newItem]);
    setSiDesc("");
    setSiQty(1);
    setSiPrice("");
  };

  // Remove item from breakdown
  const handleRemoveShoppingItem = (itemId) => {
    setShoppingItems(shoppingItems.filter((item) => item.id !== itemId));
  };

  // Submit main transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !amount || !categoryId || !date) return;

    try {
      const finalAmount = parseCurrencyInput(amount);

      if (isInstallment && type === "expense" && paymentMethodId) {
        // Create credit card installments
        await addInstallmentPurchase({
          payment_method_id: paymentMethodId,
          amount: finalAmount,
          description,
          total_installments: parseInt(installmentsCount),
        });
      } else {
        // Normal transaction
        const txData = {
          type,
          description,
          amount: finalAmount,
          category_id: categoryId,
          transaction_date: date,
          payment_method_id: paymentMethodId || null,
        };

        // Include shopping items if active
        if (isShoppingItems && shoppingItems.length > 0) {
          txData.metadata = { shopping_items: shoppingItems };
        }

        await addTransaction(txData);
      }

      // Reset Form
      setDescription("");
      setAmount("");
      setCategoryId("");
      setPaymentMethodId("");
      setIsInstallment(false);
      setIsShoppingItems(false);
      setShoppingItems([]);
    } catch (err) {
      console.error("Error creating transaction:", err);
    }
  };

  return (
    <>
      {/* Left Section - Transactions List */}
      <div className="page-section page-section-wide animate-in">
        <div className="section-header">
          <h2>HISTORIAL DE TRANSACCIONES</h2>
          <span className="text-secondary" style={{ fontSize: "0.875rem" }}>
            {transactions.length} transacciones en {monthRange.label}
          </span>
        </div>

        <div className="scroll-area">
          {transactions.length > 0 ? (
            <div className="tx-list">
              {transactions.map((tx) => (
                <div key={tx.id} className="tx-row">
                  <div className={`tx-dot ${tx.type}`} />
                  <div className="tx-desc" style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span>{tx.description}</span>
                      {tx.metadata?.shopping_items?.length > 0 && (
                        <span className="badge badge-neutral" style={{ fontSize: "0.6rem", padding: "0.125rem 0.375rem" }} title="Tiene desglose de items">
                          <ShoppingBag size={8} /> Desglosado
                        </span>
                      )}
                    </div>
                    <span className="tx-category" style={{ color: tx.categories?.color || "var(--text-muted)" }}>
                      {tx.categories?.name || "Sin Categoría"}
                    </span>
                  </div>
                  <div className="tx-date">{formatDate(tx.transaction_date)}</div>
                  <div className={`tx-amount ${tx.type}`}>
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
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
              <Sparkles size={48} />
              <p>No se encontraron transacciones para el período actual.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Section - Form Panel */}
      <div className="page-section page-section-narrow animate-in">
        <div className="section-header">
          <h2>NUEVO REGISTRO</h2>
        </div>

        <div className="scroll-area">
          <form onSubmit={handleSubmit} className="form-panel">
            {/* Income / Expense Toggle */}
            <div className="type-toggle">
              <button
                type="button"
                className={type === "income" ? "active-income" : ""}
                onClick={() => {
                  setType("income");
                  setIsInstallment(false);
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
              <label htmlFor="tx-desc">Descripción</label>
              <input
                id="tx-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ej. Súper Chino, Sueldo, etc."
                required
              />
            </div>

            {/* Category Selector */}
            <div className="form-group">
              <label htmlFor="tx-category">Categoría</label>
              <select
                id="tx-category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Seleccionar Categoría</option>
                {categories
                  .filter((cat) => (cat.type || "expense") === type)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label htmlFor="tx-date">Fecha</label>
              <input
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* Optional Payment Method */}
            <div className="form-group">
              <label htmlFor="tx-pm">Método de Pago (Opcional)</label>
              <select
                id="tx-pm"
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
              >
                <option value="">Ninguno / Efectivo</option>
                {paymentMethods.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.alias} {pm.credit_limit ? "(Crédito)" : "(Débito/Efectivo)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Credit Card Installments Toggle */}
            {type === "expense" && creditCards.some((cc) => cc.id === paymentMethodId) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", borderTop: "1px dashed var(--border-default)", paddingTop: "var(--space-md)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={isInstallment}
                    onChange={(e) => setIsInstallment(e.target.checked)}
                  />
                  <span>Comprar en cuotas</span>
                </label>

                {isInstallment && (
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="tx-installments">Cuotas</label>
                      <select
                        id="tx-installments"
                        value={installmentsCount}
                        onChange={(e) => setInstallmentsCount(parseInt(e.target.value))}
                      >
                        {[1, 2, 3, 6, 9, 12, 18, 24].map((n) => (
                          <option key={n} value={n}>
                            {n} cuotas
                          </option>
                        ))}
                      </select>
                    </div>
                    {amount && (
                      <div className="form-group" style={{ justifyContent: "center" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Valor cuota:</span>
                        <strong className="text-expense" style={{ fontSize: "1.125rem" }}>
                          {formatCurrency(parseFloat(amount) / installmentsCount)}
                        </strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Shopping Items Toggle */}
            {!isInstallment && (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-sm)", borderTop: "1px dashed var(--border-default)", paddingTop: "var(--space-md)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={isShoppingItems}
                    onChange={(e) => setIsShoppingItems(e.target.checked)}
                  />
                  <span>Desglosar compra (Lista de ítems)</span>
                </label>

                {isShoppingItems && (
                  <div className="shopping-items">
                    {/* Item list */}
                    {shoppingItems.map((item) => (
                      <div key={item.id} className="shopping-item-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8125rem", background: "rgba(0,0,0,0.15)", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>
                        <span>{item.description} (x{item.quantity})</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveShoppingItem(item.id)}
                            style={{ background: "none", border: "none", color: "var(--expense-color)", cursor: "pointer" }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Quick Add Row */}
                    <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.25rem" }}>
                      <input
                        type="text"
                        placeholder="Art."
                        value={siDesc}
                        onChange={(e) => setSiDesc(e.target.value)}
                        style={{ flex: 2, padding: "0.25rem 0.5rem", fontSize: "0.8125rem" }}
                      />
                      <input
                        type="number"
                        placeholder="Cant."
                        min="1"
                        value={siQty}
                        onChange={(e) => setSiQty(e.target.value)}
                        style={{ width: "3.5rem", padding: "0.25rem 0.5rem", fontSize: "0.8125rem", textAlign: "center" }}
                      />
                      <div style={{ position: "relative", flex: 1.2 }}>
                        <input
                          type="text"
                          placeholder="Precio"
                          value={siPrice}
                          onChange={(e) => setSiPrice(formatCurrencyInput(e.target.value))}
                          style={{ width: "100%", padding: "0.25rem 1.5rem 0.25rem 0.5rem", fontSize: "0.8125rem" }}
                        />
                        {siPrice && !siPrice.includes(",") && (
                          <span style={{ position: "absolute", right: "0.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none", fontSize: "0.8125rem" }}>
                            ,00
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handleAddShoppingItem}
                        className="btn btn-secondary btn-icon"
                        style={{ width: "2rem", height: "2rem", flexShrink: 0 }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Amount */}
            <div className="form-group">
              <label htmlFor="tx-amount">Monto Total</label>
              <div style={{ position: "relative" }}>
                <input
                  id="tx-amount"
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(formatCurrencyInput(e.target.value))}
                  placeholder="0,00"
                  required
                  disabled={isShoppingItems}
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

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary" style={{ marginTop: "var(--space-sm)" }}>
              {isInstallment ? (
                <>
                  <CreditCard size={16} /> Crear Compra en Cuotas
                </>
              ) : (
                <>
                  <Plus size={16} /> Registrar Transacción
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
