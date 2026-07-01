import { MessageCircle, Phone } from "lucide-react";
import Pill from "../common/Pill";
import { formatPanelDate } from "../../utils/formatters";

function BookingRow({ booking, focus = "customer", onOpenSession }) {
  const canJoin = booking.status !== "completed" && typeof onOpenSession === "function";
  const primaryName = focus === "astrologer" ? booking.customerName : booking.astrologerName;
  const secondaryName = focus === "astrologer" ? booking.astrologerName : booking.customerName;

  return (
    <article className="panel-list-row">
      <span className="panel-row-icon">
        {booking.mode === "call" ? <Phone size={17} /> : <MessageCircle size={17} />}
      </span>
      <div>
        <strong>{primaryName}</strong>
        <span>{secondaryName}</span>
        <small>{booking.concern}</small>
      </div>
      <div className="panel-row-meta">
        <Pill tone={booking.status === "completed" ? "teal" : "online"}>{booking.status}</Pill>
        <span>{formatPanelDate(booking.createdAt)}</span>
        {canJoin ? (
          <button className="row-action-button" type="button" onClick={() => onOpenSession(booking)}>
            {booking.mode === "call" ? <Phone size={15} /> : <MessageCircle size={15} />}
            Join
          </button>
        ) : null}
      </div>
    </article>
  );
}

export default BookingRow;
