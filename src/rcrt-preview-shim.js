// Guest-side shim that forwards the app's console events up to the
// RCRT preview-service host (when running inside the device-frame iframe).
//
// Contract (host side):
//   window.addEventListener('message', e => {
//     if (e.data?.type === 'rcrt-preview-guest-log') ingestGuestLog(e.data.log);
//   });
//
// Safe to import unconditionally — when not framed, window.parent === window
// and postMessage is a no-op we can ignore.

const inFrame = (() => {
  try { return window.parent && window.parent !== window; }
  catch { return false; }
})();

if (inFrame) {
  const post = (entry) => {
    try {
      window.parent.postMessage({ type: "rcrt-preview-guest-log", log: entry }, "*");
    } catch {
      // cross-origin parent; postMessage is meant to work across origins, but
      // a rejected policy could throw — swallow silently.
    }
  };

  const wrap = (method) => {
    const original = console[method].bind(console);
    console[method] = (...args) => {
      post({
        type: method,
        message: args
          .map((a) => {
            if (a instanceof Error) return `${a.name}: ${a.message}\n${a.stack || ""}`;
            if (typeof a === "object") {
              try { return JSON.stringify(a); }
              catch { return String(a); }
            }
            return String(a);
          })
          .join(" "),
        time: Date.now(),
      });
      original(...args);
    };
  };

  ["log", "info", "warn", "error"].forEach(wrap);

  window.addEventListener("error", (e) => {
    post({
      type: "error",
      message: `${e.message} at ${e.filename || "?"}:${e.lineno || 0}:${e.colno || 0}`,
      time: Date.now(),
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason;
    const message =
      reason instanceof Error
        ? `Unhandled rejection: ${reason.message}\n${reason.stack || ""}`
        : `Unhandled rejection: ${String(reason)}`;
    post({ type: "error", message, time: Date.now() });
  });

  post({ type: "info", message: "Guest log shim active", time: Date.now() });
}
