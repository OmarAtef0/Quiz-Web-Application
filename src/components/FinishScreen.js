function FinishScreen({ points, totalP, dispatch }) {
  return (
    <>
      <p className="result">
        🎉 You Scored <strong>{points}</strong> out of {totalP} !
      </p>
      <button
        className="btn1 btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Restart Quiz
      </button>
    </>
  );
}

export default FinishScreen;
