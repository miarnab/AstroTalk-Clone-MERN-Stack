import { ChevronRight, Search, Sparkles } from "lucide-react";

function HeroSection({ filters, onlineCount, stats, onFilterChange }) {
  return (
    <section className="hero-grid">
      <div className="hero-copy">
        <div className="eyebrow">
          <Sparkles size={16} />
          Live astrology consultation
        </div>
        <h1>Talk to verified astrologers in minutes.</h1>
        <p>
          Browse experts, compare pricing, check availability, and book a chat or call from one
          focused dashboard.
        </p>

        <div className="hero-search" role="search">
          <Search size={19} />
          <input
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
            placeholder="Search love, career, tarot..."
            aria-label="Search astrologers"
          />
          <a className="primary-link" href="#astrologers">
            Explore
            <ChevronRight size={17} />
          </a>
        </div>

        <div className="stat-strip" aria-label="Platform stats">
          {stats.map((item) => (
            <div className="stat-tile" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-panel" aria-label="Consultation preview">
        <img src="/assets/consultation-visual.svg" alt="Astrology consultation interface" />
        <div className="live-card">
          <span className="pulse-dot" />
          {onlineCount} experts online
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
