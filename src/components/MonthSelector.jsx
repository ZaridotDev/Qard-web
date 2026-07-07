import { ChevronLeft, ChevronRight } from "lucide-react";
import useFinanceStore from "../store/financeStore";

export default function MonthSelector() {
  const { monthRange, prevMonth, nextMonth } = useFinanceStore();

  return (
    <div className="month-selector">
      <button onClick={prevMonth} aria-label="Mes anterior">
        <ChevronLeft size={18} />
      </button>
      <span className="month-label">{monthRange.label}</span>
      <button onClick={nextMonth} aria-label="Mes siguiente">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
