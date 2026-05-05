import { useEffect } from "react";
import { App } from "@capacitor/app";
import { useLocation, useNavigate } from "react-router-dom";

export default function AppBackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const listener = App.addListener("backButton", () => {
      if (location.pathname !== "/") {
        navigate("/");
      } else {
        App.exitApp();
      }
    });

    return () => {
      listener.remove();
    };
  }, [location.pathname, navigate]);

  return null;
}