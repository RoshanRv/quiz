import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [ques, setQues] = useState("");
  const [opt1, setOpt1] = useState("");
  const [opt2, setOpt2] = useState("");
  const [answerIndex, setAnswerIndex] = useState(null);
  const [quizz, setQuizz] = useState([]);

  const handleCreateQuiz = async () => {
    try {
      if (!ques || !opt1 || !opt2 || !answerIndex) return;
      await axios.post("http://localhost:3010/quiz", {
        ques,
        opt1,
        opt2,
        answerIndex,
      });
      setQues("");
      setOpt1("");
      setOpt2("");
      setAnswerIndex(null);
      handleFetchQuiz();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFetchQuiz = async () => {
    try {
      const quizz = await axios.get("http://localhost:3010/quiz");
      setQuizz(quizz.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleFetchQuiz();
  }, []);

  return (
    <>
      <section className="flex flex-col gap-2">
        <h2>Quizz</h2>
        {/* Create Question */}
        <section>
          <h3 style={{ textAlign: "left" }}>Create Question</h3>
          <input
            value={ques}
            onChange={(e) => setQues(e.target.value)}
            type="text"
            className="input-text"
          />
          <h4 style={{ textAlign: "left" }}>Options</h4>
          <div className="option-container">
            <Option
              opt={"a"}
              setValue={setOpt1}
              answerIndex={answerIndex}
              index={1}
              setAnswerIndex={setAnswerIndex}
              value={opt1}
            />
            <Option
              opt={"b"}
              setValue={setOpt2}
              answerIndex={answerIndex}
              index={2}
              setAnswerIndex={setAnswerIndex}
              value={opt2}
            />
          </div>
          <button onClick={handleCreateQuiz} className="btn">
            Create
          </button>
        </section>
        {/* Created Question */}
        <section>
          <h3 style={{ textAlign: "left" }}>Created Questions</h3>
          {quizz.map((quiz, i) => (
            <div key={i}>
              <h2>{quiz.question}</h2>
              <div className="option-container">
                <Option
                  opt={"a"}
                  ans={true}
                  value={quiz.opt1}
                  answerIndex={quiz.ans}
                  index={1}
                />
                <Option
                  opt={"b"}
                  ans={true}
                  value={quiz.opt2}
                  answerIndex={quiz.ans}
                  index={2}
                />
              </div>
            </div>
          ))}
        </section>
      </section>
    </>
  );
}

export default App;

const Option = ({
  opt,
  value,
  setValue,
  answerIndex,
  setAnswerIndex,
  index,
  ans,
}) => {
  const [isCorrect, setIsCorrect] = useState(null);

  return (
    <div>
      <div
        onClick={() =>
          ans &&
          (index === answerIndex ? setIsCorrect(true) : setIsCorrect(false))
        }
        className="option"
      >
        <p className="opt">{opt}</p>
        <input
          readOnly={ans}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          className="opt-input"
        />
      </div>
      {!ans && (
        <p
          onClick={() => setAnswerIndex(index)}
          className={answerIndex === index ? "yes-answer" : "not-answer"}
        >
          {"Answer ?"}
        </p>
      )}
      {isCorrect ? <p>Correct !!</p> : isCorrect === false && <p>Wrong </p>}
    </div>
  );
};
