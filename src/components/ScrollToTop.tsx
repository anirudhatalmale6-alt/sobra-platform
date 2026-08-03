import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Reset scroll to the top on every route change. Without this, clicking a
// footer link (while scrolled to the bottom) navigates but leaves the viewport
// at the footer, making links look like they "don't work".
export default function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
