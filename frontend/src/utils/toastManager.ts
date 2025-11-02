// This utility allows you to trigger your ToastComponent from anywhere (even outside React components)
let showToastFn: (
  message: string,
  severity?: "success" | "error" | "info" | "warning"
) => void;

export const setShowToast = (
  fn: (
    message: string,
    severity?: "success" | "error" | "info" | "warning"
  ) => void
) => {
  showToastFn = fn;
};

export const showToast = (
  message: string,
  severity: "success" | "error" | "info" | "warning" = "info"
) => {
  if (showToastFn) showToastFn(message, severity);
  else console.warn("Toast not initialized yet:", message);
};
