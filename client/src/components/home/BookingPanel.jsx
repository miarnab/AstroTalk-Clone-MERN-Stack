import {
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  LockKeyhole,
  LogIn,
  MessageCircle,
  Phone,
  Send,
  Video,
  X
} from "lucide-react";
import { formatRupees } from "../../utils/razorpay";

function BookingPanel({
  booking,
  bookingResult,
  bookingStatus,
  canBook,
  selectedAstrologer,
  onBookingChange,
  onClear,
  onModeChange,
  onOpenSession,
  onRequireSignIn,
  onSubmit
}) {
  const durationMinutes = Number(booking.durationMinutes || 5);
  const consultationFee = selectedAstrologer
    ? selectedAstrologer.pricePerMinute * durationMinutes
    : 0;

  return (
    <aside
      className={`booking-panel ${selectedAstrologer ? "has-selection" : "is-empty"}`}
      aria-label="Booking panel"
    >
      <div className="booking-head">
        <div>
          <span className="eyebrow">
            <CalendarDays size={16} />
            Booking
          </span>
          <h2>{selectedAstrologer ? selectedAstrologer.name : "Select an expert"}</h2>
        </div>
        {selectedAstrologer ? (
          <button
            className="icon-button"
            type="button"
            aria-label="Clear selected astrologer"
            onClick={onClear}
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      {selectedAstrologer && canBook ? (
        <form className="booking-form" onSubmit={onSubmit}>
          <div className="mode-toggle">
            {["chat", "call"].map((mode) => (
              <button
                type="button"
                key={mode}
                disabled={!selectedAstrologer.modes.includes(mode)}
                className={booking.mode === mode ? "active" : ""}
                onClick={() => onModeChange(mode)}
              >
                {mode === "chat" ? <MessageCircle size={17} /> : <Phone size={17} />}
                {mode}
              </button>
            ))}
          </div>

          <label>
            Name
            <input
              value={booking.name}
              onChange={(event) => onBookingChange("name", event.target.value)}
              required
            />
          </label>

          <label>
            Concern
            <textarea
              value={booking.concern}
              onChange={(event) => onBookingChange("concern", event.target.value)}
              placeholder="Marriage, career, finance..."
              required
            />
          </label>

          <div className="two-col">
            <label>
              Birth date
              <input
                type="date"
                value={booking.birthDate}
                onChange={(event) => onBookingChange("birthDate", event.target.value)}
              />
            </label>
            <label>
              Birth time
              <input
                type="time"
                value={booking.birthTime}
                onChange={(event) => onBookingChange("birthTime", event.target.value)}
              />
            </label>
          </div>

          <label>
            Birth place
            <input
              value={booking.place}
              onChange={(event) => onBookingChange("place", event.target.value)}
            />
          </label>

          <label>
            Consultation minutes
            <select
              value={booking.durationMinutes}
              onChange={(event) => onBookingChange("durationMinutes", event.target.value)}
            >
              {[5, 10, 15, 30, 45, 60].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minutes
                </option>
              ))}
            </select>
          </label>

          <div className="payment-summary">
            <span>
              {formatRupees(selectedAstrologer.pricePerMinute)}/min x {durationMinutes} minutes
            </span>
            <strong>{formatRupees(consultationFee)}</strong>
          </div>

          {bookingStatus?.error ? <div className="form-error">{bookingStatus.error}</div> : null}

          <button className="primary-button" type="submit" disabled={bookingStatus?.loading}>
            <Send size={18} />
            {bookingStatus?.loading ? "Opening payment..." : `Pay ${formatRupees(consultationFee)}`}
          </button>
        </form>
      ) : selectedAstrologer ? (
        <div className="empty-panel locked-panel">
          <LockKeyhole size={42} />
          <p>Sign in to book {booking.mode} with {selectedAstrologer.name}.</p>
          <button className="primary-button" type="button" onClick={onRequireSignIn}>
            <LogIn size={18} />
            Sign in to book
          </button>
        </div>
      ) : (
        <div className="empty-panel">
          <CircleUserRound size={42} />
          <p>Choose Chat or Call on any astrologer card.</p>
        </div>
      )}

      {bookingResult ? (
        <div className="success-panel">
          <CheckCircle2 size={20} />
          <div>
            <strong>{bookingResult.bookingId}</strong>
            <span>
              {bookingResult.mode === "call" ? "Video call" : "Chat"} with{" "}
              {bookingResult.astrologerName} is ready for {bookingResult.durationMinutes} minutes.
            </span>
            {bookingResult.amountPaid ? (
              <span>Paid {formatRupees(bookingResult.amountPaid)} through Razorpay.</span>
            ) : null}
            <button
              className="secondary-button session-start-button"
              type="button"
              onClick={() => onOpenSession?.(bookingResult)}
            >
              {bookingResult.mode === "call" ? <Video size={18} /> : <MessageCircle size={18} />}
              Join session
            </button>
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export default BookingPanel;
