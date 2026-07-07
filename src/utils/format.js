export function formatCurrency(amount) {
  const val = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(val || 0);
}

export function formatDate(dateString) {
  if (!dateString) return "";
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function formatCurrencyInput(value) {
  if (value === null || value === undefined || value === "") return "";
  let str = String(value);

  // Normalize trailing dot as decimal separator
  if (str.endsWith(".")) {
    str = str.slice(0, -1) + ",";
  }

  // Remove thousands separator dots
  let clean = str.replace(/\./g, "");

  // Split into integer and decimal parts
  let separator = clean.includes(",") ? "," : null;
  let integerPart = clean;
  let decimalPart = null;

  if (separator) {
    let idx = clean.indexOf(separator);
    integerPart = clean.substring(0, idx);
    decimalPart = clean.substring(idx + 1);
  }

  // Format integer part
  integerPart = integerPart.replace(/\D/g, "");
  if (integerPart.length > 1) {
    integerPart = integerPart.replace(/^0+/, "");
  }
  if (integerPart === "") {
    integerPart = "0";
  }

  let formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  if (separator !== null) {
    if (decimalPart === "") {
      return `${formattedInteger},`;
    }
    decimalPart = decimalPart.replace(/\D/g, "").substring(0, 2);
    return `${formattedInteger},${decimalPart}`;
  }

  return formattedInteger;
}

export function parseCurrencyInput(formattedValue) {
  if (!formattedValue) return 0;
  let clean = String(formattedValue).replace(/\./g, "");
  clean = clean.replace(/,/g, ".");
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}
