import { toast } from "react-toastify";

export const showToast = (
  type: "error" | "success" | "info",
  message: string
) => {
  setTimeout(() => {
    toast[type](message, {
      theme: "dark",
      position: "bottom-right",
      style: {
        border: "1px solid #292D30",
        backgroundColor: "#17191B",
        color: "#FFFFFF",
      },
    });
  }, 0);
};
