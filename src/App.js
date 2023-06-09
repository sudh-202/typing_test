import { useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import "./app.css";
const NUMB_OF_WORDS = 200;
const SECONDS = 60;

function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currInput, setCurrInput] = useState("");
  const [currWordIndex, setCurrWordIndex] = useState(0);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const textInput = useRef(null);

  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  function generateWords() {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => randomWords());
  }

  function start() {
    if (status === "finished") {
      setWords(generateWords());
      setCurrWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      setCurrChar("");
    }

    if (status !== "started") {
      setStatus("started");
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrInput("");
            return SECONDS;
          } else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeyDown({ keyCode, key }) {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrInput("");
      setCurrWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
      // backspace
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }

  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setIncorrect(incorrect + 1);
    }
  }

  function getCharClass(wordIdx, charIdx, char) {
    if (
      wordIdx === currWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        return "has-background-success";
      } else {
        return "has-background-danger";
      }
    } else if (
      wordIdx === currWordIndex &&
      currCharIndex >= words[currWordIndex].length
    ) {
      return "has-background-danger";
    } else {
      return "";
    }
  }

  return (
    <div
      className="App"
      style={{
        width: "100vw",
        maxWidth: "100%",
        // margin: "100px",
        paddingTop: "150px",
        paddingBottom: "200px",
        backgroundColor: "#313335",
        border: "20px solid white",
        borderRadius: "50px",
      }}
    >
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary ">
          <h1
            style={{
              fontSize: "80px",
              fontWeight: "bolder",
              color: "ButtonShadow",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            Typing Speed Test
          </h1>
          <h2
            style={{
              fontSize: "60px",
              fontWeight: "bolder",
              color: "#196FC7",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          >
            {countDown}
          </h2>
        </div>
      </div>

      <div
        className="section"
        style={{
          margin: "0px",
          padding: "20px",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <input
            ref={textInput}
            disabled={status !== "started"}
            type="text"
            className="input"
            onKeyDown={handleKeyDown}
            value={currInput}
            onChange={(e) => setCurrInput(e.target.value)}
            style={{
              width: "100%", // Adjust the width as needed
              height: "100px", // Adjust the height as needed
              fontSize: "34px",
              border: " 2px solid #black",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            }}
          />
        </div>
      </div>
      <div
        className="section"
        style={{
          padding: "0px",
        }}
      >
        <div
          className="contain"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // margin: "20px 20px",
          }}
        >
          <button
            className="start-button"
            onClick={start}
            style={{
              backgroundColor: "#0749ab",
              // padding: "10px 20px",
              color: "white",
              width: "21%",
              "@media screen and (max-width: 1010px)": {
                width: "30%",
                padding: "0px",
              },
              height: "50px",
              fontSize: "24px",
              borderRadius: "7px",

              // border: " 2px solid #black",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
              "@media screen and (max-width: 1010px)": {
                width: "30%",
                padding: "0 20px",
              },
            }}
          >
            Start
          </button>
        </div>
      </div>
      {status === "started" && (
        <div className="section">
          <div className="card">
            <div
              className="card-content"
              style={{
                backgroundColor: "#211D1E",
                color: "white",
                border: "2px solid white ",
                fontSize: "25px",
              }}
            >
              <div className="content">
                {words.map((word, i) => (
                  <span key={i}>
                    <span>
                      {word.split("").map((char, idx) => (
                        <span className={getCharClass(i, idx, char)} key={idx}>
                          {char}
                        </span>
                      ))}
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {status === "finished" && (
        <div className="section">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">Words per minute:</p>
              <p className="has-text-primary is-size-1">{correct}</p>
            </div>
            <div className="column has-text-centered">
              <p className="is-size-5">Accuracy:</p>
              {correct !== 0 ? (
                <p className="has-text-info is-size-1">
                  {Math.round((correct / (correct + incorrect)) * 100)}%
                </p>
              ) : (
                <p className="has-text-info is-size-1">0%</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
