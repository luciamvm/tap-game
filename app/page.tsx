'use client';

import { useEffect, useRef, useState } from 'react';

// export a ramdom number between min and max
const ramdomNumber = (min: number, max: number) => {
  return Math.round(Math.random() * (max - min) + min);
};

const Home = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<HTMLDivElement>(null);
  const startRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);

  const [score, setScore] = useState(0);
  const [start, setStart] = useState(false);

  const addElement = () => {
    const velocity = ramdomNumber(5000, 9000);
    const size = 70;
    const positionX = ramdomNumber(100, window.innerWidth - 100);

    const circle = document.createElement('div');
    circle.style.cssText = `position:absolute; top: -10vh ;width: ${size}px; height: ${size}px; left: ${positionX}px; border-radius: 50% ;transition: transform ${velocity}ms linear; z-index:9;`;

    // set color
    if (Math.round(Math.random()) < 0.5) {
      circle.style.background = 'red';
    } else {
      circle.style.background = 'green';
    }

    // add circle on page
    circlesRef.current!.appendChild(circle);

    // add transition
    setTimeout(() => {
      circle.className = 'move';
    }, ramdomNumber(0, 5000));

    // remove circle when transition ends
    circle.addEventListener('transitionend', () => {
      circle.remove();
    });

    // update score and remove circle
    circle.addEventListener('click', () => {
      if (circle.style.background == 'red') {
        setScore((prevScore) => prevScore - 1);
      }
      if (circle.style.background == 'green') {
        setScore((prevScore) => prevScore + 1);
      }
      circle.remove();
    });
  };

  useEffect(() => {
    if (start) {
      startRef.current!.style.opacity = '0';

      const runGame = setInterval(() => {
        addElement();
      }, 500);

      // count down
      let seconds = 30;
      const countDown = setInterval(() => {
        if (seconds > 0) {
          seconds -= 1;
          if (seconds < 10) {
            counterRef.current!.innerText = `00:0${seconds}s`;
          } else {
            counterRef.current!.innerText = `00:${seconds}s`;
          }

          if (seconds === 5) {
            clearInterval(runGame);
          }
        } else {
          clearInterval(countDown);
          scoreRef.current!.style.zIndex = '2';
          scoreRef.current!.style.opacity = '1';

          circlesRef.current?.replaceChildren();
        }
      }, 1000);
    }
  }, [start]);

  const tryAgain = () => {
    setStart(false);
    setScore(0);
    counterRef.current!.innerText = '00:30s';
    startRef.current!.style.opacity = '1';
    scoreRef.current!.style.zIndex = '0';
    scoreRef.current!.style.opacity = '0';
  };

  return (
    <div className="game" ref={gameRef}>
      <div className="circles" ref={circlesRef}></div>
      <div className="counter" ref={counterRef}>
        00:30s
      </div>
      <div className="start" ref={startRef} onClick={() => setStart(true)}>
        Ckick to start
      </div>

      <div className="score" ref={scoreRef}>
        {score}
        <button className="buttonTryAgain" onClick={tryAgain}>
          Try again
        </button>
      </div>
    </div>
  );
};

export default Home;
