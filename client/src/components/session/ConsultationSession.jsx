import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  LoaderCircle,
  MessageCircle,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Send,
  Video,
  VideoOff
} from "lucide-react";
import { api } from "../../api";
import { formatPanelDate } from "../../utils/formatters";

function formatDuration(totalSeconds = 0) {
  const seconds = Math.max(0, Number(totalSeconds) || 0);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function counterpartLabel(booking, participant) {
  if (participant?.role === "astrologer") return booking?.customerName || "Customer";
  return booking?.astrologerName || "Astrologer";
}

function videoParticipantLabels(booking, participant) {
  const customerName = booking?.customerName || "Customer";
  const astrologerName = booking?.astrologerName || "Astrologer";
  const localIsAstrologer = participant?.role === "astrologer";

  return {
    local: {
      role: localIsAstrologer ? "Astrologer" : "Customer",
      name: localIsAstrologer ? astrologerName : customerName
    },
    remote: {
      role: localIsAstrologer ? "Customer" : "Astrologer",
      name: localIsAstrologer ? customerName : astrologerName
    }
  };
}

function attachVideoStream(videoElement, stream) {
  if (!videoElement || !stream || videoElement.srcObject === stream) return;
  videoElement.srcObject = stream;
}

function ChatRoom({
  booking,
  ended,
  messageText,
  messages,
  participant,
  sending,
  onMessageChange,
  onSend
}) {
  const messageListRef = useRef(null);

  useEffect(() => {
    const element = messageListRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [messages.length]);

  return (
    <section className="session-card chat-session" aria-label="Chat session">
      <div className="session-card-heading">
        <div>
          <span className="eyebrow">
            <MessageCircle size={16} />
            Chat
          </span>
          <h2>{counterpartLabel(booking, participant)}</h2>
        </div>
        <span className={`live-status ${ended ? "ended" : "active"}`}>
          {ended ? "Ended" : "Live"}
        </span>
      </div>

      <div className="chat-window" ref={messageListRef}>
        {messages.length ? (
          messages.map((message) => {
            const ownMessage = message.senderRole === participant?.role;

            return (
              <article
                className={`chat-bubble ${ownMessage ? "own-message" : ""}`}
                key={message.id}
              >
                <div>
                  <strong>{ownMessage ? "You" : message.senderName}</strong>
                  <span>{formatPanelDate(message.createdAt)}</span>
                </div>
                <p>{message.body}</p>
              </article>
            );
          })
        ) : (
          <div className="empty-chat">
            <MessageCircle size={36} />
            <strong>Session is live</strong>
            <span>Messages will appear here for this booking.</span>
          </div>
        )}
      </div>

      <form className="chat-composer" onSubmit={onSend}>
        <textarea
          value={messageText}
          disabled={ended || sending}
          placeholder={ended ? "This chat session has ended." : "Type your message"}
          onChange={(event) => onMessageChange(event.target.value)}
        />
        <button className="primary-button" type="submit" disabled={ended || sending || !messageText.trim()}>
          <Send size={18} />
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
    </section>
  );
}

function VideoCallRoom({ booking, ended, participant, session }) {
  const [cameraOn, setCameraOn] = useState(true);
  const [callStatus, setCallStatus] = useState("Ready to join");
  const [joined, setJoined] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [remoteConnected, setRemoteConnected] = useState(false);
  const [remoteVideoOn, setRemoteVideoOn] = useState(false);
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const pendingCandidatesRef = useRef([]);
  const processedSignalsRef = useRef(new Set());
  const remoteStreamRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const remoteName = counterpartLabel(booking, participant);
  const participantLabels = videoParticipantLabels(booking, participant);
  const bookingId = booking?.bookingId;
  const localVideoLabel = `${participantLabels.local.role}: ${participantLabels.local.name}`;
  const remoteVideoLabel = `${participantLabels.remote.role}: ${participantLabels.remote.name}`;

  const setLocalVideoNode = useCallback((node) => {
    localVideoRef.current = node;
    attachVideoStream(node, localStreamRef.current);
  }, []);

  const setRemoteVideoNode = useCallback((node) => {
    remoteVideoRef.current = node;
    attachVideoStream(node, remoteStreamRef.current);
  }, []);

  function closeLocalMedia() {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current = null;

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }

  function closePeerConnection() {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    pendingCandidatesRef.current = [];
    setRemoteConnected(false);
    setRemoteVideoOn(false);
    remoteStreamRef.current = null;

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }

  function stopCall(notify = true) {
    if (notify && joined && bookingId) {
      api
        .sendConsultationSignal(bookingId, { type: "leave", data: { at: Date.now() } }, session)
        .catch(() => {});
    }

    closePeerConnection();
    closeLocalMedia();
    setJoined(false);
    setCallStatus("Call ended");
  }

  useEffect(() => () => stopCall(false), []);

  useEffect(() => {
    if (ended && joined) {
      stopCall(true);
    }
  }, [ended, joined]);

  async function postSignal(type, data = null) {
    if (!bookingId) return null;
    return api.sendConsultationSignal(bookingId, { type, data }, session);
  }

  async function addPendingCandidates() {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection?.remoteDescription) return;

    const queued = pendingCandidatesRef.current.splice(0);
    await Promise.all(
      queued.map((candidate) => peerConnection.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {}))
    );
  }

  async function createOffer() {
    const peerConnection = peerConnectionRef.current;
    if (!peerConnection || peerConnection.signalingState !== "stable") return;

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    await postSignal("offer", offer);
    setCallStatus(`Calling ${remoteName}`);
  }

  async function handleSignal(signal) {
    if (!signal?.id || processedSignalsRef.current.has(signal.id)) return;
    processedSignalsRef.current.add(signal.id);

    if (signal.senderRole === participant?.role) return;

    const peerConnection = peerConnectionRef.current;
    if (!peerConnection) return;

    if (signal.type === "ready") {
      if (participant?.role === "customer" && !peerConnection.localDescription) {
        await createOffer();
      }
      return;
    }

    if (signal.type === "offer") {
      if (peerConnection.signalingState !== "stable") return;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.data));
      await addPendingCandidates();
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      await postSignal("answer", answer);
      setCallStatus(`Connected with ${remoteName}`);
      return;
    }

    if (signal.type === "answer") {
      if (peerConnection.signalingState === "stable") return;
      await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.data));
      await addPendingCandidates();
      setCallStatus(`Connected with ${remoteName}`);
      return;
    }

    if (signal.type === "candidate") {
      if (peerConnection.remoteDescription) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(signal.data)).catch(() => {});
      } else {
        pendingCandidatesRef.current.push(signal.data);
      }
      return;
    }

    if (signal.type === "leave") {
      setCallStatus(`${remoteName} left the call`);
      setRemoteConnected(false);
      setRemoteVideoOn(false);
    }
  }

  function createPeerConnection() {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
    });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        postSignal("candidate", event.candidate.toJSON()).catch(() => {});
      }
    };

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        remoteStreamRef.current = remoteStream;
        attachVideoStream(remoteVideoRef.current, remoteStream);
        setRemoteVideoOn(true);
      }
      setRemoteConnected(true);
      setCallStatus(`Connected with ${remoteName}`);
    };

    peerConnection.onconnectionstatechange = () => {
      if (peerConnection.connectionState === "connected") {
        setRemoteConnected(true);
        setCallStatus(`Connected with ${remoteName}`);
      }

      if (["disconnected", "failed", "closed"].includes(peerConnection.connectionState)) {
        setRemoteConnected(false);
        setRemoteVideoOn(false);
      }
    };

    return peerConnection;
  }

  async function joinCall() {
    if (ended || !bookingId) return;

    if (!navigator.mediaDevices?.getUserMedia || !window.RTCPeerConnection) {
      setMediaError("Your browser does not support video calls.");
      return;
    }

    setMediaError("");
    setCallStatus("Opening camera");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const peerConnection = createPeerConnection();

      localStreamRef.current = stream;
      peerConnectionRef.current = peerConnection;

      stream.getTracks().forEach((track) => peerConnection.addTrack(track, stream));

      attachVideoStream(localVideoRef.current, stream);

      setJoined(true);
      setMicOn(true);
      setCameraOn(true);
      setCallStatus(`Waiting for ${remoteName}`);
      await postSignal("ready", { at: Date.now() });

      if (participant?.role === "customer") {
        await createOffer();
      }
    } catch (error) {
      closePeerConnection();
      closeLocalMedia();
      setJoined(false);
      setMediaError(error.message || "Unable to open camera or microphone.");
      setCallStatus("Camera unavailable");
    }
  }

  useEffect(() => {
    if (!joined || ended || !bookingId) return undefined;

    let stopped = false;

    async function pollSignals() {
      try {
        const payload = await api.consultationSignals(bookingId, session);
        if (stopped) return;

        if (payload.session?.status === "completed") {
          stopCall(true);
          return;
        }

        for (const signal of payload.signals || []) {
          await handleSignal(signal);
        }
      } catch (error) {
        if (!stopped) setCallStatus(error.message);
      }
    }

    pollSignals();
    const timer = window.setInterval(pollSignals, 1400);

    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [joined, ended, bookingId, participant?.role, session?.token]);

  function toggleMic() {
    const audioTrack = localStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return;
    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(audioTrack.enabled);
  }

  function toggleCamera() {
    const videoTrack = localStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return;
    videoTrack.enabled = !videoTrack.enabled;
    setCameraOn(videoTrack.enabled);
  }

  return (
    <section className="session-card video-session" aria-label="Video consultation">
      <div className="session-card-heading">
        <div>
          <span className="eyebrow">
            <PhoneCall size={16} />
            Video call
          </span>
          <h2>{remoteName}</h2>
        </div>
        <span className={`live-status ${ended ? "ended" : remoteConnected ? "active" : ""}`}>
          {ended ? "Ended" : remoteConnected ? "Connected" : "Waiting"}
        </span>
      </div>

      <div className="video-grid">
        <div className="video-tile remote-video">
          <video ref={setRemoteVideoNode} autoPlay playsInline />
          {!remoteVideoOn ? (
            <div className="video-placeholder">
              <CircleUserRound size={52} />
              <strong>{participantLabels.remote.role}</strong>
              <small>{participantLabels.remote.name}</small>
              <span>{callStatus}</span>
            </div>
          ) : null}
          <span className="video-label">{remoteVideoLabel}</span>
        </div>

        <div className="video-tile local-video">
          <video ref={setLocalVideoNode} autoPlay muted playsInline />
          {!joined || !cameraOn ? (
            <div className="video-placeholder compact">
              <CircleUserRound size={34} />
              <strong>{participantLabels.local.role}</strong>
              <small>{participantLabels.local.name}</small>
            </div>
          ) : null}
          <span className="video-label">{localVideoLabel} (You)</span>
        </div>
      </div>

      {mediaError ? <div className="form-error">{mediaError}</div> : null}

      <div className="call-controls">
        {!joined ? (
          <button className="primary-button" type="button" onClick={joinCall} disabled={ended}>
            <Video size={18} />
            Join video call
          </button>
        ) : (
          <>
            <button className="secondary-button icon-control" type="button" onClick={toggleMic}>
              {micOn ? <Mic size={19} /> : <MicOff size={19} />}
              {micOn ? "Mute" : "Unmute"}
            </button>
            <button className="secondary-button icon-control" type="button" onClick={toggleCamera}>
              {cameraOn ? <Video size={19} /> : <VideoOff size={19} />}
              {cameraOn ? "Camera" : "Camera off"}
            </button>
            <button className="danger-button" type="button" onClick={() => stopCall(true)}>
              <PhoneOff size={19} />
              Leave
            </button>
          </>
        )}
      </div>
    </section>
  );
}

function ConsultationSession({ booking, session, onBack }) {
  const [messageText, setMessageText] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [room, setRoom] = useState(null);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const bookingId = booking?.bookingId;

  const messages = room?.messages || [];
  const currentBooking = room?.booking || booking;
  const participant = room?.participant;
  const sessionState = room?.session;
  const ended = sessionState?.status === "completed" || remainingSeconds <= 0;
  const timerLabel = useMemo(() => formatDuration(remainingSeconds), [remainingSeconds]);

  useEffect(() => {
    if (!bookingId) return undefined;

    let active = true;

    async function loadRoom() {
      setStatus({ loading: true, error: "" });

      try {
        const payload = await api.consultationSession(bookingId, session);
        if (!active) return;
        setRoom(payload);
        setRemainingSeconds(payload.session?.remainingSeconds || 0);
        setStatus({ loading: false, error: "" });
      } catch (error) {
        if (!active) return;
        setStatus({ loading: false, error: error.message });
      }
    }

    loadRoom();

    return () => {
      active = false;
    };
  }, [bookingId, session?.token]);

  useEffect(() => {
    if (!bookingId || currentBooking?.mode !== "chat") return undefined;

    let active = true;

    async function refreshRoom() {
      try {
        const payload = await api.consultationSession(bookingId, session);
        if (!active) return;
        setRoom(payload);
        setRemainingSeconds(payload.session?.remainingSeconds || 0);
      } catch (error) {
        if (active) setStatus({ loading: false, error: error.message });
      }
    }

    const timer = window.setInterval(refreshRoom, 2500);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [bookingId, currentBooking?.mode, session?.token]);

  useEffect(() => {
    if (!room) return undefined;

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [room]);

  async function sendMessage(event) {
    event.preventDefault();

    if (!bookingId || !messageText.trim() || ended) return;

    setSending(true);

    try {
      const payload = await api.sendConsultationMessage(
        bookingId,
        { body: messageText },
        session
      );
      setRoom(payload);
      setRemainingSeconds(payload.session?.remainingSeconds || 0);
      setMessageText("");
    } catch (error) {
      setStatus({ loading: false, error: error.message });
    } finally {
      setSending(false);
    }
  }

  if (!bookingId) {
    return (
      <main className="session-page">
        <div className="alert">No consultation was selected.</div>
      </main>
    );
  }

  if (status.loading && !room) {
    return (
      <main className="session-page">
        <div className="loading-card">
          <LoaderCircle size={18} />
          Loading consultation session...
        </div>
      </main>
    );
  }

  if (status.error && !room) {
    return (
      <main className="session-page">
        <button className="back-button" type="button" onClick={onBack}>
          <ArrowLeft size={17} />
          Back
        </button>
        <div className="alert">{status.error}</div>
      </main>
    );
  }

  return (
    <main className="session-page">
      <section className="session-hero">
        <div>
          <button className="back-button" type="button" onClick={onBack}>
            <ArrowLeft size={17} />
            Back
          </button>
          <span className="eyebrow">
            {currentBooking.mode === "call" ? <PhoneCall size={16} /> : <MessageCircle size={16} />}
            Consultation session
          </span>
          <h1>
            {currentBooking.mode === "call" ? "Video call" : "Chat"} with{" "}
            {counterpartLabel(currentBooking, participant)}
          </h1>
          <p>
            Booking {currentBooking.bookingId} for {currentBooking.durationMinutes} minutes.
          </p>
        </div>

        <div className="session-timer-card">
          <span className="panel-icon">
            {ended ? <CheckCircle2 size={22} /> : <Clock3 size={22} />}
          </span>
          <div>
            <span>{ended ? "Session status" : "Time left"}</span>
            <strong>{ended ? "Completed" : timerLabel}</strong>
            <small>
              {sessionState?.endsAt
                ? `Ends ${formatPanelDate(sessionState.endsAt)}`
                : "Timer synced with booking duration"}
            </small>
          </div>
        </div>
      </section>

      {status.error ? <div className="alert">{status.error}</div> : null}

      {currentBooking.mode === "call" ? (
        <VideoCallRoom
          booking={currentBooking}
          ended={ended}
          participant={participant}
          session={session}
        />
      ) : (
        <ChatRoom
          booking={currentBooking}
          ended={ended}
          messageText={messageText}
          messages={messages}
          participant={participant}
          sending={sending}
          onMessageChange={setMessageText}
          onSend={sendMessage}
        />
      )}
    </main>
  );
}

export default ConsultationSession;
