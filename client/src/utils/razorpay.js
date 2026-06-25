const CHECKOUT_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

let checkoutScriptPromise = null;

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
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Unable to load Razorpay Checkout."));
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
    const checkout = new window.Razorpay({
      key,
      amount: order.amount,
      currency: order.currency,
      name: "AstroTalk",
      description,
      order_id: order.id,
      prefill,
      notes,
      theme: {
        color: "#ffcf4d"
      },
      handler: (response) => resolve(response),
      modal: {
        ondismiss: () => {
          onDismiss?.();
          reject(new Error("Payment popup closed before completion."));
        }
      }
    });

    checkout.open();
  });
}
