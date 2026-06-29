const CHECKOUT_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let checkoutScriptPromise = null;

const upiQrDisplayConfig = {
  blocks: {
    upi_qr: {
      name: "Pay with UPI QR",
      instruments: [
        {
          method: "upi",
          flows: ["qr"]
        }
      ]
    },
    upi_apps: {
      name: "Pay with UPI Apps",
      instruments: [
        {
          method: "upi",
          flows: ["intent", "collect"]
        }
      ]
    }
  },
  sequence: ["block.upi_qr", "block.upi_apps"],
  preferences: {
    show_default_blocks: true
  }
};

function normalizePrefill(prefill = {}) {
  const contact = String(prefill.contact || "").replace(/\D/g, "");

  return {
    ...prefill,
    contact: contact.length === 10 ? `+91${contact}` : prefill.contact || ""
  };
}

export function formatRupees(amount) {
  return `Rs ${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();

  if (!checkoutScriptPromise) {
    checkoutScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = CHECKOUT_SCRIPT_URL;
      script.async = true;
      script.onload = () => {
        if (window.Razorpay) {
          resolve();
        } else {
          checkoutScriptPromise = null;
          reject(new Error("Razorpay Checkout loaded, but the gateway was not available."));
        }
      };
      script.onerror = () => {
        checkoutScriptPromise = null;
        reject(new Error("Unable to load Razorpay Checkout. Check your internet connection and ad blocker."));
      };
      document.body.appendChild(script);
    });
  }

  return checkoutScriptPromise;
}

export async function openRazorpayCheckout({
  key,
  order,
  description,
  prefill,
  notes,
  onDismiss
}) {
  await loadRazorpayCheckout();

  return new Promise((resolve, reject) => {
    let checkoutFailureMessage = "";
    let settled = false;

    function settlePaymentSuccess(response) {
      if (settled) return;
      settled = true;
      resolve(response);
    }

    function settlePaymentFailure(message) {
      if (settled) return;
      settled = true;
      reject(new Error(message));
    }

    const checkout = new window.Razorpay({
      key,
      amount: order.amount,
      currency: order.currency,
      name: "AstroTalk",
      description,
      order_id: order.id,
      method: "upi",
      prefill: normalizePrefill(prefill),
      notes,
      config: {
        display: upiQrDisplayConfig
      },
      retry: {
        enabled: true,
        max_count: 3
      },
      theme: {
        color: "#ffcf4d"
      },
      handler: settlePaymentSuccess,
      modal: {
        ondismiss: () => {
          if (!settled) onDismiss?.();
          settlePaymentFailure(checkoutFailureMessage || "Payment popup closed before completion.");
        }
      }
    });

    checkout.on("payment.failed", (response) => {
      checkoutFailureMessage = response?.error?.description || "Razorpay payment failed.";
      settlePaymentFailure(checkoutFailureMessage);
      checkout.close?.();
    });

    checkout.open();
  });
}
