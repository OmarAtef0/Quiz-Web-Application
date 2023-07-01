import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import { useEffect, useReducer } from "react";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import NextButton from "./NextButton";
import PreButton from "./PreButton";

const intialState = {
  questions: [],
  answers: [],
  // loading - error - ready - active - finished
  status: "loading",
  index: 0, // question index
  points: 0,
  secondsRemaining: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        index: 0, // question index
        points: 0,
        secondsRemaining: state.questions.length * 20,
        answers: new Array(state.questions.length).fill(null),
      };
    case "newAnswer":
      const question = state.questions[state.index];
      const newAnswers = [...state.answers];
      newAnswers[state.index] = action.payload;

      return {
        ...state,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
        answers: newAnswers,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1 };
    case "preQuestion":
      return { ...state, index: state.index - 1 };
    case "finish":
      return { ...state, status: "finish" };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finish" : state.status,
      };
    default:
      throw new Error("Action is UNKNOWN!");
  }
}

export default function App() {
  const [
    { questions, answers, status, index, points, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, intialState);

  useEffect(function () {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const executeWithDelay = async () => {
      await delay(1500);
      fetch(
        "https://raw.githubusercontent.com/OmarAtef0/Quiz-Web-Application/main/questions.json"
      )
        .then((res) => res.json())
        .then((data) =>
          dispatch({ type: "dataReceived", payload: data.questions })
        )
        .catch((err) => dispatch({ type: "dataFailed" }));

      console.log(questions);
    };
    executeWithDelay();
  }, []);

  const numQ = questions.length;
  const totalP = questions.reduce((acc, curr) => acc + curr.points, 0);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && <StartScreen numQ={numQ} dispatch={dispatch} />}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQ={numQ}
              points={points}
              totalP={totalP}
              answers={answers}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answers={answers}
              index={index}
            />

            <footer className="footer">
              <PreButton dispatch={dispatch} index={index} />
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton dispatch={dispatch} isFinished={index === numQ - 1} />
            </footer>
          </>
        )}
        {status === "finish" && (
          <FinishScreen points={points} totalP={totalP} dispatch={dispatch} />
        )}
      </Main>
    </div>
  );
}
