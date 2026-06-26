import {
  CalendarDays,
  CircleUserRound,
  Clock3,
  CreditCard,
  Gem,
  IndianRupee,
  MessageCircle,
  Sparkles,
  Star,
  WalletCards
} from "lucide-react";
import { useState } from "react";
import Pill from "../common/Pill";
import BookingRow from "./BookingRow";
import PanelMetric from "./PanelMetric";

function UserPanel({
  session,
  data,
  status,
  walletStatus,
  onOpenProfile,
  onRefresh,
  onWalletRecharge
}) {
  const wallet = data.wallet;
  const upcoming = data.upcoming || [];
  const history = data.history || [];
  const [rechargeAmount, setRechargeAmount] = useState(500);

  function submitRecharge(event) {
    event.preventDefault();
    onWalletRecharge(rechargeAmount);
  }

  return (
    <main className="panel-page" id="panel">
      <section className="panel-hero">
        <div>
          <span className="eyebrow">
            <CircleUserRound size={16} />
            User panel
          </span>
          <h1>{session.user.name}</h1>
          <p>
            {data.profile.tier} since {data.profile.memberSince}. {data.profile.savedBirthProfiles}{" "}
            birth profiles are saved.
          </p>
        </div>
        <div className="panel-hero-card">
          <span className="panel-icon">
            <WalletCards size={22} />
          </span>
          <div>
            <span>Wallet balance</span>
            <strong>Rs {wallet.balance.toLocaleString("en-IN")}</strong>
            <small>{wallet.freeMinutes} free minutes available</small>
          </div>
          <button className="secondary-button" type="button" onClick={onOpenProfile}>
            <CircleUserRound size={18} />
            Edit profile
          </button>
          <button className="secondary-button" type="button" onClick={onRefresh} disabled={status.loading}>
            {status.loading ? "Syncing..." : "Refresh"}
          </button>
          <form className="wallet-recharge" onSubmit={submitRecharge}>
            <div className="recharge-presets" aria-label="Recharge amount presets">
              {[250, 500, 1000].map((amount) => (
                <button
                  type="button"
                  key={amount}
                  className={rechargeAmount === amount ? "active" : ""}
                  onClick={() => setRechargeAmount(amount)}
                >
                  Rs {amount}
                </button>
              ))}
            </div>
            <label>
              <IndianRupee size={17} />
              <input
                type="number"
                min="50"
                step="50"
                value={rechargeAmount}
                onChange={(event) => setRechargeAmount(event.target.value)}
                aria-label="Wallet recharge amount"
              />
            </label>
            {walletStatus?.error ? <div className="form-error">{walletStatus.error}</div> : null}
            {walletStatus?.success ? <div className="form-success">{walletStatus.success}</div> : null}
            <button className="primary-button" type="submit" disabled={walletStatus?.loading}>
              <CreditCard size={18} />
              {walletStatus?.loading ? "Opening payment..." : "Recharge wallet"}
            </button>
          </form>
        </div>
      </section>

      <section className="panel-metrics" aria-label="User account summary">
        <PanelMetric
          icon={<WalletCards size={21} />}
          label="Rewards"
          value={`Rs ${wallet.rewards}`}
          detail="Available credits"
          tone="solar"
        />
        <PanelMetric
          icon={<CalendarDays size={21} />}
          label="Upcoming"
          value={String(upcoming.length)}
          detail="Bookings in queue"
          tone="teal"
        />
        <PanelMetric
          icon={<Clock3 size={21} />}
          label="This month"
          value={`Rs ${wallet.spendThisMonth}`}
          detail="Consultation spend"
          tone="rose"
        />
        <PanelMetric
          icon={<Gem size={21} />}
          label="Saved charts"
          value={String(data.profile.savedBirthProfiles)}
          detail="Kundli profiles"
          tone="green"
        />
      </section>

      <section className="panel-grid user-panel-grid">
        <article className="panel-card panel-card-wide">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <CalendarDays size={16} />
                Bookings
              </span>
              <h2>Upcoming consultations</h2>
            </div>
          </div>
          <div className="panel-list">
            {upcoming.length ? (
              upcoming.map((booking) => <BookingRow key={booking.bookingId} booking={booking} />)
            ) : (
              <div className="empty-panel">No upcoming consultation is queued.</div>
            )}
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <Gem size={16} />
                Saved
              </span>
              <h2>Astrology tools</h2>
            </div>
          </div>
          <div className="compact-panel-list">
            {data.savedTools.map((tool) => (
              <div className="compact-panel-row" key={tool.id}>
                <strong>{tool.title}</strong>
                <span>{tool.detail}</span>
                <small>{tool.updatedAt}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <Star size={16} />
                Experts
              </span>
              <h2>Recommended</h2>
            </div>
          </div>
          <div className="compact-panel-list">
            {data.recommendations.map((expert) => (
              <div className="compact-panel-row expert-row" key={expert.id}>
                <div>
                  <strong>{expert.name}</strong>
                  <span>{expert.title}</span>
                </div>
                <Pill tone={expert.status}>{expert.status}</Pill>
                <small>
                  {expert.rating} rating - Rs {expert.pricePerMinute}/min
                </small>
              </div>
            ))}
          </div>
        </article>

        <article className="panel-card panel-card-wide">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <MessageCircle size={16} />
                Activity
              </span>
              <h2>Recent history</h2>
            </div>
          </div>
          <div className="panel-list">
            {history.map((booking) => (
              <BookingRow key={`${booking.bookingId}-history`} booking={booking} />
            ))}
          </div>
        </article>

        <article className="panel-card">
          <div className="panel-card-heading">
            <div>
              <span className="eyebrow">
                <Sparkles size={16} />
                Updates
              </span>
              <h2>Notifications</h2>
            </div>
          </div>
          <div className="notification-list">
            {data.notifications.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default UserPanel;
