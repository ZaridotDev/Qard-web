import '../styles/HomeStyles.css'
import { useTransactions } from '../hooks/useTransactions.jsx';


export const TransactionsList = () => {

  const {transactions, loading, error} = useTransactions();
  if (loading) return <p>Cargando transacciones...</p>;
  if (error) return <p>Error cargando transacciones.</p>;

  return (
    <>
      {transactions.map((tx) => (
        <article key={tx.id} className="transaction-card">
          <div />
          <span className="desc">{ 'egreso'}</span> 
          <span className="amount">{ '$0.00'}</span>
          <span className="date">{ '00/00'}</span>
        </article>
      ))}
    </>
  );
  
}
