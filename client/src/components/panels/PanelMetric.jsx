function PanelMetric({ icon, label, value, detail, tone = "teal" }) {
  return (
    <article className={`panel-metric tone-${tone}`}>
      <span className="panel-icon">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

export default PanelMetric;
