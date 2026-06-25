import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Compass,
  Eye,
  EyeOff,
  Gem,
  HeartHandshake,
  KeyRound,
  Languages,
  LogOut,
  Mail,
  MessageCircle,
  Moon,
  Phone,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sun,
  UserCog,
  UserPlus,
  WalletCards,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "./api";

const signs = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces"
];

const initialFilters = {
  search: "",
  specialty: "",
  language: "",
  mode: "",
  sort: "recommended"
};

const initialBooking = {
  name: "",
  concern: "",
  birthDate: "",
  birthTime: "",
  place: "",
  mode: "chat"
};

const initialSignIn = {
  role: "user",
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  adminCode: "",
  remember: true
};

const signInModes = {
  user: {
    label: "Customer",
    signInTitle: "Sign in as a customer",
    registerTitle: "Create customer account",
    signInDescription: "Continue bookings, wallet activity, saved kundli details, and chat history.",
    registerDescription: "Register for consultations, wallet access, saved kundli details, and chat history.",
    email: "customer@astrotalk.test",
    password: "user123",
    highlights: ["Saved consultations", "Wallet balance", "Personalized tools"]
  },
  admin: {
    label: "Admin",
    signInTitle: "Sign in as admin",
    registerTitle: "Create admin account",
    signInDescription: "Manage astrologers, bookings, service content, and live support queues.",
    registerDescription: "Register an operations account for approvals, bookings, and service controls.",
    email: "admin@astrotalk.test",
    password: "admin123",
    adminCode: "ADMIN-2026",
    highlights: ["Astrologer approvals", "Booking desk", "Catalog controls"]
  }
};

function initials(name) {
  return name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2);
}

function Pill({ children, tone = "neutral" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function ProgressRow({ label, value }) {
  return (
    <div className="progress-row">
      <span>{label}</span>
      <div className="meter" aria-hidden="true">
        <span style={{ width: `${value}%` }} />
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function SignInPage({
  authMode,
  form,
  status,
  session,
  showPassword,
  onBack,
  onChange,
  onFillDemo,
  onLogout,
  onSelectAuthMode,
  onSelectRole,
  onSubmit,
  onTogglePassword
}) {
  const mode = signInModes[form.role];
  const isRegistering = authMode === "register";
  const panelTitle = isRegistering ? mode.registerTitle : mode.signInTitle;
  const panelDescription = isRegistering ? mode.registerDescription : mode.signInDescription;
  const submitLabel = isRegistering ? `Register ${mode.label}` : `Sign in as ${mode.label}`;

  return (
    <main className="signin-page" id="signin">
      <section className="signin-shell" aria-labelledby="signin-title">
        <div className="signin-copy">
          <button className="back-button" type="button" onClick={onBack}>
            <ArrowLeft size={18} />
            Home
          </button>

          <span className="eyebrow">
            {isRegistering ? <UserPlus size={16} /> : <KeyRound size={16} />}
            Account access
          </span>
          <h1 id="signin-title">Create customer and admin accounts.</h1>
          <p>
            Register new accounts, sign back in, and continue into the right AstroTalk workspace
            from the same screen.
          </p>

          <div className="signin-highlights" aria-label={`${mode.label} account benefits`}>
            {mode.highlights.map((item) => (
              <span key={item}>
                <CheckCircle2 size={17} />
                {item}
              </span>
            ))}
          </div>

          <div className="signin-status-card">
            <div className="status-icon">
              {form.role === "admin" ? <UserCog size={22} /> : <CircleUserRound size={22} />}
            </div>
            <div>
              <strong>{session ? session.user.dashboard : panelTitle}</strong>
              <span>{session ? session.nextStep : panelDescription}</span>
            </div>
          </div>
        </div>

        <div className="signin-panel">
          <div className="auth-mode-switch" role="tablist" aria-label="Account action">
            <button
              type="button"
              role="tab"
              aria-selected={authMode === "signin"}
              className={authMode === "signin" ? "active" : ""}
              onClick={() => onSelectAuthMode("signin")}
            >
              <KeyRound size={18} />
              Sign in
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={authMode === "register"}
              className={authMode === "register" ? "active" : ""}
              onClick={() => onSelectAuthMode("register")}
            >
              <UserPlus size={18} />
              Register
            </button>
          </div>

          <div className="role-switch" role="tablist" aria-label="Account role">
            {Object.entries(signInModes).map(([role, item]) => (
              <button
                type="button"
                role="tab"
                key={role}
                aria-selected={form.role === role}
                className={form.role === role ? "active" : ""}
                onClick={() => onSelectRole(role)}
              >
                {role === "admin" ? <UserCog size={18} /> : <CircleUserRound size={18} />}
                {item.label}
              </button>
            ))}
          </div>

          <form className="signin-form" onSubmit={onSubmit}>
            <div className="signin-form-heading">
              <h2>{panelTitle}</h2>
              <p>{panelDescription}</p>
            </div>

            {isRegistering ? (
              <>
                <label>
                  Full name
                  <span className="input-shell">
                    <CircleUserRound size={18} />
                    <input
                      value={form.name}
                      onChange={(event) => onChange("name", event.target.value)}
                      placeholder="Account holder name"
                      autoComplete="name"
                      required
                    />
                  </span>
                </label>

                <label>
                  Phone
                  <span className="input-shell">
                    <Phone size={18} />
                    <input
                      value={form.phone}
                      onChange={(event) => onChange("phone", event.target.value)}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      required
                    />
                  </span>
                </label>
              </>
            ) : null}

            <label>
              Email
              <span className="input-shell">
                <Mail size={18} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => onChange("email", event.target.value)}
                  placeholder={mode.email}
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            <label>
              Password
              <span className="input-shell">
                <KeyRound size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) => onChange("password", event.target.value)}
                  placeholder="Minimum 6 characters"
                  autoComplete={isRegistering ? "new-password" : "current-password"}
                  required
                  minLength={6}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={onTogglePassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {isRegistering ? (
              <label>
                Confirm password
                <span className="input-shell">
                  <KeyRound size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(event) => onChange("confirmPassword", event.target.value)}
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                  />
                </span>
              </label>
            ) : null}

            {form.role === "admin" ? (
              <label>
                {isRegistering ? "Admin registration code" : "Admin access code"}
                <span className="input-shell">
                  <ShieldCheck size={18} />
                  <input
                    value={form.adminCode}
                    onChange={(event) => onChange("adminCode", event.target.value)}
                    placeholder="ADMIN-2026"
                    autoComplete="one-time-code"
                    required
                  />
                </span>
              </label>
            ) : null}

            {!isRegistering ? (
              <div className="signin-options">
                <label className="checkbox-line">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(event) => onChange("remember", event.target.checked)}
                  />
                  Remember me
                </label>
                <button className="text-button" type="button" onClick={onFillDemo}>
                  Use demo
                </button>
              </div>
            ) : null}

            {status.error ? <div className="form-error">{status.error}</div> : null}
            {status.success ? <div className="form-success">{status.success}</div> : null}

            <button className="primary-button" type="submit" disabled={status.loading}>
              {isRegistering ? <UserPlus size={18} /> : <KeyRound size={18} />}
              {status.loading ? (isRegistering ? "Registering..." : "Signing in...") : submitLabel}
            </button>
          </form>

          {session ? (
            <div className="signed-session">
              <div>
                <strong>{session.user.name}</strong>
                <span>
                  {session.user.role === "admin" ? "admin" : "customer"} - {session.user.email}
                </span>
              </div>
              <button className="secondary-button" type="button" onClick={onLogout}>
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          ) : !isRegistering ? (
            <div className="demo-credentials">
              <strong>Demo {mode.label.toLowerCase()} login</strong>
              <span>
                {mode.email} / {mode.password}
                {mode.adminCode ? ` / ${mode.adminCode}` : ""}
              </span>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function formatPanelDate(value) {
  if (!value) return "Today";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function PanelMetric({ icon, label, value, detail, tone = "teal" }) {
  return (
    <article className={`panel-metric tone-${tone}`}>
      <span className="panel-icon">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

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

function UserPanel({ session, data, status, onRefresh }) {
  const wallet = data.wallet;
  const upcoming = data.upcoming || [];
  const history = data.history || [];

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
          <button className="secondary-button" type="button" onClick={onRefresh} disabled={status.loading}>
            {status.loading ? "Syncing..." : "Refresh"}
          </button>
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

function AdminPanel({ session, data, status, onRefresh }) {
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
              <BookingRow key={booking.bookingId} booking={booking} />
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

function PanelPage({ session, data, status, onRefresh }) {
  if (status.loading && !data) {
    return (
      <main className="panel-page">
        <div className="loading-card">Loading {session.user.role} panel...</div>
      </main>
    );
  }

  if (status.error && !data) {
    return (
      <main className="panel-page">
        <div className="alert">{status.error}</div>
      </main>
    );
  }

  if (!data) return null;

  return session.user.role === "admin" ? (
    <AdminPanel session={session} data={data} status={status} onRefresh={onRefresh} />
  ) : (
    <UserPanel session={session} data={data} status={status} onRefresh={onRefresh} />
  );
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
  const [showPassword, setShowPassword] = useState(false);
  const [panelData, setPanelData] = useState(null);
  const [panelStatus, setPanelStatus] = useState({ loading: false, error: "" });

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

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function chooseAstrologer(astrologer, mode) {
    setSelectedAstrologer(astrologer);
    setBooking({ ...initialBooking, mode });
    setBookingResult(null);
  }

  async function submitBooking(event) {
    event.preventDefault();
    if (!selectedAstrologer) return;

    const payload = await api.book({
      astrologerId: selectedAstrologer.id,
      ...booking
    });
    setBookingResult(payload);

    if (session) {
      loadPanelData(session);
    }
  }

  async function submitKundli(event) {
    event.preventDefault();
    const payload = await api.kundli(kundliForm);
    setKundli(payload);
  }

  async function submitMatch(event) {
    event.preventDefault();
    const payload = await api.compatibility(matchForm);
    setMatch(payload);
  }

  function openHome() {
    setActivePage("home");
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
      const loadPanel =
        activeSession.user.role === "admin" ? api.adminPanel : api.userPanel;
      const payload = await loadPanel(activeSession);
      setPanelData(payload);
      setPanelStatus({ loading: false, error: "" });
    } catch (error) {
      setPanelStatus({ loading: false, error: error.message });
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
      setActivePage("panel");
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
    setActivePage("home");
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Astrotalk clone home" onClick={openHome}>
          <span className="brand-mark">
            <Sun size={20} />
          </span>
          <span>AstroTalk</span>
        </a>
        <nav className="nav-links" aria-label="Primary navigation">
          <a href="#astrologers" onClick={openHome}>
            Astrologers
          </a>
          <a href="#horoscope" onClick={openHome}>
            Horoscope
          </a>
          <a href="#kundli" onClick={openHome}>
            Kundli
          </a>
          <a href="#match" onClick={openHome}>
            Match
          </a>
        </nav>
        <div className="top-actions">
          <button
            className="icon-button"
            type="button"
            aria-label={session ? "Open account panel" : "Wallet balance"}
            onClick={() => (session ? setActivePage("panel") : setActivePage("signin"))}
          >
            {session?.user.role === "admin" ? <UserCog size={19} /> : <WalletCards size={19} />}
          </button>
          {session ? (
            <div className="account-chip">
              {session.user.role === "admin" ? <UserCog size={18} /> : <CircleUserRound size={18} />}
              <span>
                <strong>{session.user.name}</strong>
                <small>{session.user.role}</small>
              </span>
              <button type="button" aria-label="Sign out" onClick={logout}>
                <LogOut size={16} />
              </button>
            </div>
          ) : activePage === "signin" ? (
            <button className="ghost-button with-icon" type="button" onClick={openHome}>
              <ArrowLeft size={17} />
              Home
            </button>
          ) : (
            <button
              className="ghost-button"
              type="button"
              onClick={() => setActivePage("signin")}
            >
              Sign in
            </button>
          )}
        </div>
      </header>

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
          onRefresh={() => loadPanelData(session)}
        />
      ) : (
      <main id="top">
        <section className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={16} />
              Live astrology consultation
            </div>
            <h1>Talk to verified astrologers in minutes.</h1>
            <p>
              Browse experts, compare pricing, check availability, and book a chat or call from
              one focused dashboard.
            </p>

            <div className="hero-search" role="search">
              <Search size={19} />
              <input
                value={filters.search}
                onChange={(event) => updateFilter("search", event.target.value)}
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

        {status.error ? <div className="alert">{status.error}</div> : null}

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
                onChange={(event) => updateFilter("search", event.target.value)}
                placeholder="Name, skill, language"
              />
            </label>

            <select
              value={filters.specialty}
              onChange={(event) => updateFilter("specialty", event.target.value)}
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
              onChange={(event) => updateFilter("language", event.target.value)}
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
              onChange={(event) => updateFilter("mode", event.target.value)}
              aria-label="Mode"
            >
              <option value="">Chat or call</option>
              <option value="chat">Chat</option>
              <option value="call">Call</option>
            </select>

            <select
              value={filters.sort}
              onChange={(event) => updateFilter("sort", event.target.value)}
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
                  <article className="advisor-card" key={astrologer.id}>
                    <div className="advisor-head">
                      <div className="avatar" style={{ "--accent": astrologer.accent }}>
                        {initials(astrologer.name)}
                      </div>
                      <div>
                        <div className="advisor-name">
                          <h3>{astrologer.name}</h3>
                          <BadgeCheck size={18} />
                        </div>
                        <p>{astrologer.title}</p>
                      </div>
                    </div>

                    <div className="advisor-meta">
                      <span>
                        <Star size={16} />
                        {astrologer.rating}
                      </span>
                      <span>
                        <Clock3 size={16} />
                        {astrologer.experience} yrs
                      </span>
                      <span>
                        <Languages size={16} />
                        {astrologer.languages.join(", ")}
                      </span>
                    </div>

                    <div className="specialty-row">
                      {astrologer.specialties.map((specialty) => (
                        <Pill key={specialty}>{specialty}</Pill>
                      ))}
                    </div>

                    <div className="advisor-footer">
                      <div>
                        <strong>Rs {astrologer.pricePerMinute}/min</strong>
                        <span>{astrologer.orders.toLocaleString("en-IN")} orders</span>
                      </div>
                      <Pill tone={astrologer.status}>{astrologer.status}</Pill>
                    </div>

                    <div className="card-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        disabled={!astrologer.modes.includes("chat")}
                        onClick={() => chooseAstrologer(astrologer, "chat")}
                      >
                        <MessageCircle size={18} />
                        Chat
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        disabled={!astrologer.modes.includes("call")}
                        onClick={() => chooseAstrologer(astrologer, "call")}
                      >
                        <Phone size={18} />
                        Call
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <aside className="booking-panel" aria-label="Booking panel">
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
                    onClick={() => {
                      setSelectedAstrologer(null);
                      setBookingResult(null);
                    }}
                  >
                    <X size={18} />
                  </button>
                ) : null}
              </div>

              {selectedAstrologer ? (
                <form className="booking-form" onSubmit={submitBooking}>
                  <div className="mode-toggle">
                    {["chat", "call"].map((mode) => (
                      <button
                        type="button"
                        key={mode}
                        disabled={!selectedAstrologer.modes.includes(mode)}
                        className={booking.mode === mode ? "active" : ""}
                        onClick={() => setBooking((current) => ({ ...current, mode }))}
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
                      onChange={(event) =>
                        setBooking((current) => ({ ...current, name: event.target.value }))
                      }
                      required
                    />
                  </label>

                  <label>
                    Concern
                    <textarea
                      value={booking.concern}
                      onChange={(event) =>
                        setBooking((current) => ({ ...current, concern: event.target.value }))
                      }
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
                        onChange={(event) =>
                          setBooking((current) => ({ ...current, birthDate: event.target.value }))
                        }
                      />
                    </label>
                    <label>
                      Birth time
                      <input
                        type="time"
                        value={booking.birthTime}
                        onChange={(event) =>
                          setBooking((current) => ({ ...current, birthTime: event.target.value }))
                        }
                      />
                    </label>
                  </div>

                  <label>
                    Birth place
                    <input
                      value={booking.place}
                      onChange={(event) =>
                        setBooking((current) => ({ ...current, place: event.target.value }))
                      }
                    />
                  </label>

                  <button className="primary-button" type="submit">
                    <Send size={18} />
                    Confirm booking
                  </button>
                </form>
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
                      {bookingResult.mode} with {bookingResult.astrologerName} starts in about{" "}
                      {bookingResult.etaMinutes} minutes.
                    </span>
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        </section>

        <section className="tools-band">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <Compass size={16} />
                Astrology tools
              </span>
              <h2>Horoscope, kundli, and matching</h2>
            </div>
          </div>

          <div className="tools-grid">
            <article className="tool-card wide" id="horoscope">
              <div className="tool-heading">
                <div>
                  <span className="eyebrow">
                    <Moon size={16} />
                    Daily horoscope
                  </span>
                  <h3>{horoscope?.sign || selectedSign}</h3>
                </div>
                <select
                  value={selectedSign}
                  onChange={(event) => setSelectedSign(event.target.value)}
                  aria-label="Select zodiac sign"
                >
                  {signs.map((sign) => (
                    <option key={sign} value={sign}>
                      {sign}
                    </option>
                  ))}
                </select>
              </div>
              {horoscope ? (
                <>
                  <div className="horoscope-summary">
                    <Pill tone="solar">{horoscope.date}</Pill>
                    <Pill tone="teal">Mood: {horoscope.mood}</Pill>
                    <Pill tone="rose">Lucky {horoscope.luckyNumber}</Pill>
                  </div>
                  <p className="tool-copy">{horoscope.advice}</p>
                  <div className="progress-list">
                    <ProgressRow label="Love" value={horoscope.love} />
                    <ProgressRow label="Career" value={horoscope.career} />
                    <ProgressRow label="Money" value={horoscope.money} />
                    <ProgressRow label="Energy" value={horoscope.energy} />
                  </div>
                </>
              ) : null}
            </article>

            <article className="tool-card" id="kundli">
              <div className="tool-heading">
                <div>
                  <span className="eyebrow">
                    <Gem size={16} />
                    Free kundli
                  </span>
                  <h3>Birth chart</h3>
                </div>
              </div>
              <form className="compact-form" onSubmit={submitKundli}>
                <input
                  value={kundliForm.name}
                  onChange={(event) =>
                    setKundliForm((current) => ({ ...current, name: event.target.value }))
                  }
                  aria-label="Kundli name"
                  placeholder="Name"
                />
                <div className="two-col">
                  <input
                    type="date"
                    value={kundliForm.birthDate}
                    onChange={(event) =>
                      setKundliForm((current) => ({ ...current, birthDate: event.target.value }))
                    }
                    aria-label="Kundli birth date"
                  />
                  <input
                    type="time"
                    value={kundliForm.birthTime}
                    onChange={(event) =>
                      setKundliForm((current) => ({ ...current, birthTime: event.target.value }))
                    }
                    aria-label="Kundli birth time"
                  />
                </div>
                <input
                  value={kundliForm.place}
                  onChange={(event) =>
                    setKundliForm((current) => ({ ...current, place: event.target.value }))
                  }
                  aria-label="Kundli birth place"
                  placeholder="Birth place"
                />
                <button className="primary-button" type="submit">
                  Generate chart
                </button>
              </form>
              {kundli ? (
                <div className="result-box">
                  <strong>{kundli.ascendant} ascendant</strong>
                  <span>
                    Moon in {kundli.moonSign}, {kundli.nakshatra} nakshatra
                  </span>
                  <span>{kundli.manglik}</span>
                </div>
              ) : null}
            </article>

            <article className="tool-card" id="match">
              <div className="tool-heading">
                <div>
                  <span className="eyebrow">
                    <HeartHandshake size={16} />
                    Matchmaking
                  </span>
                  <h3>Compatibility</h3>
                </div>
              </div>
              <form className="compact-form" onSubmit={submitMatch}>
                <div className="two-col">
                  <input
                    value={matchForm.firstName}
                    onChange={(event) =>
                      setMatchForm((current) => ({ ...current, firstName: event.target.value }))
                    }
                    aria-label="First name"
                    placeholder="First name"
                  />
                  <select
                    value={matchForm.firstSign}
                    onChange={(event) =>
                      setMatchForm((current) => ({ ...current, firstSign: event.target.value }))
                    }
                    aria-label="First sign"
                  >
                    {signs.map((sign) => (
                      <option key={sign} value={sign}>
                        {sign}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="two-col">
                  <input
                    value={matchForm.secondName}
                    onChange={(event) =>
                      setMatchForm((current) => ({ ...current, secondName: event.target.value }))
                    }
                    aria-label="Second name"
                    placeholder="Second name"
                  />
                  <select
                    value={matchForm.secondSign}
                    onChange={(event) =>
                      setMatchForm((current) => ({ ...current, secondSign: event.target.value }))
                    }
                    aria-label="Second sign"
                  >
                    {signs.map((sign) => (
                      <option key={sign} value={sign}>
                        {sign}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="primary-button" type="submit">
                  Check score
                </button>
              </form>
              {match ? (
                <div className="score-ring" style={{ "--score": `${match.score}%` }}>
                  <strong>{match.score}%</strong>
                  <span>{match.gunas}/36 gunas</span>
                  <p>{match.summary}</p>
                </div>
              ) : null}
            </article>
          </div>
        </section>

        <section className="services-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <ShieldCheck size={16} />
                Services
              </span>
              <h2>Everything in one astrology desk</h2>
            </div>
          </div>

          <div className="service-grid">
            {services.map((service) => (
              <article className={`service-card tone-${service.tone}`} key={service.id}>
                <span className="service-icon">
                  <Sparkles size={20} />
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="reviews-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <Star size={16} />
                Reviews
              </span>
              <h2>Recent client notes</h2>
            </div>
          </div>

          <div className="review-grid">
            {testimonials.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="stars" aria-label={`${review.rating} star rating`}>
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ))}
                </div>
                <p>{review.text}</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
        </section>
      </main>
      )}
    </div>
  );
}

export default App;
