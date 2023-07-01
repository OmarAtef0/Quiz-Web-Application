function NextButton({ dispatch, isFinished }) {
  return (
    <button
      className="btn btn-ui"
      onClick={
        isFinished
          ? () => dispatch({ type: "finish" })
          : () => dispatch({ type: "nextQuestion" })
      }
    >
      {isFinished ? "Finish Quiz" : "Next"}
    </button>
  );
}

export default NextButton;
