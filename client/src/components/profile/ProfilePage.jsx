import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Languages,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Save,
  Sparkles,
  UserRound
} from "lucide-react";

function ProfilePage({ form, status, onBack, onChange, onSubmit }) {
  return (
    <main className="profile-page" id="profile">
      <section className="profile-shell" aria-labelledby="profile-title">
        <div className="profile-copy">
          <button className="back-button" type="button" onClick={onBack}>
            <ArrowLeft size={18} />
            Account panel
          </button>

          <span className="eyebrow">
            <UserRound size={16} />
            Customer profile
          </span>
          <h1 id="profile-title">Saved consultation details</h1>
          <p>
            Keep your birth details, contact number, and usual consultation concern ready for
            astrologer bookings.
          </p>

          <div className="profile-snapshot" aria-label="Saved profile summary">
            <div>
              <span className="panel-icon">
                <CalendarDays size={21} />
              </span>
              <strong>{form.birthDate || "Birth date"}</strong>
              <small>{form.birthTime || "Birth time"}</small>
            </div>
            <div>
              <span className="panel-icon">
                <MapPin size={21} />
              </span>
              <strong>{form.place || "Birth place"}</strong>
              <small>{form.preferredLanguage || "Preferred language"}</small>
            </div>
            <div>
              <span className="panel-icon">
                <MessageSquareText size={21} />
              </span>
              <strong>{form.concern || "Consultation concern"}</strong>
              <small>{form.phone || "Phone number"}</small>
            </div>
          </div>
        </div>

        <form className="profile-panel profile-form" onSubmit={onSubmit}>
          <div className="profile-form-heading">
            <span className="eyebrow">
              <Sparkles size={16} />
              Details
            </span>
            <h2>Profile information</h2>
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
            Email
            <span className="input-shell muted-input">
              <Mail size={18} />
              <input type="email" value={form.email} disabled />
            </span>
          </label>

          <div className="two-col">
            <label>
              Gender
              <span className="input-shell">
                <UserRound size={18} />
                <select value={form.gender} onChange={(event) => onChange("gender", event.target.value)}>
                  <option value="">Prefer not to say</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
              </span>
            </label>

            <label>
              Preferred language
              <span className="input-shell">
                <Languages size={18} />
                <select
                  value={form.preferredLanguage}
                  onChange={(event) => onChange("preferredLanguage", event.target.value)}
                >
                  <option value="">Any language</option>
                  <option value="Hindi">Hindi</option>
                  <option value="English">English</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Marathi">Marathi</option>
                  <option value="Bengali">Bengali</option>
                </select>
              </span>
            </label>
          </div>

          <div className="two-col">
            <label>
              Birth date
              <span className="input-shell">
                <CalendarDays size={18} />
                <input
                  type="date"
                  value={form.birthDate}
                  onChange={(event) => onChange("birthDate", event.target.value)}
                />
              </span>
            </label>

            <label>
              Birth time
              <span className="input-shell">
                <Clock3 size={18} />
                <input
                  type="time"
                  value={form.birthTime}
                  onChange={(event) => onChange("birthTime", event.target.value)}
                />
              </span>
            </label>
          </div>

          <label>
            Birth place
            <span className="input-shell">
              <MapPin size={18} />
              <input
                value={form.place}
                onChange={(event) => onChange("place", event.target.value)}
                placeholder="City, state"
              />
            </span>
          </label>

          <label>
            Consultation concern
            <span className="textarea-shell">
              <MessageSquareText size={18} />
              <textarea
                value={form.concern}
                onChange={(event) => onChange("concern", event.target.value)}
                placeholder="Marriage, career, finance..."
              />
            </span>
          </label>

          {status.error ? <div className="form-error">{status.error}</div> : null}
          {status.success ? (
            <div className="form-success">
              <CheckCircle2 size={18} />
              {status.success}
            </div>
          ) : null}

          <button className="primary-button" type="submit" disabled={status.loading}>
            <Save size={18} />
            {status.loading ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default ProfilePage;
