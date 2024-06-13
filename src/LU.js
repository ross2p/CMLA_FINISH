import React, { useState } from "react";
import "./App.css";
// Функція для знаходження розв'язку системи рівнянь методом LU
function solveUsingLU(matrix, isLUp) {
  console.log("isLUp", isLUp);
  let step = [];
  // Перевірка чи розмірність матриці коректна
  const n = matrix.length;
  console.log("n", n);
  console.log("matrix[0].length", matrix[0].length);
  if (n === 0 || matrix[0].length !== n + 1) {
    throw new Error("Некоректна матриця");
  }

  // Розкладання матриці на L та U
  function luDecomposition(A, isL_diag_one = true) {
    let n = A.length;
    let L = Array.from({ length: n }, () => Array(n).fill(0));
    let U = Array.from({ length: n }, () => Array(n).fill(0));

    if (isL_diag_one) {
      for (let i = 0; i < n; i++) {
        // Заповнення верхньої трикутної матриці U
        for (let k = i; k < n; k++) {
          let sum = 0;
          for (let j = 0; j < i; j++) {
            sum += L[i][j] * U[j][k];
          }
          U[i][k] = A[i][k] - sum;
        }

        // Заповнення нижньої трикутної матриці L
        for (let k = i; k < n; k++) {
          if (i === k) {
            L[i][i] = 1; // Діагональні елементи L дорівнюють 1
          } else {
            let sum = 0;
            for (let j = 0; j < i; j++) {
              sum += L[k][j] * U[j][i];
            }
            L[k][i] = (A[k][i] - sum) / U[i][i];
          }
        }
      }
    } else {
      for (let i = 0; i < n; i++) {
        // Заповнення нижньої трикутної матриці L
        for (let k = i; k < n; k++) {
          let sum = 0;
          for (let j = 0; j < i; j++) {
            sum += L[k][j] * U[j][i];
          }
          L[k][i] = A[k][i] - sum;
        }

        // Заповнення верхньої трикутної матриці U
        for (let k = i; k < n; k++) {
          if (i === k) {
            U[i][i] = 1; // Діагональні елементи U дорівнюють 1
          } else {
            let sum = 0;
            for (let j = 0; j < i; j++) {
              sum += L[i][j] * U[j][k];
            }
            U[i][k] = (A[i][k] - sum) / L[i][i];
          }
        }
      }
    }

    return { L, U };
  }

  // Обернений хід для знаходження розв'язку системи рівнянь
  function backSubstitution(L, U, b) {
    const y = [];
    const x = [];
    // Знаходження y у рівнянні Ly = b
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * y[j];
      }
      y[i] = (b[i] - sum) / L[i][i];
      step.push({
        name: "Знаходимо y" + (i + 1) + ": " + y.join(", "),
      });
    }
    // Знаходження x у рівнянні Ux = y
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += U[i][j] * x[j];
      }
      x[i] = (y[i] - sum) / U[i][i];
      step.push({
        name: "Знаходимо x" + (i + 1) + ": " + x.join(", "),
      });
    }
    return x;
  }

  // Перевірка чи матриця є верхньою чи нижньою трикутною
  // Виконати перетворення матриці в верхню трикутну
  // Це можна зробити, використовуючи метод Гаусса або інші методи
  // Тут ми просто використовуємо заздалегідь знайдену функцію luDecomposition
  const { L, U } = luDecomposition(matrix, isLUp);
  step.push({
    name: "Розклали матрички LU",
    L: L,
    U: U,
  });
  console.log("L", L);
  console.log("U", U);

  const b = matrix.map((row) => row[n]); // Отримання вектора b з останнього стовпця матриці
  const result = backSubstitution(L, U, b);
  return { result: result, step: step };
}

function LU() {
  const [round, setRound] = useState(3);
  const [isStart, setIsStart] = useState(false);
  const [size, setSize] = useState(null);
  const [matrix, setMatrix] = useState([[]]);
  const [strMatrix, setStrMatrix] = useState([[]]);
  const [result, setResult] = useState([]);
  const [isL, setIsL] = useState(false);
  const [step, setStep] = useState([]);
  const getMatrix = (matrix, isBystep) => {
    const n = matrix[0].length;
    const countRow = matrix.length;
    return (
      <div>
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: "flex", flexDirection: "row" }}>
            {row.map((el, index) => (
              <React.Fragment key={index}>
                <p style={{ margin: 10 }}>{el.toFixed(round)}</p>
                {isBystep && (index + 1) % countRow === 0 ? (
                  <p style={{ margin: 10 }}>|</p>
                ) : null}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const parseMatrix = (content) => {
    const rows = content.trim().split("\n");
    const matrix = rows.map((row) => row.trim().split(" ").map(Number));
    return matrix;
  };
  const handleStart = (matrix) => {
    console.log("strMatrix", strMatrix);
    let m = strMatrix.map((row) => row.map((el) => parseFloat(el)));
    setMatrix(m);
    console.log("m", m);
    setIsStart(true);
    const result1 = solveUsingLU(m, isL);
    console.log("result1", result1);
    setResult(result1.result);
    setStep(result1.step);
  };
  const getVector = (vector) => {
    return (
      <div>
        {vector.map((el, index) => (
          <p key={index} style={{ margin: 10 }}>
            {el.toFixed(round)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <h1>LU</h1>
        <p>Округлення</p>
      </div>
      <input
        type="number"
        value={size}
        onChange={(e) => {
          setSize(parseInt(e.target.value));
          let m = [];
          for (var i = 0; i < e.target.value; i++) {
            m[i] = [];
            for (var j = 0; j < Number(e.target.value) + 1; j++) {
              m[i][j] = "";
            }
          }
          setStrMatrix(m);
        }}
      />
      <div>
        {strMatrix.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((col, colIndex) => (
              <input
                key={colIndex}
                type="text"
                value={col}
                style={{ width: "50px" }}
                onChange={(e) => {
                  const newMatrix = [...strMatrix];
                  strMatrix[rowIndex][colIndex] = e.target.value;
                  setStrMatrix(newMatrix);
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <p>L Одинична</p>
      <input
        type="checkbox"
        value={isL}
        onChange={(e) => {
          setIsL(e.target.checked);
          console.log("e.target.checked", e.target.checked);
        }}
      />

      <button onClick={() => handleStart(matrix)}>Запустити обчислення</button>
      {isStart ? (
        <>
          <h3>Початкова матриця</h3>
          {getMatrix(matrix, true)}
          <h3>Кроки</h3>
          {step.map((step, index) => (
            <div key={index}>
              <h2>{step.name}</h2>
              {step.U && (
                <>
                  <p>U</p>
                  {getMatrix(step.U)}
                  <p>L</p>
                  {getMatrix(step.L)}
                </>
              )}
            </div>
          ))}
          <h3>Результат</h3>
          {getVector(result)}
        </>
      ) : null}
    </div>
  );
}

export default LU;
