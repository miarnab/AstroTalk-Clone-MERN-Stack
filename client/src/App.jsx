import { useEffect, useMemo, useState } from "react";
import { api } from "./api";
import {
  initialAstrologerProfile,
  initialBooking,
  initialFilters,
  initialProfile,
  initialSignIn,
  signInModes
} from "./constants";
import SignInPage from "./components/auth/SignInPage";
import HomePage from "./components/home/HomePage";
import Header from "./components/layout/Header";
import PanelPage from "./components/panels/PanelPage";
import AstrologerProfilePage from "./components/profile/AstrologerProfilePage";
import ProfilePage from "./components/profile/ProfilePage";
import ConsultationSession from "./components/session/ConsultationSession";
import { formatRupees, openRazorpayCheckout } from "./utils/razorpay";

function profileFormFromUser(user = {}) {
  const profile = user.profile || {};

  return {
    ...initialProfile,
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    birthDate: profile.birthDate || "",
    birthTime: profile.birthTime || "",
    place: profile.place || "",
    concern: profile.concern || "",
    gender: profile.gender || "",
    preferredLanguage: profile.preferredLanguage || ""
  };
}

function listToText(value) {
  return Array.isArray(value) ? value.join(", ") : value || "";
}

function astrologerFormFromUser(user = {}) {
  const profile = user.astrologer || {};

  return {
    ...initialAstrologerProfile,
    name: user.name || profile.name || "",
    email: user.email || profile.email || "",
    phone: user.phone || profile.phone || "",
    title: profile.title || "",
    bio: profile.bio || "",
    city: profile.city || "",
    specialties: listToText(profile.specialties),
    languages: listToText(profile.languages),
    experience: profile.experience ?? "",
    pricePerMinute: profile.pricePerMinute ?? "",
    modes: profile.modes?.length ? profile.modes : initialAstrologerProfile.modes,
    status: profile.status || "online",
    responseTime: profile.responseTime || "",
    availability: profile.availability || "",
    education: profile.education || "",
    certifications: profile.certifications || "",
    accent: profile.accent || initialAstrologerProfile.accent
  };
}

function bookingDefaultsFromUser(user, mode = "chat", durationMinutes = initialBooking.durationMinutes) {
  const profile = user?.profile || {};

  return {
    ...initialBooking,
    name: user?.name || "",
    concern: profile.concern || "",
    birthDate: profile.birthDate || "",
    birthTime: profile.birthTime || "",
    place: profile.place || "",
    durationMinutes,
    mode
  };
}

function profilePayloadFromForm(form) {
  return {
    name: form.name,
    phone: form.phone,
    profile: {
      birthDate: form.birthDate,
      birthTime: form.birthTime,
      place: form.place,
      concern: form.concern,
      gender: form.gender,
      preferredLanguage: form.preferredLanguage
    }
  };
}

function astrologerPayloadFromForm(form) {
  return {
    name: form.name,
    phone: form.phone,
    astrologer: {
      title: form.title,
      bio: form.bio,
      city: form.city,
      specialties: form.specialties,
      languages: form.languages,
      experience: form.experience,
      pricePerMinute: form.pricePerMinute,
      modes: form.modes,
      status: form.status,
      responseTime: form.responseTime,
      availability: form.availability,
      education: form.education,
      certifications: form.certifications,
      accent: form.accent
    }
  };
}

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
  const [profileForm, setProfileForm] = useState(initialProfile);
  const [astrologerProfileForm, setAstrologerProfileForm] = useState(initialAstrologerProfile);
  const [profileStatus, setProfileStatus] = useState({ loading: false, error: "", success: "" });
  const [activeConsultation, setActiveConsultation] = useState(null);

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
      setProfileForm(initialProfile);
      setAstrologerProfileForm(initialAstrologerProfile);
      setProfileStatus({ loading: false, error: "", success: "" });
      return;
    }

    if (session.user.role === "user") {
      setProfileForm(profileFormFromUser(session.user));
    } else if (session.user.role === "astrologer") {
      setAstrologerProfileForm(astrologerFormFromUser(session.user));
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
    setBooking(bookingDefaultsFromUser(session?.user, mode));
    setBookingResult(null);
    setBookingStatus({ loading: false, error: "" });

    if (typeof window !== "undefined" && window.innerWidth <= 720) {
      window.requestAnimationFrame(() => {
        document.querySelector(".booking-panel.has-selection")?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      });
    }
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

      let confirmation;

      try {
        confirmation = await collectPayment(
          paymentOrder,
          `${booking.mode} consultation with ${selectedAstrologer.name}`
        );
      } catch (paymentError) {
        if (!paymentOrder?.order?.id) throw paymentError;

        confirmation = await api.openFailedConsultation(
          {
            razorpayOrderId: paymentOrder.order.id,
            reason: paymentError.message
          },
          session
        );
      }

      setBookingResult(confirmation.booking);
      setActiveConsultation(confirmation.booking);
      setActivePage("session");
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

  function openConsultationSession(consultation) {
    if (!consultation) return;
    setActiveConsultation(consultation);
    setActivePage("session");
  }

  function closeConsultationSession() {
    setActiveConsultation(null);
    setActivePage(session ? "panel" : "home");

    if (session) {
      loadPanelData(session);
    }
  }

  function openSignIn() {
    setReturnToBooking(false);
    setActivePage("signin");
  }

  function openProfile() {
    if (!session) {
      openSignIn();
      return;
    }

    if (session.user.role !== "user") {
      if (session.user.role === "astrologer") {
        setAstrologerProfileForm(astrologerFormFromUser(session.user));
        setProfileStatus({ loading: false, error: "", success: "" });
        setActivePage("astrologer-profile");
        return;
      }

      setActivePage("panel");
      return;
    }

    setProfileForm(profileFormFromUser(session.user));
    setProfileStatus({ loading: false, error: "", success: "" });
    setActivePage("profile");
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

  async function loadPanelData(activeSession = session) {
    if (!activeSession) return;

    setPanelStatus({ loading: true, error: "" });

    try {
      const loadPanel =
        activeSession.user.role === "admin"
          ? api.adminPanel
          : activeSession.user.role === "astrologer"
            ? api.astrologerPanel
            : api.userPanel;
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

  function updateProfileField(key, value) {
    setProfileForm((current) => ({ ...current, [key]: value }));
    setProfileStatus((current) => ({ ...current, error: "", success: "" }));
  }

  function updateAstrologerProfileField(key, value) {
    setAstrologerProfileForm((current) => ({ ...current, [key]: value }));
    setProfileStatus((current) => ({ ...current, error: "", success: "" }));
  }

  async function refreshCatalog() {
    const [filterPayload, statsPayload, astrologerPayload] = await Promise.all([
      api.filters(),
      api.stats(),
      api.astrologers(filters)
    ]);
    setFilterOptions(filterPayload);
    setStats(statsPayload);
    setAstrologers(astrologerPayload);
  }

  async function submitProfile(event) {
    event.preventDefault();

    if (!session) {
      openSignIn();
      return;
    }

    setProfileStatus({ loading: true, error: "", success: "" });

    try {
      const isAstrologer = session.user.role === "astrologer";
      const payload = await api.updateProfile(
        isAstrologer
          ? astrologerPayloadFromForm(astrologerProfileForm)
          : profilePayloadFromForm(profileForm),
        session
      );
      setSession(payload);
      if (isAstrologer) {
        setAstrologerProfileForm(astrologerFormFromUser(payload.user));
        await refreshCatalog();
      } else {
        setProfileForm(profileFormFromUser(payload.user));
      }
      setProfileStatus({ loading: false, error: "", success: payload.message });

      if (!isAstrologer && selectedAstrologer) {
        setBooking((current) =>
          bookingDefaultsFromUser(payload.user, current.mode, current.durationMinutes)
        );
      }
    } catch (error) {
      setProfileStatus({ loading: false, error: error.message, success: "" });
    }
  }

  async function submitSignIn(event) {
    event.preventDefault();
    setSignInStatus({ loading: true, error: "", success: "" });

    try {
      const payload =
        authMode === "register" ? await api.register(signInForm) : await api.signIn(signInForm);
      setSession(payload);
      if (payload.user.role === "astrologer") {
        setAstrologerProfileForm(astrologerFormFromUser(payload.user));
        await refreshCatalog();
      } else {
        setProfileForm(profileFormFromUser(payload.user));
      }
      if (returnToBooking && selectedAstrologer) {
        setBooking((current) =>
          bookingDefaultsFromUser(payload.user, current.mode, current.durationMinutes)
        );
      }
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
    setActiveConsultation(null);
    setSignInStatus({ loading: false, error: "", success: "" });
    setWalletStatus({ loading: false, error: "", success: "" });
    setProfileForm(initialProfile);
    setAstrologerProfileForm(initialAstrologerProfile);
    setProfileStatus({ loading: false, error: "", success: "" });
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
        onOpenProfile={openProfile}
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
          onLogout={logout}
          onSelectAuthMode={selectAuthMode}
          onSelectRole={selectSignInRole}
          onSubmit={submitSignIn}
          onTogglePassword={() => setShowPassword((current) => !current)}
        />
      ) : activePage === "session" && session ? (
        <ConsultationSession
          booking={activeConsultation || bookingResult}
          session={session}
          onBack={closeConsultationSession}
        />
      ) : activePage === "panel" && session ? (
        <PanelPage
          session={session}
          data={panelData}
          status={panelStatus}
          walletStatus={walletStatus}
          onOpenSession={openConsultationSession}
          onOpenProfile={openProfile}
          onRefresh={() => loadPanelData(session)}
          onWalletRecharge={rechargeWallet}
        />
      ) : activePage === "astrologer-profile" && session?.user.role === "astrologer" ? (
        <AstrologerProfilePage
          form={astrologerProfileForm}
          status={profileStatus}
          onBack={() => setActivePage("panel")}
          onChange={updateAstrologerProfileField}
          onSubmit={submitProfile}
        />
      ) : activePage === "profile" && session?.user.role === "user" ? (
        <ProfilePage
          form={profileForm}
          status={profileStatus}
          onBack={() => setActivePage("panel")}
          onChange={updateProfileField}
          onSubmit={submitProfile}
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
          onOpenSession={openConsultationSession}
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
