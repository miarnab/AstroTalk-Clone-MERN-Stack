import {
  BadgeCheck,
  CalendarDays,
  MessageCircle,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  UserCog,
  WalletCards
} from "lucide-react";
import Pill from "../common/Pill";
import BookingRow from "./BookingRow";
import PanelMetric from "./PanelMetric";

function AdminPanel({ session, data, status, onOpenSession, onRefresh }) {
  const metricIcons = [
    <WalletCards size={21} />,
    <CalendarDays size={21} />,
    <UserCog size={21} />,
    <Star size={21} />
  ];
  const tones = ["solar", "teal", "green", "rose"];

  return (
    <main className="panel-page" id="panel">
      <section className="panel-hero admin-panel-hero">
        <div>
          <span className="eyebrow">
            <UserCog size={16} />
            Admin panel
          </span>
          <h1>{session.user.dashboard}</h1>
          <p>{session.nextStep}</p>
        </div>
        <div className="panel-hero-card">
          <span className="panel-icon">
            <ShieldCheck size={22} />
          </span>
          <div>
            <span>Astrologer status</span>
            <strong>{data.astrologerStatus.online} online</strong>
            <small>
              {data.astrologerStatus.busy} busy, {data.astrologerStatus.offline} offline
            </small>
          </div>
          <button className="secondary-button" type="button" onClick={onRefresh} disabled={status.loading}>
            {status.loading ? "Syncing..." : "Refresh"}
          </button>
        </div>
      </section>

      <section className="panel-metrics" aria-label="Admin operations summary">
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

      <section className="panel-grid admin-panel-grid">
        <article className="panel-card panel-card-wide">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <CalendarDays size={16} />
                Booking desk
              </span>
              <h2>Live queue</h2>
            </div>
          </div>
          <div className="panel-list">
            {data.bookingQueue.map((booking) => (
              <BookingRow
                key={booking.bookingId}
                booking={booking}
                onOpenSession={onOpenSession}
              />
            ))}
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <BadgeCheck size={16} />
                Approvals
              </span>
              <h2>Astrologer review</h2>
            </div>
          </div>
          <div className="compact-panel-list">
            {data.approvalQueue.map((item) => (
              <div className="compact-panel-row" key={item.id}>
                <strong>{item.name}</strong>
                <span>
                  {item.specialty} - {item.experience} yrs
                </span>
                <small>{item.status}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card panel-card-wide">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <SlidersHorizontal size={16} />
                Catalog
              </span>
              <h2>Service health</h2>
            </div>
          </div>
          <div className="catalog-table">
            {data.catalogHealth.map((item) => (
              <div className="catalog-row" key={item.id}>
                <strong>{item.title}</strong>
                <Pill tone={item.status === "live" ? "teal" : "neutral"}>{item.status}</Pill>
                <span>{item.bookings} bookings</span>
                <span>{item.conversion} conversion</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <MessageCircle size={16} />
                Support
              </span>
              <h2>Tickets</h2>
            </div>
          </div>
          <div className="compact-panel-list">
            {data.supportQueue.map((item) => (
              <div className="compact-panel-row" key={item.id}>
                <strong>{item.customer}</strong>
                <span>{item.issue}</span>
                <small>
                  {item.priority} priority - {item.age}
                </small>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default AdminPanel;
