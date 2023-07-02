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

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shuffleOptions(question) {
  const options = question.options;
  const correctOptionValue = question.options[question.correctOption];
  console.log(options);
  console.log(question.correctOption, " ", correctOptionValue);

  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  question.options = options;
  question.correctOption = question.options.indexOf(correctOptionValue);

  console.log(options);
  console.log(question.correctOption, " ", correctOptionValue);
  return question;
}

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
      let newQuestions = shuffleArray(state.questions);
      console.log("NEW QUESTIONS ", newQuestions);

      newQuestions.forEach((question, index) => {
        newQuestions[index] = shuffleOptions(question);
      });

      return {
        ...state,
        status: "active",
        index: 0, // question index
        points: 0,
        secondsRemaining: state.questions.length * 20,
        answers: new Array(state.questions.length).fill(null),
        questions: newQuestions,
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
