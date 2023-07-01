function PreButton({ dispatch, index }) {
  return (
    <button
      className="btn btn-ui"
      onClick={() => dispatch({ type: "preQuestion" })}
      disabled={index === 0}
    >
      Previous
    </button>
  );
}

export default PreButton;
