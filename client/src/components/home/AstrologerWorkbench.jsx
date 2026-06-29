import { Search, SlidersHorizontal } from "lucide-react";
import AdvisorCard from "./AdvisorCard";
import BookingPanel from "./BookingPanel";

function AstrologerWorkbench({
  astrologers,
  booking,
  bookingResult,
  bookingStatus,
  filterOptions,
  filters,
  onlineCount,
  selectedAstrologer,
  session,
  status,
  onBookingChange,
  onBookingModeChange,
  onClearAstrologer,
  onFilterChange,
  onOpenSession,
  onRequireSignIn,
  onSelectAstrologer,
  onSubmitBooking
}) {
  return (
    <section className="workbench" id="astrologers">
      <div className="section-heading">
        <div>
          <span className="eyebrow">
            <SlidersHorizontal size={16} />
            Consultation desk
          </span>
          <h2>Find an astrologer</h2>
        </div>
        <div className="availability-chip">
          <span className="pulse-dot" />
          {onlineCount} live now
        </div>
      </div>

      <div className="filter-bar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={filters.search}
            onChange={(event) => onFilterChange("search", event.target.value)}
            placeholder="Name, skill, language"
          />
        </label>

        <select
          value={filters.specialty}
          onChange={(event) => onFilterChange("specialty", event.target.value)}
          aria-label="Specialty"
        >
          <option value="">All specialties</option>
          {filterOptions.specialties.map((specialty) => (
            <option key={specialty} value={specialty}>
              {specialty}
            </option>
          ))}
        </select>

        <select
          value={filters.language}
          onChange={(event) => onFilterChange("language", event.target.value)}
          aria-label="Language"
        >
          <option value="">All languages</option>
          {filterOptions.languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>

        <select
          value={filters.mode}
          onChange={(event) => onFilterChange("mode", event.target.value)}
          aria-label="Mode"
        >
          <option value="">Chat or call</option>
          <option value="chat">Chat</option>
          <option value="call">Call</option>
        </select>

        <select
          value={filters.sort}
          onChange={(event) => onFilterChange("sort", event.target.value)}
          aria-label="Sort"
        >
          <option value="recommended">Recommended</option>
          <option value="rating">Top rated</option>
          <option value="experience">Most experienced</option>
          <option value="price">Lowest price</option>
        </select>
      </div>

      <div className="content-grid">
        <div className="advisor-grid">
          {status.loading ? (
            <div className="loading-card">Loading astrologers...</div>
          ) : (
            astrologers.map((astrologer) => (
              <AdvisorCard
                key={astrologer.id}
                astrologer={astrologer}
                onSelect={onSelectAstrologer}
              />
            ))
          )}
        </div>

        <BookingPanel
          booking={booking}
          bookingResult={bookingResult}
          bookingStatus={bookingStatus}
          canBook={Boolean(session)}
          selectedAstrologer={selectedAstrologer}
          onBookingChange={onBookingChange}
          onClear={onClearAstrologer}
          onModeChange={onBookingModeChange}
          onOpenSession={onOpenSession}
          onRequireSignIn={onRequireSignIn}
          onSubmit={onSubmitBooking}
        />
      </div>
    </section>
  );
}

export default AstrologerWorkbench;
