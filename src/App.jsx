import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Nav from "./components/Nav";
import Breadcrumbs from "./components/Breadcrumbs";
import Footer from "./components/Footer";
import ScrollProgress from "./components/ScrollProgress";
import ErrorBoundary from "./components/ErrorBoundary";
import PageSkeleton from "./components/PageSkeleton";
import Analytics from "./components/Analytics";
import ParishActionBar from "./components/ParishActionBar";
import AnnouncementBanner from "./announcements/AnnouncementBanner";
import AnnouncementPopup from "./announcements/AnnouncementPopup";
import { pullAll, installAutoSync, isConfigured as adminCmsConfigured } from "./cms/adminSync";
import useLenis from "./hooks/useLenis";
import { LEGACY_REDIRECTS } from "./data/legacyRedirects";

// Install the localStorage interceptor immediately (module-eval time) so
// every admin write — even ones that happen before React mounts — is seen.
if (adminCmsConfigured()) installAutoSync();

/* ── Code-split every page (separate chunks) ── */
const Home = lazy(() => import("./pages/Home"));
const MassTimes = lazy(() => import("./pages/MassTimes"));
const About = lazy(() => import("./pages/About"));
const Staff = lazy(() => import("./pages/Staff"));
const Bulletin = lazy(() => import("./pages/Bulletin"));
const BecomingCatholic = lazy(() => import("./pages/BecomingCatholic"));
const GetInvolved = lazy(() => import("./pages/GetInvolved"));
const Contact = lazy(() => import("./pages/Contact"));
const Give = lazy(() => import("./pages/Give"));
const Sacraments = lazy(() => import("./pages/Sacraments"));
const Baptism = lazy(() => import("./pages/sacraments/Baptism"));
const FirstCommunion = lazy(() => import("./pages/sacraments/FirstCommunion"));
const Confirmation = lazy(() => import("./pages/sacraments/Confirmation"));
const Marriage = lazy(() => import("./pages/sacraments/Marriage"));
const Anointing = lazy(() => import("./pages/sacraments/Anointing"));
const Funerals = lazy(() => import("./pages/sacraments/Funerals"));
const Visit = lazy(() => import("./pages/Visit"));
const History = lazy(() => import("./pages/History"));
const Register = lazy(() => import("./pages/Register"));
const Events = lazy(() => import("./pages/Events"));
const Architecture = lazy(() => import("./pages/Architecture"));
const FaithFormation = lazy(() => import("./pages/FaithFormation"));
const Gallery = lazy(() => import("./pages/Gallery"));
const WritersGuide = lazy(() => import("./pages/WritersGuide"));
const Connect = lazy(() => import("./pages/Connect"));
const NotFound = lazy(() => import("./pages/NotFound"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const location = useLocation();

  // Lenis smooth scroll (respects prefers-reduced-motion)
  useLenis();

  return (
    <>
      <ScrollToTop />
      <ScrollProgress />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Nav />
      <AnnouncementBanner />
      <Breadcrumbs />
      <AnnouncementPopup />
      <main id="main-content" key={location.pathname}>
        <Suspense fallback={<PageSkeleton />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mass-times" element={<MassTimes />} />
            <Route path="/about" element={<About />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/bulletin" element={<Bulletin />} />
            <Route path="/becoming-catholic" element={<BecomingCatholic />} />
            <Route path="/get-involved" element={<GetInvolved />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/give" element={<Give />} />
            <Route path="/sacraments" element={<Sacraments />} />
            <Route path="/sacraments/baptism" element={<Baptism />} />
            <Route path="/sacraments/first-communion" element={<FirstCommunion />} />
            <Route path="/sacraments/confirmation" element={<Confirmation />} />
            <Route path="/sacraments/marriage" element={<Marriage />} />
            <Route path="/sacraments/anointing" element={<Anointing />} />
            <Route path="/sacraments/funerals" element={<Funerals />} />
            <Route path="/visit" element={<Visit />} />
            <Route path="/history" element={<History />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/architecture" element={<Architecture />} />
            {/* Blog removed — redirect any old/indexed blog URLs to home (/blog itself is in LEGACY_REDIRECTS) */}
            <Route path="/blog/:slug" element={<Navigate to="/" replace />} />
            <Route path="/faith-formation" element={<FaithFormation />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/writers-guide" element={<WritersGuide />} />
            <Route path="/connect" element={<Connect />} />
            {/* Old eCatholic URLs (the build also writes static redirect pages for these) */}
            {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}
            <Route path="/events/:slug" element={<Navigate to="/events" replace />} />
            <Route path="/news/:slug" element={<Navigate to="/" replace />} />
            <Route path="/photoalbums/:slug" element={<Navigate to="/gallery" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <ParishActionBar />
    </>
  );
}

export default function App() {
  const { i18n } = useTranslation();

  // Hydrate localStorage from the shared Google Sheet on mount so visitors
  // on any device see the latest admin edits. No-op if backend isn't set.
  useEffect(() => {
    if (adminCmsConfigured()) pullAll();
  }, []);

  // Keep <html lang> in sync with the active locale so screen readers and
  // search engines see the right language. The wrapper <div lang> below
  // covers the React tree, but the <html> element lives outside it.
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Analytics />
        <div lang={i18n.language}>
          <AppRoutes />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
