import { MessageCircle, Phone } from "lucide-react";
import Pill from "../common/Pill";
import { formatPanelDate } from "../../utils/formatters";

function BookingRow({ booking }) {
  return (
    <article className="panel-list-row">
      <span className="panel-row-icon">
        {booking.mode === "call" ? <Phone size={17} /> : <MessageCircle size={17} />}
      </span>
      <div>
        <strong>{booking.astrologerName}</strong>
        <span>{booking.customerName}</span>
        <small>{booking.concern}</small>
      </div>
      <div className="panel-row-meta">
        <Pill tone={booking.status === "completed" ? "teal" : "online"}>{booking.status}</Pill>
        <span>{formatPanelDate(booking.createdAt)}</span>
      </div>
    </article>
  );
}

export default BookingRow;
