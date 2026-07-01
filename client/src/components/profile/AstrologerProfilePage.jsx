import {
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Clock3,
  GraduationCap,
  IndianRupee,
  Languages,
  MapPin,
  MessageCircle,
  Palette,
  Phone,
  Save,
  Sparkles,
  UserRound
} from "lucide-react";

function AstrologerProfilePage({ form, status, onBack, onChange, onSubmit }) {
  const modes = Array.isArray(form.modes) ? form.modes : [];

  function toggleMode(mode) {
    const nextModes = modes.includes(mode)
      ? modes.filter((item) => item !== mode)
      : [...modes, mode];
    onChange("modes", nextModes);
  }

  return (
    <main className="profile-page" id="astrologer-profile">
      <section className="profile-shell" aria-labelledby="astrologer-profile-title">
        <div className="profile-copy">
          <button className="back-button" type="button" onClick={onBack}>
            <ArrowLeft size={18} />
            Dashboard
          </button>

          <span className="eyebrow">
            <Sparkles size={16} />
            Astrologer profile
          </span>
          <h1 id="astrologer-profile-title">Public listing details</h1>
          <p>
            Keep your expertise, availability, consultation modes, and pricing ready for customers.
          </p>

          <div className="profile-snapshot" aria-label="Astrologer profile summary">
            <div>
              <span className="panel-icon">
                <BadgeCheck size={21} />
              </span>
              <strong>{form.title || "Professional title"}</strong>
              <small>{form.specialties || "Specialties"}</small>
            </div>
            <div>
              <span className="panel-icon">
                <Languages size={21} />
              </span>
              <strong>{form.languages || "Languages"}</strong>
              <small>{form.availability || "Availability"}</small>
            </div>
            <div>
              <span className="panel-icon">
                <IndianRupee size={21} />
              </span>
              <strong>{form.pricePerMinute ? `Rs ${form.pricePerMinute}/min` : "Rate"}</strong>
              <small>{modes.length ? modes.join(", ") : "Modes"}</small>
            </div>
          </div>
        </div>

        <form className="profile-panel profile-form" onSubmit={onSubmit}>
          <div className="profile-form-heading">
            <span className="eyebrow">
              <Sparkles size={16} />
              Listing
            </span>
            <h2>Astrologer information</h2>
          </div>

          <div className="two-col">
            <label>
              Full name
              <span className="input-shell">
                <UserRound size={18} />
                <input
                  value={form.name}
                  onChange={(event) => onChange("name", event.target.value)}
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
                  autoComplete="tel"
                  required
                />
              </span>
            </label>
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
                <select value={form.status} onChange={(event) => onChange("status", event.target.value)}>
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
                checked={modes.includes("chat")}
                onChange={() => toggleMode("chat")}
              />
              Chat consultations
            </label>
            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={modes.includes("call")}
                onChange={() => toggleMode("call")}
              />
              Call consultations
            </label>
          </div>

          {status.error ? <div className="form-error">{status.error}</div> : null}
          {status.success ? (
            <div className="form-success">
              <CheckCircle2 size={18} />
              {status.success}
            </div>
          ) : null}

          <button className="primary-button" type="submit" disabled={status.loading}>
            <Save size={18} />
            {status.loading ? "Saving..." : "Save astrologer profile"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AstrologerProfilePage;
