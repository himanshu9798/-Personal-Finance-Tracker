import React, { useState, useEffect } from "react";
import "./App.css";
import Swal from "sweetalert2";

function App() {
  const [salary, setSalary] = useState("");
  const [isSalaryEntered, setIsSalaryEntered] = useState(false);
  const [saving, setSaving] = useState("");
  const [expense, setExpense] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [expenseList, setExpenseList] = useState([]);
  const [error, setError] = useState(""); // For error messages

  // Load expenses and salary from localStorage
  useEffect(() => {
    const storedSalary = localStorage.getItem("salary");
    const storedExpenses = JSON.parse(localStorage.getItem("expenseList"));

    if (storedSalary) {
      setSalary(storedSalary);
      setIsSalaryEntered(true);
    }

    if (storedExpenses) {
      setExpenseList(storedExpenses);
    }
  }, []);

  // Save expenses and salary to localStorage whenever they change
  useEffect(() => {
    if (salary) {
      localStorage.setItem("salary", salary);
    }
    localStorage.setItem("expenseList", JSON.stringify(expenseList));
  }, [salary, expenseList]);

  const handleChange = (e) => {
    setSalary(e.target.value);
  };

  const handleBlur = () => {
    if (salary === "") {
      setError("Please enter your salary.");
    } else {
      setIsSalaryEntered(true);
      setError(""); // Clear error if salary is entered
    }
  };

  const savehandler = (e) => {
    setSaving(e.target.value);
  };

  const descriptionHandler = (e) => {
    setDescription(e.target.value);
  };

  const categoryHandler = (e) => {
    setCategory(e.target.value);
  };

  const dateHandler = (e) => {
    setDate(e.target.value);
  };

  const addhandler = () => {
    if (!description || !saving || !category || !date) {
      setError("All fields are required.");
      return;
    }
    if (isNaN(saving) || saving <= 0) {
      setError("Amount should be a valid positive number.");
      return;
    }

    // Create new expense
    const newExpense = {
      id: new Date().getTime(),
      description,
      amount: parseFloat(saving),
      category,
      date,
    };


    setExpenseList((prevList) => [...prevList, newExpense]);

    // Update remaining balance
    const remaining = parseFloat(salary) - parseFloat(saving);
    setExpense(remaining);
    Swal.fire({
      title: "Added",
      icon: "success",
      draggable: true,
      customClass: {
        popup: 'swal2-popup',  // This will apply the custom class
      }
    })
    
    .then(() => {
      setDescription("");//for clear input fields
      setSaving("");
      setCategory("");
      setDate("");
      setError(""); 
  });

    
  };

  const deleteHandler = (id) => {
    const filteredExpenses = expenseList.filter((expense) => expense.id !== id);
    setExpenseList(filteredExpenses);

    // Recalculate remaining balance
    const totalSpent = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0);
    const remaining = parseFloat(salary) - totalSpent;
    setExpense(remaining);
  };

  const editHandler = (id) => {
    const expenseToEdit = expenseList.find((expense) => expense.id === id);
    setDescription(expenseToEdit.description);
    setSaving(expenseToEdit.amount);
    setCategory(expenseToEdit.category);
    setDate(expenseToEdit.date);

    // Temporarily remove the expense being edited from the list
    setExpenseList((prevList) => prevList.filter((expense) => expense.id !== id));
  };

  const resetData = () => {
    // Clear all local storage data and reset state
    localStorage.clear();
    setSalary("");
    setExpenseList([]);
    setExpense(0);
    setIsSalaryEntered(false);
    setDescription("");
    setSaving("");
    setCategory("");
    setDate("");
    setError("");
  };

  const changeSalaryHandler = () => {
    setIsSalaryEntered(false);
    setSalary("");
  };

  return (
    <div className="main" style={{ backgroundColor: "white" }}>
      <div className="App">
        <div className="card">
          <h1 className="app-title">
            {/* <img
            style={{width:"50px"
              ,position:"relative",
              top:"20px",backgroundColor:"#f4f4f9",color:"#f4f4f9"
            }} src={control} alt=""></img> */}
            Personal Finance Tracker{" "}
          </h1>

          {!isSalaryEntered ? (
            <div className="input-section">
              <label className="input-label">Enter Your Monthly Income:</label>
              <input
                type="number"
                name="salary"
                value={salary}
                onChange={handleChange}
                onBlur={handleBlur}
                className="salary-input"
                required
              />
              <button className="enter-button">Enter</button>
              {error && <p className="error-message">{error}</p>}
              <br />
              <br />
            </div>
          ) : (
            <>
              <div className="salary-input-section">
                <div className="salary-display">
                  <h3>
                    Your Monthly Income:{" "}
                    <b
                      style={{
                        color: "green",
                        textShadow: "1px 2px #85bb65",
                        fontSize: "30px",
                      }}
                    >
                      {salary}
                    </b>
                  </h3>
                  <h3>
                    Your Remaining Balance:{" "}
                    <b
                      style={{
                        color: "green",
                        textShadow: "1px 2px #85bb65",
                        fontSize: "30px",
                      }}
                    >
                      {expense}
                    </b>
                  </h3>
                </div>
                <h4>Enter your expense details:</h4>
                <div>
                  <input
                    className="salary-input"
                    type="text"
                    name="description"
                    placeholder="Enter the detail of where you spend this money"
                    value={description}
                    onChange={descriptionHandler}
                  />
                  {error && !description && (
                    <p className="error-message">Description is required.</p>
                  )}

                  <input
                    type="number"
                    className="salary-input"
                    placeholder="Enter Amount"
                    name="spendamount"
                    onChange={savehandler}
                    value={saving}
                    required
                  />
                  {error && !saving && <p className="error-message">Amount is required.</p>}

                  <input
                    type="date"
                    className="salary-input"
                    placeholder="Enter Date"
                    value={date}
                    onChange={dateHandler}
                    required
                  />
                  {error && !date && <p className="error-message">Date is required.</p>}

                  <select
                    className="salary-input"
                    id="salary-select"
                    value={category}
                    onChange={categoryHandler}
                    required
                  >
                    <option value="" disabled>
                      Please select a category where you spend:
                    </option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Travelling">Travelling</option>
                    <option value="Food">Food</option>
                    <option value="Clothes">Clothes</option>
                    <option value="Room Rent/PG">Room Rent/PG</option>
                    <option value="Other">Other</option>
                  </select>
                  {error && !category && <p className="error-message">Category is required.</p>}
                </div>
              </div>

              <button
                style={{
                  width: "20%",
                  height: "40px",
                  fontSize: "25px",
                  cursor: "pointer",
                  outline: "none",
                  border: "none",
                  borderRadius: "5%",
                  fontWeight: "1000",
                  background: "linear-gradient(to right, #0000FF, #00FFFF)",
                  color: "white",
                }}
                onClick={addhandler}
              >
                Add
              </button>
              <br />
              <br />
            </>
          )}
       
        <br />

        {/* Display Salary and Expenses in-line */}
        <div style={{ display:"flex",justifyContent:"space-between" }}>
          {isSalaryEntered && (
            <>
              <button className="enter-button"
                style={{
                  
                  width: "40%",
                  height: "40px",
                  fontSize: "20px",
                  cursor: "pointer",
                  outline: "none",
                  border: "none",
                  borderRadius: "5%",
                  
                  marginBottom: "20px",
                }}
                onClick={resetData}
              >
                Reset All Data
              </button>
              <button className="enter-button"
                style={{
                  width: "40%",
                  height: "40px",
                  fontSize: "20px",
                  cursor: "pointer",
                  outline: "none",
                  border: "none",
                  borderRadius: "5%",
                 
                  marginBottom: "20px",
                }}
                onClick={changeSalaryHandler}
              >
                Change Salary
              </button>
            </>
          )}
        </div>
        </div>
      </div>

      {isSalaryEntered && (
        <div className="expense-section">
          <h3>Your Expenses</h3>
          {expenseList.length > 0 ? (
            <div className="expense-list">
              {expenseList.map((expense, index) => (
                <div
                  key={expense.id}
                  className="expense-item"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="expense-detail">
                    <span className="expense-description">
                      <b>Reason:</b>{expense.description}
                    </span>
                    <span className="expense-amount">
                      <b>Amount:</b>{expense.amount}
                    </span>
                    <span className="expense-category">
                      <b>Type:</b>{expense.category}
                    </span>
                    <span className="expense-date">
                      <b>Date:</b>{expense.date}
                    </span>
                  </div>
                  <div className="expense-actions">
                    <button onClick={() => editHandler(expense.id)} className="btn edit-btn">
                      Edit
                    </button>
                    <button onClick={() => deleteHandler(expense.id)} className="btn delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No expenses recorded yet!</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
