function ProgressRow({ label, value }) {
  return (
    <div className="progress-row">
      <span>{label}</span>
      <div className="meter" aria-hidden="true">
        <span style={{ width: `${value}%` }} />
      </div>
      <strong>{value}</strong>
    </div>
  );
}

export default ProgressRow;
