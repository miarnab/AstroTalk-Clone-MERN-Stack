import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  Eye,
  EyeOff,
  GraduationCap,
  IndianRupee,
  KeyRound,
  Languages,
  MapPin,
  LogOut,
  Mail,
  MessageCircle,
  Palette,
  Phone,
  ShieldCheck,
  Sparkles,
  UserCog,
  UserPlus
} from "lucide-react";
import { signInModes } from "../../constants";

function SignInPage({
  authMode,
  form,
  status,
  session,
  showPassword,
  onBack,
  onChange,
  onLogout,
  onSelectAuthMode,
  onSelectRole,
  onSubmit,
  onTogglePassword
}) {
  const mode = signInModes[form.role];
  const isRegistering = authMode === "register";
  const isAstrologer = form.role === "astrologer";
  const panelTitle = isRegistering ? mode.registerTitle : mode.signInTitle;
  const panelDescription = isRegistering ? mode.registerDescription : mode.signInDescription;
  const submitLabel = isRegistering ? `Register ${mode.label}` : `Sign in as ${mode.label}`;
  const selectedModes = Array.isArray(form.modes) ? form.modes : [];

  function toggleConsultationMode(value) {
    const nextModes = selectedModes.includes(value)
      ? selectedModes.filter((item) => item !== value)
      : [...selectedModes, value];
    onChange("modes", nextModes);
  }

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
          <h1 id="signin-title">Create customer, astrologer, and admin accounts.</h1>
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
              {form.role === "admin" ? (
                <UserCog size={22} />
              ) : isAstrologer ? (
                <Sparkles size={22} />
              ) : (
                <CircleUserRound size={22} />
              )}
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
                {role === "admin" ? (
                  <UserCog size={18} />
                ) : role === "astrologer" ? (
                  <Sparkles size={18} />
                ) : (
                  <CircleUserRound size={18} />
                )}
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
                  placeholder={mode.emailPlaceholder}
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

            {isRegistering && isAstrologer ? (
              <div className="astrologer-registration-fields">
                <div className="signin-form-heading compact">
                  <h3>Public astrologer listing</h3>
                  <p>These details create the bookable profile shown to customers.</p>
                </div>

                <label>
                  Professional title
                  <span className="input-shell">
                    <BadgeCheck size={18} />
                    <input
                      value={form.title}
                      onChange={(event) => onChange("title", event.target.value)}
                      placeholder="Vedic astrologer, Tarot reader..."
                      required
                    />
                  </span>
                </label>

                <label>
                  Profile bio
                  <span className="textarea-shell">
                    <MessageCircle size={18} />
                    <textarea
                      value={form.bio}
                      onChange={(event) => onChange("bio", event.target.value)}
                      placeholder="Describe your approach, consultation style, and expertise."
                      required
                    />
                  </span>
                </label>

                <div className="two-col">
                  <label>
                    City
                    <span className="input-shell">
                      <MapPin size={18} />
                      <input
                        value={form.city}
                        onChange={(event) => onChange("city", event.target.value)}
                        placeholder="Jaipur"
                        required
                      />
                    </span>
                  </label>

                  <label>
                    Experience
                    <span className="input-shell">
                      <Clock3 size={18} />
                      <input
                        type="number"
                        min="0"
                        max="80"
                        value={form.experience}
                        onChange={(event) => onChange("experience", event.target.value)}
                        placeholder="8"
                        required
                      />
                    </span>
                  </label>
                </div>

                <div className="two-col">
                  <label>
                    Specialties
                    <span className="input-shell">
                      <Sparkles size={18} />
                      <input
                        value={form.specialties}
                        onChange={(event) => onChange("specialties", event.target.value)}
                        placeholder="Love, Career, Kundli"
                        required
                      />
                    </span>
                  </label>

                  <label>
                    Languages
                    <span className="input-shell">
                      <Languages size={18} />
                      <input
                        value={form.languages}
                        onChange={(event) => onChange("languages", event.target.value)}
                        placeholder="Hindi, English"
                        required
                      />
                    </span>
                  </label>
                </div>

                <div className="two-col">
                  <label>
                    Price per minute
                    <span className="input-shell">
                      <IndianRupee size={18} />
                      <input
                        type="number"
                        min="1"
                        value={form.pricePerMinute}
                        onChange={(event) => onChange("pricePerMinute", event.target.value)}
                        placeholder="25"
                        required
                      />
                    </span>
                  </label>

                  <label>
                    Response time
                    <span className="input-shell">
                      <Clock3 size={18} />
                      <input
                        value={form.responseTime}
                        onChange={(event) => onChange("responseTime", event.target.value)}
                        placeholder="5 min"
                        required
                      />
                    </span>
                  </label>
                </div>

                <label>
                  Availability hours
                  <span className="input-shell">
                    <Clock3 size={18} />
                    <input
                      value={form.availability}
                      onChange={(event) => onChange("availability", event.target.value)}
                      placeholder="Mon-Sat, 10 AM - 7 PM"
                      required
                    />
                  </span>
                </label>

                <div className="two-col">
                  <label>
                    Education / training
                    <span className="input-shell">
                      <GraduationCap size={18} />
                      <input
                        value={form.education}
                        onChange={(event) => onChange("education", event.target.value)}
                        placeholder="Jyotish diploma, mentor training..."
                        required
                      />
                    </span>
                  </label>

                  <label>
                    Certifications
                    <span className="input-shell">
                      <BadgeCheck size={18} />
                      <input
                        value={form.certifications}
                        onChange={(event) => onChange("certifications", event.target.value)}
                        placeholder="Verified ID, institute certificate..."
                        required
                      />
                    </span>
                  </label>
                </div>

                <div className="two-col">
                  <label>
                    Availability status
                    <span className="input-shell">
                      <Sparkles size={18} />
                      <select
                        value={form.status}
                        onChange={(event) => onChange("status", event.target.value)}
                        required
                      >
                        <option value="online">Online</option>
                        <option value="busy">Busy</option>
                        <option value="offline">Offline</option>
                      </select>
                    </span>
                  </label>

                  <label>
                    Profile color
                    <span className="input-shell">
                      <Palette size={18} />
                      <input
                        type="color"
                        value={form.accent}
                        onChange={(event) => onChange("accent", event.target.value)}
                        aria-label="Profile accent color"
                      />
                    </span>
                  </label>
                </div>

                <div className="mode-checks" aria-label="Consultation modes">
                  <label className="checkbox-line">
                    <input
                      type="checkbox"
                      checked={selectedModes.includes("chat")}
                      onChange={() => toggleConsultationMode("chat")}
                    />
                    Chat consultations
                  </label>
                  <label className="checkbox-line">
                    <input
                      type="checkbox"
                      checked={selectedModes.includes("call")}
                      onChange={() => toggleConsultationMode("call")}
                    />
                    Call consultations
                  </label>
                </div>
              </div>
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
                  {session.user.role} - {session.user.email}
                </span>
              </div>
              <button className="secondary-button" type="button" onClick={onLogout}>
                <LogOut size={17} />
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default SignInPage;
