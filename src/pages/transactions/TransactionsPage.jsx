import { useState } from "react";
import TransactionForm from "../../components/TransactionForm";
import useFinanceStore from "../../store/financeStore";
import { formatCurrency, formatDate } from "../../utils/format";
import { Trash2, ShoppingBag, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

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

  const [expandedTxId, setExpandedTxId] = useState(null);

  const toggleDetails = (id) => {
    setExpandedTxId(expandedTxId === id ? null : id);
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
                <div key={tx.id} className="tx-wrapper" style={{ display: "flex", flexDirection: "column" }}>
                  <div className="tx-row">
                    <div className={`tx-dot ${tx.type}`} />
                    <div className="tx-desc" style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        {tx.shopping_items?.length > 0 ? (
                          <button onClick={() => toggleDetails(tx.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", padding: 0, color: "inherit", fontWeight: "inherit" }}>
                            {tx.description}
                            {expandedTxId === tx.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        ) : (
                          <span>{tx.description}</span>
                        )}
                        {tx.shopping_items?.length > 0 && (
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
                  {expandedTxId === tx.id && tx.shopping_items && (
                    <div className="tx-details" style={{ padding: "0.5rem 1rem", background: "rgba(255,255,255,0.05)", fontSize: "0.8125rem", margin: "0 1rem 0.5rem", borderRadius: "4px" }}>
                      {tx.shopping_items.map((item) => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>{item.description} (x{item.quantity})</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
          <TransactionForm
            categories={categories}
            paymentMethods={paymentMethods}
            onAddTransaction={addTransaction}
            onAddInstallmentPurchase={addInstallmentPurchase}
          />
        </div>
      </div>
    </>
  );
}
