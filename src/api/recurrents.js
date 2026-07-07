import supabase from "../lib/supabaseClient";

export async function getRecurringTransactions() {
  const { data, error } = await supabase
    .from("recurring_transactions")
    .select("*, categories(name, color, icon)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function insertRecurringTransaction({ type, amount, description, category_id, frequency, start_date }) {
  const { data, error } = await supabase
    .from("recurring_transactions")
    .insert({
      type,
      amount,
      description,
      category_id: category_id || null,
      frequency,
      start_date,
      next_occurrence: start_date,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRecurringTransaction(id) {
  const { error } = await supabase
    .from("recurring_transactions")
    .delete()
    .eq("id", id);

  if (error) throw error;
}
