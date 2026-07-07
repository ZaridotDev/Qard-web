import supabase from "../lib/supabaseClient";

export async function getPaymentMethods() {
  const { data, error } = await supabase
    .from("payment_methods")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function insertPaymentMethod({ alias, closing_day, due_day, credit_limit, personal_limit }) {
  const { data, error } = await supabase
    .from("payment_methods")
    .insert({ alias, closing_day, due_day, credit_limit, personal_limit })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPaymentMethodsWithInstallments(startDate, endDate) {
  const { data, error } = await supabase
    .from("payment_methods")
    .select(`
      *,
      installments!inner (
        id,
        installment_number,
        total_installments,
        amount,
        due_date,
        is_paid,
        description,
        paid_transaction_id
      )
    `)
    .gte("installments.due_date", startDate)
    .lte("installments.due_date", endDate)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
