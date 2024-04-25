"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';

const upgrades = [
  { id: 1, name: 'Сила клика', cost: 10, effect: 1 },
  { id: 2, name: 'Увеличение таймера', cost: 20, effect: 5 },
];

export default function Home() {
  const [count, setCount] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [money, setMoney] = useState(0);
  const [clickPower, setClickPower] = useState(1); 
  const [bonusActive, setBonusActive] = useState(false); 
  const [mathProblem, setMathProblem] = useState(''); 
  const [answer, setAnswer] = useState(''); 
  const [reward, setReward] = useState(0); 

  useEffect(() => {
    let interval;
    if (isGameStarted) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameStarted]);

  useEffect(() => {
    if (timer === 0) {
      setIsGameStarted(false);
      alert(`Игра окончена! Ваш счет: ${count}`);
    }
  }, [timer, count]);

  useEffect(() => {
    const moneyInterval = setInterval(() => {
      setMoney((prevMoney) => prevMoney + (bonusActive ? level * 2 : level)); 
    }, 1000);
    return () => clearInterval(moneyInterval);
  }, [level, bonusActive]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setCount(0);
    setTimer(10);
  };

  const handleClick = () => {
    if (isGameStarted) {
      setCount((prevCount) => prevCount + clickPower); 
      setMoney((prevMoney) => prevMoney + clickPower); 
    }
  };

  const buyUpgrade = (upgrade) => {
    if (money >= upgrade.cost) {
      setMoney((prevMoney) => prevMoney - upgrade.cost);
      if (upgrade.id === 1) {
        setLevel((prevLevel) => prevLevel + upgrade.effect);
        setClickPower((prevClickPower) => prevClickPower + upgrade.effect); 
      } else if (upgrade.id === 2) {
        setTimer((prevTimer) => prevTimer + upgrade.effect);
      }
    } else {
      alert('Недостаточно денег!');
    }
  };

  const activateBonus = () => {
    setBonusActive(true);
    setTimeout(() => {
      setBonusActive(false);
    }, 10000); 
  };

  const generateMathProblem = () => {
    const operand1 = Math.floor(Math.random() * 10) + 1; 
    const operand2 = Math.floor(Math.random() * 10) + 1; 
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)]; 
    const problemText = `${operand1} ${operator} ${operand2}`; 
    const result = eval(problemText); 
    const reward = Math.floor(Math.abs(result)); 
    setMathProblem(problemText);
    setReward(reward); 
  };
  

  const checkAnswer = () => {
    const result = eval(mathProblem); 
    if (parseInt(answer) === result) {
      setCount((prevCount) => prevCount + reward); 
      setMoney((prevMoney) => prevMoney + reward); 
      setAnswer(''); 
      generateMathProblem(); 
    } else {
      alert('Неправильный ответ!');
    }
  };

  useEffect(() => {
    if (isGameStarted) {
      generateMathProblem();
    }
  }, [isGameStarted]);  

  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className={styles.grid}>
        <p>Уровень: {level}</p>
        <p>Деньги: {money}</p>
        <p>Счетчик: {count}</p>
        <button className={styles.button} onClick={handleClick} disabled={!isGameStarted}>
          Кликнуть!
        </button>
        <p>Время: {timer} секунд</p>
        {!isGameStarted && (
          <button className={styles.button} onClick={handleStartGame}>
            Начать игру
          </button>
        )}
        {upgrades.map((upgrade) => (
          <div key={upgrade.id}>
            <p>
              {upgrade.name} (Стоимость: {upgrade.cost}):
            </p>
            <button className={styles.button} onClick={() => buyUpgrade(upgrade)}>
              Купить {upgrade.name}
            </button>
          </div>
        ))}
        <button className={styles.button} onClick={activateBonus} disabled={bonusActive}>
          Активировать бонус
        </button>
        <div>
          <p>Решите математическую задачу:</p>
          <p>{mathProblem}</p>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Введите ответ"
          />
          <button className={styles.button} onClick={checkAnswer}>
            Проверить ответ
          </button>
        </div>
      </div>
    </main>
  );
}

