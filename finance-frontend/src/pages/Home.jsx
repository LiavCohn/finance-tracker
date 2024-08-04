import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import Transaction from "../components/Transaction";
import '../styles/style.css';

function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [sortOrder,setSortOrder] = useState('Ascending')
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const deleteTransaction= async (id) => {
    try {
      const res = await api.delete(`transactions/${id}/`)
        if (res.status == 200) {
          setTransactions((prevTransactions) => prevTransactions.filter(trans => trans._id !== id)); // Remove note from state
            alert("Transactions deleted!")
        }
        else {
            alert("Failed to delete transaction")
        }
    } catch (error) {
        alert("Failed to delete transaction ",error)
    }
}
  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions');
      const sortedTransactions = response.data.sort((a, b) => {
        if (sortOrder === 'Ascending') {
          return a.amount - b.amount;
        } else {
          return b.amount - a.amount;
        }
      });

      setTransactions(sortedTransactions);

    } catch (error) {
      console.log({error});
      if (error.response && error.response.status === 401) {
        navigate('/login'); // Redirect to login if token is invalid
      }
    }
  };

  const createTransaction = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/transactions', { type, amount, category });

      setType('income');
      setAmount('');
      setCategory('');

      const newTransactions = [...transactions, res.data]
      setTransactions(newTransactions);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login'); // Redirect to login if token is invalid
      }
    }
  };



  const handleSortChange = (e) => {
    setSortOrder(e.target.value)
    const sortedTransactions = [...transactions].sort((a, b) => {
      if (e.target.value === 'Ascending') {
        return a.amount - b.amount;
      } else {
        return b.amount - a.amount;
      }
    });
    setTransactions(sortedTransactions)
  }

  return (
    <div className="home-page">
      <h2>Transactions</h2>
      <label>
        Sort by amount:
        <select value={sortOrder} onChange={handleSortChange}>
          <option value="Ascending">Ascending</option>
          <option value="Descending">Descending</option>
        </select>
      </label>
      <div className='all-transactions'>
        {transactions.map((transaction) => (
          <Transaction transaction={transaction} onDelete={deleteTransaction} key={transaction._id} />
        ))}
      </div>
      <h2>Add Transaction</h2>
      <form onSubmit={createTransaction}>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </label>
        <br />
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Category:
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Transaction</button>
      </form>
    </div>
  );
}

export default HomePage;
