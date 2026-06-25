import { BadgeCheck, Clock3, Languages, MessageCircle, Phone, Star } from "lucide-react";
import Pill from "../common/Pill";
import { initials } from "../../utils/formatters";

function AdvisorCard({ astrologer, onSelect }) {
  return (
    <article className="advisor-card">
      <div className="advisor-head">
        <div className="avatar" style={{ "--accent": astrologer.accent }}>
          {initials(astrologer.name)}
        </div>
        <div>
          <div className="advisor-name">
            <h3>{astrologer.name}</h3>
            <BadgeCheck size={18} />
          </div>
          <p>{astrologer.title}</p>
        </div>
      </div>

      <div className="advisor-meta">
        <span>
          <Star size={16} />
          {astrologer.rating}
        </span>
        <span>
          <Clock3 size={16} />
          {astrologer.experience} yrs
        </span>
        <span>
          <Languages size={16} />
          {astrologer.languages.join(", ")}
        </span>
      </div>

      <div className="specialty-row">
        {astrologer.specialties.map((specialty) => (
          <Pill key={specialty}>{specialty}</Pill>
        ))}
      </div>

      <div className="advisor-footer">
        <div>
          <strong>Rs {astrologer.pricePerMinute}/min</strong>
          <span>{astrologer.orders.toLocaleString("en-IN")} orders</span>
        </div>
        <Pill tone={astrologer.status}>{astrologer.status}</Pill>
      </div>

      <div className="card-actions">
        <button
          type="button"
          className="secondary-button"
          disabled={!astrologer.modes.includes("chat")}
          onClick={() => onSelect(astrologer, "chat")}
        >
          <MessageCircle size={18} />
          Chat
        </button>
        <button
          type="button"
          className="secondary-button"
          disabled={!astrologer.modes.includes("call")}
          onClick={() => onSelect(astrologer, "call")}
        >
          <Phone size={18} />
          Call
        </button>
      </div>
    </article>
  );
}

export default AdvisorCard;
