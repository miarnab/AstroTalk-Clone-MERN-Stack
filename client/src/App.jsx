import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import {
  initialBooking,
  initialFilters,
  initialSignIn,
  signInModes
} from "./constants";
import SignInPage from "./components/auth/SignInPage";
import HomePage from "./components/home/HomePage";
import Header from "./components/layout/Header";
import PanelPage from "./components/panels/PanelPage";
import { formatRupees, openRazorpayCheckout } from "./utils/razorpay";

function App() {
  const [astrologers, setAstrologers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [filterOptions, setFilterOptions] = useState({ specialties: [], languages: [] });
  const [stats, setStats] = useState([]);
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [selectedSign, setSelectedSign] = useState("Leo");
  const [horoscope, setHoroscope] = useState(null);
  const [selectedAstrologer, setSelectedAstrologer] = useState(null);
  const [booking, setBooking] = useState(initialBooking);
  const [bookingResult, setBookingResult] = useState(null);
  const [bookingStatus, setBookingStatus] = useState({ loading: false, error: "" });
  const [kundliForm, setKundliForm] = useState({
    name: "Mitra",
    birthDate: "1996-08-18",
    birthTime: "07:30",
    place: "Delhi"
  });
  const [kundli, setKundli] = useState(null);
  const [matchForm, setMatchForm] = useState({
    firstName: "Aarav",
    firstSign: "Leo",
    secondName: "Meera",
    secondSign: "Libra"
  });
  const [match, setMatch] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [activePage, setActivePage] = useState("home");
  const [authMode, setAuthMode] = useState("signin");
  const [signInForm, setSignInForm] = useState(initialSignIn);
  const [signInStatus, setSignInStatus] = useState({
    loading: false,
    error: "",
    success: ""
  });
  const [session, setSession] = useState(null);
  const [returnToBooking, setReturnToBooking] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [panelData, setPanelData] = useState(null);
  const [panelStatus, setPanelStatus] = useState({ loading: false, error: "" });
  const [walletStatus, setWalletStatus] = useState({ loading: false, error: "", success: "" });

  useEffect(() => {
    Promise.all([api.filters(), api.stats(), api.services(), api.testimonials()])
      .then(([filterPayload, statsPayload, servicePayload, reviewPayload]) => {
        setFilterOptions(filterPayload);
        setStats(statsPayload);
        setServices(servicePayload);
        setTestimonials(reviewPayload);
      })
      .catch((error) => setStatus((current) => ({ ...current, error: error.message })));
  }, []);

  useEffect(() => {
    setStatus((current) => ({ ...current, loading: true }));
    api
      .astrologers(filters)
      .then((payload) => {
        setAstrologers(payload);
        setStatus({ loading: false, error: "" });
      })
      .catch((error) => setStatus({ loading: false, error: error.message }));
  }, [filters]);

  useEffect(() => {
    api.horoscope(selectedSign).then(setHoroscope).catch(() => {});
  }, [selectedSign]);

  useEffect(() => {
    if (!session) {
      setPanelData(null);
      setPanelStatus({ loading: false, error: "" });
      return;
    }

    loadPanelData(session);
  }, [session]);

  const onlineCount = useMemo(
    () => astrologers.filter((item) => item.status === "online").length,
    [astrologers]
  );

  async function collectPayment(paymentOrder, description) {
    const response = await openRazorpayCheckout({
      key: paymentOrder.key,
      order: paymentOrder.order,
      description,
      prefill: {
        name: session?.user?.name || "",
        email: session?.user?.email || "",
        contact: session?.user?.phone || ""
      },
      notes: {
        purpose: paymentOrder.purpose
      }
    });

    return api.verifyPayment(response, session);
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function chooseAstrologer(astrologer, mode) {
    setSelectedAstrologer(astrologer);
    setBooking({ ...initialBooking, name: session?.user?.name || "", mode });
    setBookingResult(null);
    setBookingStatus({ loading: false, error: "" });
  }

  function clearSelectedAstrologer() {
    setSelectedAstrologer(null);
    setBookingResult(null);
    setBookingStatus({ loading: false, error: "" });
  }

  function updateBookingField(key, value) {
    setBooking((current) => ({ ...current, [key]: value }));
    setBookingStatus((current) => ({ ...current, error: "" }));
  }

  function updateBookingMode(mode) {
    setBooking((current) => ({ ...current, mode }));
  }

  async function submitBooking(event) {
    event.preventDefault();
    if (!selectedAstrologer) return;

    if (!session) {
      setBookingStatus({
        loading: false,
        error: "Sign in to book a chat or call with astrologers."
      });
      setReturnToBooking(true);
      setActivePage("signin");
      return;
    }

    setBookingStatus({ loading: true, error: "" });

    try {
      const paymentOrder = await api.book(
        {
          astrologerId: selectedAstrologer.id,
          ...booking
        },
        session
      );
      const confirmation = await collectPayment(
        paymentOrder,
        `${booking.mode} consultation with ${selectedAstrologer.name}`
      );
      setBookingResult(confirmation.booking);
      setBookingStatus({ loading: false, error: "" });
      loadPanelData(session);
    } catch (error) {
      setBookingStatus({ loading: false, error: error.message });
    }
  }

  function updateKundliField(key, value) {
    setKundliForm((current) => ({ ...current, [key]: value }));
  }

  async function submitKundli(event) {
    event.preventDefault();
    const payload = await api.kundli(kundliForm);
    setKundli(payload);
  }

  function updateMatchField(key, value) {
    setMatchForm((current) => ({ ...current, [key]: value }));
  }

  async function submitMatch(event) {
    event.preventDefault();
    const payload = await api.compatibility(matchForm);
    setMatch(payload);
  }

  function openHome() {
    setActivePage("home");
  }

  function openSignIn() {
    setReturnToBooking(false);
    setActivePage("signin");
  }

  function openBookingSignIn() {
    setReturnToBooking(true);
    setAuthMode("signin");
    setSignInForm((current) => ({
      ...initialSignIn,
      remember: current.remember
    }));
    setShowPassword(false);
    setSignInStatus({ loading: false, error: "", success: "" });
    setActivePage("signin");
  }

  function updateSignInField(key, value) {
    setSignInForm((current) => ({ ...current, [key]: value }));
    setSignInStatus((current) => ({ ...current, error: "", success: "" }));
  }

  function selectAuthMode(mode) {
    setAuthMode(mode);
    setShowPassword(false);
    setSignInStatus({ loading: false, error: "", success: "" });
  }

  function selectSignInRole(role) {
    setSignInForm((current) => ({
      ...initialSignIn,
      role,
      remember: current.remember
    }));
    setShowPassword(false);
    setSignInStatus({ loading: false, error: "", success: "" });
  }

  function fillDemoCredentials() {
    const mode = signInModes[signInForm.role];
    setSignInForm((current) => ({
      ...current,
      email: mode.email,
      password: mode.password,
      adminCode: mode.adminCode || ""
    }));
    setSignInStatus({ loading: false, error: "", success: "" });
  }

  async function loadPanelData(activeSession = session) {
    if (!activeSession) return;

    setPanelStatus({ loading: true, error: "" });

    try {
      const loadPanel = activeSession.user.role === "admin" ? api.adminPanel : api.userPanel;
      const payload = await loadPanel(activeSession);
      setPanelData(payload);
      setPanelStatus({ loading: false, error: "" });
    } catch (error) {
      setPanelStatus({ loading: false, error: error.message });
    }
  }

  async function rechargeWallet(amount) {
    if (!session) return;

    const rechargeAmount = Number(amount);

    if (!Number.isFinite(rechargeAmount) || rechargeAmount < 50) {
      setWalletStatus({
        loading: false,
        error: "Enter at least Rs 50 to recharge.",
        success: ""
      });
      return;
    }

    setWalletStatus({ loading: true, error: "", success: "" });

    try {
      const paymentOrder = await api.rechargeWallet({ amount: rechargeAmount }, session);
      const confirmation = await collectPayment(paymentOrder, "AstroTalk wallet recharge");
      setWalletStatus({
        loading: false,
        error: "",
        success: `Wallet recharged with ${formatRupees(confirmation.recharge.amount)}.`
      });
      loadPanelData(session);
    } catch (error) {
      setWalletStatus({ loading: false, error: error.message, success: "" });
    }
  }

  async function submitSignIn(event) {
    event.preventDefault();
    setSignInStatus({ loading: true, error: "", success: "" });

    try {
      const payload =
        authMode === "register" ? await api.register(signInForm) : await api.signIn(signInForm);
      setSession(payload);
      setSignInStatus({ loading: false, error: "", success: payload.message });
      setActivePage(returnToBooking && selectedAstrologer ? "home" : "panel");
      setReturnToBooking(false);
    } catch (error) {
      setSession(null);
      setPanelData(null);
      setSignInStatus({ loading: false, error: error.message, success: "" });
    }
  }

  function logout() {
    setSession(null);
    setPanelData(null);
    setSignInStatus({ loading: false, error: "", success: "" });
    setWalletStatus({ loading: false, error: "", success: "" });
    setReturnToBooking(false);
    setActivePage("home");
  }

  return (
    <div className="app-shell">
      <Header
        activePage={activePage}
        session={session}
        onHome={openHome}
        onLogout={logout}
        onOpenPanel={() => setActivePage("panel")}
        onOpenSignIn={openSignIn}
      />

      {activePage === "signin" ? (
        <SignInPage
          authMode={authMode}
          form={signInForm}
          status={signInStatus}
          session={session}
          showPassword={showPassword}
          onBack={openHome}
          onChange={updateSignInField}
          onFillDemo={fillDemoCredentials}
          onLogout={logout}
          onSelectAuthMode={selectAuthMode}
          onSelectRole={selectSignInRole}
          onSubmit={submitSignIn}
          onTogglePassword={() => setShowPassword((current) => !current)}
        />
      ) : activePage === "panel" && session ? (
        <PanelPage
          session={session}
          data={panelData}
          status={panelStatus}
          walletStatus={walletStatus}
          onRefresh={() => loadPanelData(session)}
          onWalletRecharge={rechargeWallet}
        />
      ) : (
        <HomePage
          astrologers={astrologers}
          booking={booking}
          bookingResult={bookingResult}
          bookingStatus={bookingStatus}
          filterOptions={filterOptions}
          filters={filters}
          horoscope={horoscope}
          kundli={kundli}
          kundliForm={kundliForm}
          match={match}
          matchForm={matchForm}
          onlineCount={onlineCount}
          selectedAstrologer={selectedAstrologer}
          selectedSign={selectedSign}
          session={session}
          services={services}
          stats={stats}
          status={status}
          testimonials={testimonials}
          onBookingChange={updateBookingField}
          onBookingModeChange={updateBookingMode}
          onClearAstrologer={clearSelectedAstrologer}
          onFilterChange={updateFilter}
          onKundliChange={updateKundliField}
          onMatchChange={updateMatchField}
          onRequireSignIn={openBookingSignIn}
          onSelectAstrologer={chooseAstrologer}
          onSelectedSignChange={setSelectedSign}
          onSubmitBooking={submitBooking}
          onSubmitKundli={submitKundli}
          onSubmitMatch={submitMatch}
        />
      )}
    </div>
  );
}

export default App;
