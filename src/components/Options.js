function Options({ question, dispatch, answers, index }) {
  const answer = answers[index];
  return (
    <div className="options">
      {question.options.map((option, idx) => (
        <button
          className={`btn btn-option ${idx === answer ? "answer" : ""} ${
            answer != null
              ? idx === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          disabled={answer !== null}
          key={option}
          onClick={() => dispatch({ type: "newAnswer", payload: idx })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
