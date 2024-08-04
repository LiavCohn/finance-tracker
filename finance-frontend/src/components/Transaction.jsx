import "../styles/transaction.css"

function Transaction({transaction,onDelete}) {
  const formattedDate = new Date(transaction.date).toLocaleDateString("en-US")

  return (
      <div className="transaction-container">
          <p className="transaction-category">Category: {transaction.category}</p>
          <p className="transaction-type">Type: {transaction.type}</p>
          <p className="transaction-amount">{ transaction.amount}$</p>
          <p className="transaction-date">{formattedDate}</p>
          <button className="delete-btn" onClick={() => onDelete(transaction._id)}>
              Delete
          </button>
          
      </div>
  )

}

export default Transaction;
