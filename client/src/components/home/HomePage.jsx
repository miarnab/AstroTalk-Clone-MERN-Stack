import AstrologerWorkbench from "./AstrologerWorkbench";
import AstrologyTools from "./AstrologyTools";
import HeroSection from "./HeroSection";
import ReviewsSection from "./ReviewsSection";
import ServicesSection from "./ServicesSection";

function HomePage({
  astrologers,
  booking,
  bookingResult,
  bookingStatus,
  filterOptions,
  filters,
  horoscope,
  kundli,
  kundliForm,
  match,
  matchForm,
  onlineCount,
  selectedAstrologer,
  selectedSign,
  session,
  services,
  stats,
  status,
  testimonials,
  onBookingChange,
  onBookingModeChange,
  onClearAstrologer,
  onFilterChange,
  onKundliChange,
  onMatchChange,
  onOpenSession,
  onRequireSignIn,
  onSelectAstrologer,
  onSelectedSignChange,
  onSubmitBooking,
  onSubmitKundli,
  onSubmitMatch
}) {
  return (
    <main id="top">
      <HeroSection
        filters={filters}
        onlineCount={onlineCount}
        stats={stats}
        onFilterChange={onFilterChange}
      />

      {status.error ? <div className="alert">{status.error}</div> : null}

      <AstrologerWorkbench
        astrologers={astrologers}
        booking={booking}
        bookingResult={bookingResult}
        bookingStatus={bookingStatus}
        filterOptions={filterOptions}
        filters={filters}
        onlineCount={onlineCount}
        selectedAstrologer={selectedAstrologer}
        session={session}
        status={status}
        onBookingChange={onBookingChange}
        onBookingModeChange={onBookingModeChange}
        onClearAstrologer={onClearAstrologer}
        onFilterChange={onFilterChange}
        onOpenSession={onOpenSession}
        onRequireSignIn={onRequireSignIn}
        onSelectAstrologer={onSelectAstrologer}
        onSubmitBooking={onSubmitBooking}
      />

      <AstrologyTools
        horoscope={horoscope}
        kundli={kundli}
        kundliForm={kundliForm}
        match={match}
        matchForm={matchForm}
        selectedSign={selectedSign}
        onKundliChange={onKundliChange}
        onMatchChange={onMatchChange}
        onSelectedSignChange={onSelectedSignChange}
        onSubmitKundli={onSubmitKundli}
        onSubmitMatch={onSubmitMatch}
      />

      <ServicesSection services={services} />
      <ReviewsSection testimonials={testimonials} />
    </main>
  );
}

export default HomePage;
