import { ArrowLeft, CircleUserRound, LogOut, Sun, UserCog, WalletCards } from "lucide-react";

function Header({ activePage, session, onHome, onLogout, onOpenPanel, onOpenProfile, onOpenSignIn }) {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Astrotalk clone home" onClick={onHome}>
        <span className="brand-mark">
          <Sun size={20} />
        </span>
        <span>AstroTalk</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#astrologers" onClick={onHome}>
          Astrologers
        </a>
        <a href="#horoscope" onClick={onHome}>
          Horoscope
        </a>
        <a href="#kundli" onClick={onHome}>
          Kundli
        </a>
        <a href="#match" onClick={onHome}>
          Match
        </a>
      </nav>
      <div className="top-actions">
        {session?.user.role === "user" ? (
          <button
            className="icon-button"
            type="button"
            aria-label="Open customer profile"
            onClick={onOpenProfile}
          >
            <CircleUserRound size={19} />
          </button>
        ) : null}
        <button
          className="icon-button"
          type="button"
          aria-label={session ? "Open account panel" : "Wallet balance"}
          onClick={session ? onOpenPanel : onOpenSignIn}
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
            <button type="button" aria-label="Sign out" onClick={onLogout}>
              <LogOut size={16} />
            </button>
          </div>
        ) : activePage === "signin" ? (
          <button className="ghost-button with-icon" type="button" onClick={onHome}>
            <ArrowLeft size={17} />
            Home
          </button>
        ) : (
          <button className="ghost-button" type="button" onClick={onOpenSignIn}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
