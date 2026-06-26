import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";

function PanelPage({
  session,
  data,
  status,
  walletStatus,
  onOpenProfile,
  onRefresh,
  onWalletRecharge
}) {
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
    <UserPanel
      session={session}
      data={data}
      status={status}
      walletStatus={walletStatus}
      onOpenProfile={onOpenProfile}
      onRefresh={onRefresh}
      onWalletRecharge={onWalletRecharge}
    />
  );
}

export default PanelPage;
