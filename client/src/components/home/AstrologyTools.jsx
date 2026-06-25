import { Compass, Gem, HeartHandshake, Moon } from "lucide-react";
import { signs } from "../../constants";
import Pill from "../common/Pill";
import ProgressRow from "../common/ProgressRow";

function AstrologyTools({
  horoscope,
  kundli,
  kundliForm,
  match,
  matchForm,
  selectedSign,
  onKundliChange,
  onMatchChange,
  onSelectedSignChange,
  onSubmitKundli,
  onSubmitMatch
}) {
  return (
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
              onChange={(event) => onSelectedSignChange(event.target.value)}
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
          <form className="compact-form" onSubmit={onSubmitKundli}>
            <input
              value={kundliForm.name}
              onChange={(event) => onKundliChange("name", event.target.value)}
              aria-label="Kundli name"
              placeholder="Name"
            />
            <div className="two-col">
              <input
                type="date"
                value={kundliForm.birthDate}
                onChange={(event) => onKundliChange("birthDate", event.target.value)}
                aria-label="Kundli birth date"
              />
              <input
                type="time"
                value={kundliForm.birthTime}
                onChange={(event) => onKundliChange("birthTime", event.target.value)}
                aria-label="Kundli birth time"
              />
            </div>
            <input
              value={kundliForm.place}
              onChange={(event) => onKundliChange("place", event.target.value)}
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
          <form className="compact-form" onSubmit={onSubmitMatch}>
            <div className="two-col">
              <input
                value={matchForm.firstName}
                onChange={(event) => onMatchChange("firstName", event.target.value)}
                aria-label="First name"
                placeholder="First name"
              />
              <select
                value={matchForm.firstSign}
                onChange={(event) => onMatchChange("firstSign", event.target.value)}
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
                onChange={(event) => onMatchChange("secondName", event.target.value)}
                aria-label="Second name"
                placeholder="Second name"
              />
              <select
                value={matchForm.secondSign}
                onChange={(event) => onMatchChange("secondSign", event.target.value)}
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
  );
}

export default AstrologyTools;
