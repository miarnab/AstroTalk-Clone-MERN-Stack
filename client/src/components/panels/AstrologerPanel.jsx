import {
  BadgeCheck,
  CalendarDays,
  Clock3,
  IndianRupee,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Star
} from "lucide-react";
import Pill from "../common/Pill";
import BookingRow from "./BookingRow";
import PanelMetric from "./PanelMetric";

function AstrologerPanel({ session, data, status, onOpenSession, onOpenProfile, onRefresh }) {
  const profile = data.profile;
  const upcoming = data.upcoming || [];
  const history = data.history || [];
  const metricIcons = [
    <Sparkles size={21} />,
    <IndianRupee size={21} />,
    <CalendarDays size={21} />,
    <Star size={21} />
  ];
  const tones = ["teal", "solar", "rose", "green"];

  return (
    <main className="panel-page" id="panel">
      <section className="panel-hero astrologer-panel-hero">
        <div>
          <span className="eyebrow">
            <Sparkles size={16} />
            Astrologer dashboard
          </span>
          <h1>{profile?.name || session.user.name}</h1>
          <p>
            {profile?.title || "Complete your astrologer profile"}{" "}
            {profile?.city ? `from ${profile.city}` : ""}
          </p>
        </div>
        <div className="panel-hero-card">
          <span className="panel-icon">
            <BadgeCheck size={22} />
          </span>
          <div>
            <span>Profile completeness</span>
            <strong>{data.profileComplete}%</strong>
            <small>{profile?.availability || "Add availability to finish your listing"}</small>
          </div>
          {profile?.status ? <Pill tone={profile.status}>{profile.status}</Pill> : null}
          <button className="secondary-button" type="button" onClick={onOpenProfile}>
            <Sparkles size={18} />
            Edit profile
          </button>
          <button className="secondary-button" type="button" onClick={onRefresh} disabled={status.loading}>
            <RefreshCw size={18} />
            {status.loading ? "Syncing..." : "Refresh"}
          </button>
        </div>
      </section>

      <section className="panel-metrics" aria-label="Astrologer account summary">
        {data.metrics.map((item, index) => (
          <PanelMetric
            key={item.label}
            icon={metricIcons[index] || <Sparkles size={21} />}
            label={item.label}
            value={item.value}
            detail={item.detail}
            tone={tones[index] || "teal"}
          />
        ))}
      </section>

      <section className="panel-grid astrologer-panel-grid">
        <article className="panel-card panel-card-wide">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <CalendarDays size={16} />
                Consultations
              </span>
              <h2>Upcoming queue</h2>
            </div>
          </div>
          <div className="panel-list">
            {upcoming.length ? (
              upcoming.map((booking) => (
                <BookingRow
                  key={booking.bookingId}
                  booking={booking}
                  focus="astrologer"
                  onOpenSession={onOpenSession}
                />
              ))
            ) : (
              <div className="empty-panel">No active consultation is queued.</div>
            )}
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <Clock3 size={16} />
                Availability
              </span>
              <h2>Listing details</h2>
            </div>
          </div>
          <div className="compact-panel-list">
            <div className="compact-panel-row">
              <strong>{profile?.responseTime || "Response time"}</strong>
              <span>{profile?.availability || "Availability hours"}</span>
              <small>{profile?.modes?.join(", ") || "Consultation modes"}</small>
            </div>
            <div className="compact-panel-row">
              <strong>{profile?.languages?.join(", ") || "Languages"}</strong>
              <span>{profile?.specialties?.join(", ") || "Specialties"}</span>
              <small>{profile?.education || "Education / training"}</small>
            </div>
          </div>
        </article>

        <article className="panel-card panel-card-wide">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <MessageCircle size={16} />
                History
              </span>
              <h2>Recent consultations</h2>
            </div>
          </div>
          <div className="panel-list">
            {history.length ? (
              history.map((booking) => (
                <BookingRow
                  key={`${booking.bookingId}-history`}
                  booking={booking}
                  focus="astrologer"
                  onOpenSession={onOpenSession}
                />
              ))
            ) : (
              <div className="empty-panel">Completed consultations will appear here.</div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}

export default AstrologerPanel;
