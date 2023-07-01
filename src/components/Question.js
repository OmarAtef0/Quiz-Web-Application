import Options from "./Options";

function Question({ question, dispatch, answers, index }) {
  return (
    <div className="question">
      <h4>{question.question}</h4>
      <Options
        dispatch={dispatch}
        question={question}
        answers={answers}
        index={index}
      />
    </div>
  );
}

export default Question;
