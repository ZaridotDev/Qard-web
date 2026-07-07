import { create } from "zustand";
import supabase from "../lib/supabaseClient";
import { getTransactionsByMonth, insertTransaction, deleteTransaction } from "../api/transactions";
import { getCategories, insertCategory, deleteCategory, insertBudget, updateBudget, deleteBudget } from "../api/categories";
import { getPaymentMethods, insertPaymentMethod } from "../api/paymentMethods";
import { getRecurringTransactions, insertRecurringTransaction, deleteRecurringTransaction } from "../api/recurrents";
import { createInstallments, markInstallmentAsPaid, deleteInstallmentsByDescription } from "../api/installments";

/* ─── Helpers ─────────────────────────────────── */
function getMonthRange(date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const start = new Date(y, m, 1);
  const end   = new Date(y, m + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end:   end.toISOString().split("T")[0],
    label: start.toLocaleDateString("es-AR", { month: "long", year: "numeric" }),
  };
}

function generateMockData(currentDate) {
  const y = currentDate.getFullYear();
  const m = String(currentDate.getMonth() + 1).padStart(2, "0");

  const categories = [
    { id: "cat-1", name: "Sueldo",          color: "#4ade80", icon: "TrendingUp",  type: "income",  budgets: [] },
    { id: "cat-2", name: "Comida",          color: "#f87171", icon: "Utensils",    type: "expense", budgets: [{ id: "b-1", amount: 60000 }] },
    { id: "cat-3", name: "Transporte",      color: "#60a5fa", icon: "Car",         type: "expense", budgets: [] },
    { id: "cat-4", name: "Servicios",       color: "#fbbf24", icon: "Zap",         type: "expense", budgets: [{ id: "b-2", amount: 40000 }] },
    { id: "cat-5", name: "Entretenimiento", color: "#c084fc", icon: "Tv",          type: "expense", budgets: [{ id: "b-3", amount: 15000 }] },
    { id: "cat-6", name: "Educación",       color: "#2dd4bf", icon: "BookOpen",    type: "expense", budgets: [] },
  ];

  const paymentMethods = [
    { id: "pm-1", alias: "Visa Santander", credit_limit: 500000, personal_limit: null, closing_day: 20, due_day: 28 },
    { id: "pm-2", alias: "Efectivo",       credit_limit: null,   personal_limit: 100000, closing_day: null, due_day: null },
    { id: "pm-3", alias: "Mercado Pago",   credit_limit: null,   personal_limit: 200000, closing_day: null, due_day: null },
  ];

  const transactions = [
    { id: "tx-1", type: "income",  amount: 650000, description: "Sueldo Mensual",      category_id: "cat-1", transaction_date: `${y}-${m}-05`, categories: categories[0] },
    { id: "tx-2", type: "expense", amount: 48000,  description: "Supermercado Coto",   category_id: "cat-2", transaction_date: `${y}-${m}-10`, categories: categories[1] },
    { id: "tx-3", type: "expense", amount: 15000,  description: "Nafta Shell",         category_id: "cat-3", transaction_date: `${y}-${m}-12`, categories: categories[2] },
    { id: "tx-4", type: "expense", amount: 8500,   description: "Netflix Premium",     category_id: "cat-5", transaction_date: `${y}-${m}-01`, categories: categories[4] },
    { id: "tx-5", type: "expense", amount: 12000,  description: "Factura Luz Edesur",  category_id: "cat-4", transaction_date: `${y}-${m}-14`, categories: categories[3] },
  ];

  const recurrents = [
    { id: "rec-1", type: "expense", amount: 8500,   description: "Netflix Premium",  category_id: "cat-5", frequency: "monthly", start_date: "2026-01-01", categories: categories[4] },
    { id: "rec-2", type: "income",  amount: 650000, description: "Sueldo Mensual",   category_id: "cat-1", frequency: "monthly", start_date: "2026-01-01", categories: categories[0] },
  ];

  const installments = [
    { id: "inst-1", payment_method_id: "pm-1", installment_number: 2, total_installments: 6, amount: 12500, due_date: `${y}-${m}-28`, is_paid: false, description: "Smart TV Noblex" },
    { id: "inst-2", payment_method_id: "pm-1", installment_number: 3, total_installments: 3, amount: 8000,  due_date: `${y}-${m}-28`, is_paid: true,  description: "Zapatillas Nike"  },
  ];

  return { categories, paymentMethods, transactions, recurrents, installments };
}

/* ─── Store ───────────────────────────────────── */
const now = new Date();

const useFinanceStore = create((set, get) => ({
  /* Settings */
  isDemoMode: false,

  /* Month navigation */
  currentDate: now,
  monthRange:  getMonthRange(now),

  setMonth: (date) => {
    const range = getMonthRange(date);
    set({ currentDate: date, monthRange: range });
    if (get().isDemoMode) {
      const mock = generateMockData(date);
      set({ transactions: mock.transactions, installments: mock.installments });
    } else {
      get().fetchTransactions();
      get().fetchInstallments();
    }
  },
  prevMonth: () => {
    const d = new Date(get().currentDate);
    d.setMonth(d.getMonth() - 1);
    get().setMonth(d);
  },
  nextMonth: () => {
    const d = new Date(get().currentDate);
    d.setMonth(d.getMonth() + 1);
    get().setMonth(d);
  },

  /* State */
  transactions:          [],
  transactionsLoading:   false,
  categories:            [],
  categoriesLoading:     false,
  paymentMethods:        [],
  paymentMethodsLoading: false,
  recurrents:            [],
  recurrentsLoading:     false,
  installments:          [],
  installmentsLoading:   false,

  /* Fetch helpers */
  fetchTransactions: async () => {
    if (get().isDemoMode) return;
    set({ transactionsLoading: true });
    try {
      const { start, end } = get().monthRange;
      const data = await getTransactionsByMonth(start, end);
      set({ transactions: data || [], transactionsLoading: false });
    } catch (err) {
      console.warn("fetchTransactions failed, entering demo mode", err);
      get().enterDemoMode();
    }
  },

  fetchCategories: async () => {
    if (get().isDemoMode) return;
    set({ categoriesLoading: true });
    try {
      const data = await getCategories();
      set({ categories: data || [], categoriesLoading: false });
    } catch (err) {
      console.warn("fetchCategories failed, entering demo mode", err);
      get().enterDemoMode();
    }
  },

  fetchPaymentMethods: async () => {
    if (get().isDemoMode) return;
    set({ paymentMethodsLoading: true });
    try {
      const data = await getPaymentMethods();
      set({ paymentMethods: data || [], paymentMethodsLoading: false });
    } catch (err) {
      console.warn("fetchPaymentMethods failed, entering demo mode", err);
      get().enterDemoMode();
    }
  },

  fetchRecurrents: async () => {
    if (get().isDemoMode) return;
    set({ recurrentsLoading: true });
    try {
      const data = await getRecurringTransactions();
      set({ recurrents: data || [], recurrentsLoading: false });
    } catch (err) {
      console.warn("fetchRecurrents failed, entering demo mode", err);
      get().enterDemoMode();
    }
  },

  fetchInstallments: async () => {
    if (get().isDemoMode) return;
    set({ installmentsLoading: true });
    try {
      const { start, end } = get().monthRange;
      const { data, error } = await supabase
        .from("installments")
        .select("*")
        .gte("due_date", start)
        .lte("due_date", end);
      if (error) throw error;
      set({ installments: data || [], installmentsLoading: false });
    } catch (err) {
      console.warn("fetchInstallments failed, entering demo mode", err);
      get().enterDemoMode();
    }
  },

  enterDemoMode: () => {
    const mock = generateMockData(get().currentDate);
    set({
      isDemoMode:            true,
      categories:            mock.categories,
      paymentMethods:        mock.paymentMethods,
      transactions:          mock.transactions,
      recurrents:            mock.recurrents,
      installments:          mock.installments,
      transactionsLoading:   false,
      categoriesLoading:     false,
      paymentMethodsLoading: false,
      recurrentsLoading:     false,
      installmentsLoading:   false,
    });
  },

  /* ── CRUD ─────────────────────────────────── */
  addTransaction: async (tx) => {
    if (get().isDemoMode) {
      const newTx = {
        id: `tx-${Date.now()}`,
        ...tx,
        categories: get().categories.find((c) => c.id === tx.category_id) || null,
      };
      set((s) => ({ transactions: [newTx, ...s.transactions] }));
      return newTx;
    }
    const data = await insertTransaction(tx);
    await get().fetchTransactions();
    return data;
  },

  removeTransaction: async (id) => {
    if (get().isDemoMode) {
      set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));
      return;
    }
    await deleteTransaction(id);
    await get().fetchTransactions();
  },

  addCategory: async (cat) => {
    if (get().isDemoMode) {
      const newCat = { id: `cat-${Date.now()}`, budgets: [], ...cat };
      set((s) => ({ categories: [newCat, ...s.categories] }));
      return newCat;
    }
    const data = await insertCategory(cat);
    await get().fetchCategories();
    return data;
  },

  removeCategory: async (id) => {
    if (get().isDemoMode) {
      set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
      return;
    }
    await deleteCategory(id);
    await get().fetchCategories();
  },

  addPaymentMethod: async (pm) => {
    if (get().isDemoMode) {
      const newPm = { id: `pm-${Date.now()}`, ...pm };
      set((s) => ({ paymentMethods: [newPm, ...s.paymentMethods] }));
      return newPm;
    }
    const data = await insertPaymentMethod(pm);
    await get().fetchPaymentMethods();
    return data;
  },

  addBudget: async (catId, amount) => {
    if (get().isDemoMode) {
      set((s) => ({
        categories: s.categories.map((c) =>
          c.id === catId ? { ...c, budgets: [{ id: `b-${Date.now()}`, amount: parseFloat(amount) }] } : c
        ),
      }));
      return;
    }
    await insertBudget({ category_id: catId, amount });
    await get().fetchCategories();
  },

  updateBudget: async (budgetId, catId, newAmount) => {
    if (get().isDemoMode) {
      set((s) => ({
        categories: s.categories.map((c) =>
          c.id === catId ? { ...c, budgets: [{ id: budgetId, amount: parseFloat(newAmount) }] } : c
        ),
      }));
      return;
    }
    await updateBudget(budgetId, newAmount);
    await get().fetchCategories();
  },

  deleteBudget: async (budgetId, catId) => {
    if (get().isDemoMode) {
      set((s) => ({
        categories: s.categories.map((c) => (c.id === catId ? { ...c, budgets: [] } : c)),
      }));
      return;
    }
    await deleteBudget(budgetId);
    await get().fetchCategories();
  },

  addRecurring: async (rec) => {
    if (get().isDemoMode) {
      const newRec = {
        id: `rec-${Date.now()}`,
        ...rec,
        categories: get().categories.find((c) => c.id === rec.category_id) || null,
      };
      set((s) => ({ recurrents: [newRec, ...s.recurrents] }));
      return newRec;
    }
    const data = await insertRecurringTransaction(rec);
    await get().fetchRecurrents();
    return data;
  },

  removeRecurring: async (id) => {
    if (get().isDemoMode) {
      set((s) => ({ recurrents: s.recurrents.filter((r) => r.id !== id) }));
      return;
    }
    await deleteRecurringTransaction(id);
    await get().fetchRecurrents();
  },

  addInstallmentPurchase: async ({ payment_method_id, amount, description, total_installments }) => {
    if (get().isDemoMode) {
      const perCuota = amount / total_installments;
      const base = get().currentDate;
      const newInsts = Array.from({ length: total_installments }, (_, i) => {
        const d = new Date(base);
        d.setMonth(d.getMonth() + i);
        return {
          id: `inst-${Date.now()}-${i}`,
          payment_method_id,
          installment_number: i + 1,
          total_installments,
          amount: perCuota,
          description,
          due_date: d.toISOString().split("T")[0],
          is_paid: false,
        };
      });
      set((s) => ({ installments: [...s.installments, ...newInsts] }));
      return;
    }
    await createInstallments({ payment_method_id, amount, description, total_installments });
    await get().fetchInstallments();
  },

  payInstallment: async (instId, transactionData) => {
    if (get().isDemoMode) {
      set((s) => ({
        installments: s.installments.map((inst) =>
          inst.id === instId ? { ...inst, is_paid: true } : inst
        ),
      }));
      if (transactionData) await get().addTransaction(transactionData);
      return;
    }
    const tx = await insertTransaction(transactionData);
    await markInstallmentAsPaid(instId, tx.id);
    await get().fetchInstallments();
    await get().fetchTransactions();
  },

  removeInstallmentPurchase: async (description, paymentMethodId) => {
    if (get().isDemoMode) {
      set((s) => ({
        installments: s.installments.filter(
          (inst) => !(inst.description === description && inst.payment_method_id === paymentMethodId)
        ),
      }));
      return;
    }
    await deleteInstallmentsByDescription(description, paymentMethodId);
    await get().fetchInstallments();
  },

  /* Init */
  initFinance: async () => {
    try {
      await Promise.all([
        get().fetchTransactions(),
        get().fetchCategories(),
        get().fetchPaymentMethods(),
        get().fetchRecurrents(),
        get().fetchInstallments(),
      ]);
    } catch (err) {
      console.warn("initFinance failed, entering demo mode", err);
      get().enterDemoMode();
    }
  },
}));

export default useFinanceStore;
