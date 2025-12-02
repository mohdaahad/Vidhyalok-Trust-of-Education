import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Donate from "./pages/Donate";
import DonationSuccess from "./pages/DonationSuccess";
import DonationHistory from "./pages/DonationHistory";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Contact from "./pages/Contact";
import Volunteer from "./pages/Volunteer";
import VolunteerProfile from "./pages/VolunteerProfile";
import AnnualReports from "./pages/AnnualReports";
import MediaGallery from "./pages/MediaGallery";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import AdminRoute from "./components/admin/AdminRoute";
import AdminDashboard from "./pages/admin/Dashboard";
import ManageProjects from "./pages/admin/ManageProjects";
import ManageVolunteers from "./pages/admin/ManageVolunteers";
import ManageEvents from "./pages/admin/ManageEvents";
import ManageDonations from "./pages/admin/ManageDonations";
import ManageContacts from "./pages/admin/ManageContacts";
import ManageNewsletters from "./pages/admin/ManageNewsletters";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="donate" element={<Donate />} />
            <Route path="donation-success" element={<DonationSuccess />} />
            {/* <Route path="donation-history" element={<DonationHistory />} /> */}
            <Route path="events" element={<Events />} />
            <Route path="events/:id" element={<EventDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="volunteer" element={<Volunteer />} />
            {/* <Route path="volunteer-profile" element={<VolunteerProfile />} /> */}
            {/* <Route path="annual-reports" element={<AnnualReports />} />
            <Route path="gallery" element={<MediaGallery />} /> */}
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsOfService />} />
          </Route>

          {/* Admin Login (no layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes with AdminLayout */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<ManageProjects />} />
              <Route path="volunteers" element={<ManageVolunteers />} />
              <Route path="events" element={<ManageEvents />} />
              <Route path="donations" element={<ManageDonations />} />
              <Route path="contacts" element={<ManageContacts />} />
              <Route path="newsletters" element={<ManageNewsletters />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
