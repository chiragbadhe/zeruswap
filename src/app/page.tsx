import Header from "@/components/Header";
import SwapInterface from "@/components/SwapInterface";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  return (
    <div>
      <ToastContainer />
      <Header />
      <SwapInterface />
    </div>
  );
}
