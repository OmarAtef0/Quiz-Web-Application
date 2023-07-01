function Progress({ index, numQ, points, totalP, answer }) {
  return (
    <header className="progress">
      <progress max={numQ} value={index + Number(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {numQ}
      </p>
      <p>
        <strong>{points}</strong> / {totalP}
      </p>
    </header>
  );
}

export default Progress;
