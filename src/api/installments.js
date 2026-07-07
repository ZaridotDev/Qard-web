import supabase from "../lib/supabaseClient";

export async function createInstallments({ payment_method_id, amount, description, total_installments }) {
  const installment_amount = amount / total_installments;

  const installments = Array.from({ length: total_installments }, (_, i) => {
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    return {
      payment_method_id,
      installment_number: i + 1,
      total_installments,
      amount: installment_amount,
      description,
      due_date: dueDate.toISOString().split("T")[0],
      is_paid: false,
      transaction_id: null,
    };
  });

  const { error } = await supabase.from("installments").insert(installments);
  if (error) throw error;
}

export async function markInstallmentAsPaid(installmentId, transactionId) {
  const { error } = await supabase
    .from("installments")
    .update({
      is_paid: true,
      paid_date: new Date().toISOString().split("T")[0],
      paid_transaction_id: transactionId,
    })
    .eq("id", installmentId);

  if (error) throw error;
}

export async function markManyInstallmentsAsPaid(ids, transactionId) {
  const { error } = await supabase
    .from("installments")
    .update({
      is_paid: true,
      paid_date: new Date().toISOString().split("T")[0],
      paid_transaction_id: transactionId,
    })
    .in("id", ids);

  if (error) throw error;
}

export async function deleteInstallmentsByDescription(description, paymentMethodId) {
  const { data } = await supabase
    .from("installments")
    .select("id")
    .eq("description", description)
    .eq("payment_method_id", paymentMethodId);

  if (data && data.length > 0) {
    const ids = data.map((i) => i.id);
    const { error } = await supabase.from("installments").delete().in("id", ids);
    if (error) throw error;
  }
}
