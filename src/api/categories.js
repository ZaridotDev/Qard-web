import supabase from "../lib/supabaseClient";

export async function getCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select(`*, budgets(id, amount)`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function insertCategory({ name, color, icon, type }) {
  const { data, error } = await supabase
    .from("categories")
    .insert({ name, color, icon, type })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function insertBudget({ category_id, amount }) {
  const { data, error } = await supabase
    .from("budgets")
    .insert({ category_id, amount, period: "monthly", start_date: new Date().toISOString().split("T")[0] })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateBudget(id, newAmount) {
  const { error } = await supabase
    .from("budgets")
    .update({ amount: newAmount })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteBudget(id) {
  const { error } = await supabase.from("budgets").delete().eq("id", id);
  if (error) throw error;
}
