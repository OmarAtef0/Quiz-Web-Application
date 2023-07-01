function StartScreen({ numQ, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to the REACT Quiz!</h2>
      <h3>
        <strong>{numQ}</strong> question to test your REACT Mastery
      </h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Lets Start!
      </button>
    </div>
  );
}
export default StartScreen;
