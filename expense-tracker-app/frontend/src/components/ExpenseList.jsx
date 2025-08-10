import ExpenseCard from "./ExpenseCard";

const ExpenseList = ({ expenses, currency = '₹', onUpdate, onDelete }) => {
  return (
    <>
      {expenses.map((expense) => (
        <ExpenseCard 
          key={expense.id} 
          expense={expense} 
          currency={currency}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

export default ExpenseList;
