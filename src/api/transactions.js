import supabase from "../lib/supabaseClient";

export async function getTransactionsByMonth(startDate, endDate) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, color, icon), shopping_items(*)")
    .gte("transaction_date", startDate)
    .lte("transaction_date", endDate)
    .order("created_at", { ascending: false })
    .order("transaction_date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function insertTransaction(transaction, items = []) {
  const { data, error } = await supabase
    .from("transactions")
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;

  if (items.length > 0) {
    const itemsToInsert = items.map(item => ({
      transaction_id: data.id,
      description: item.description,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from("shopping_items")
      .insert(itemsToInsert);

    if (itemsError) throw itemsError;
  }

  return data;
}

export async function deleteTransaction(id) {
  // First reset any installments linked to this transaction
  await supabase
    .from("installments")
    .update({ is_paid: false, paid_date: null, paid_transaction_id: null })
    .eq("paid_transaction_id", id);

  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}
