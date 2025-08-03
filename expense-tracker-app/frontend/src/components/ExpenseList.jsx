import ExpenseCard from "./ExpenseCard";

const ExpenseList = ({ expenses, currency = '₹' }) => {
  return (
    <>
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} currency={currency} />
      ))}
    </>
  );
};

export default ExpenseList;
