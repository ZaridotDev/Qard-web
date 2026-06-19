import {useState, useEffect} from 'react';
import supabase from '../lib/supabaseClient';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase.from('transactions').select('*');
        if (error) throw error;
        if (!isMounted) return
        setTransactions(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    return () => {
      isMounted = false;
    };
  }, []);

  return { transactions, loading, error };
};