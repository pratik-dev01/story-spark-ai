import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from "react-router-dom";
import { getUserInfo } from "./services/auth.service";
import { USER_ROLE } from "./constants/role";
import PageLoader from "./components/loading/PageLoader";

// ── Eagerly loaded (critical path — must be instant) ──────────────────────────
import ScrollToTop from "./components/ScrollToTop";
import RootLayout from "./components/layout/root_layout.component";
import HeroSectionComponent from "./components/hero/hero_section.component";
import HomeComponent from "./components/home/home.component";
import LoginComponent from "./components/login/login.component";
import SignUpComponent from "./components/signup/signup.component";
import NotFoundComponent from "./components/not-found.component";
import MagicCursorComponent from "./components/magic-cursor/magic_cursor.component";
import BranchingStory from "./components/stories/BranchingStory";
import SimpleProtectedRoute from './components/ProtectedRoute';

import Scrolltotopandscrolltobottom from "./components/Scrolltotopandscrolltobottom.tsx"

// ── Lazy loaded — only downloaded when the user visits that route ─────────────
const StoriesComponent           = lazy(() => import("./components/stories/stories.component"));
const WritingAssistantComponent  = lazy(() => import("./components/writing-assistant/writing_assistant.component"));
const StoryInspirationWrapper    = lazy(() => import("./components/StoryInspirationWrapper"));
const StoryWorkspace             = lazy(() => import("./components/story/StoryWorkspace"));
const TemplatesComponent         = lazy(() => import("./components/templates/templates.component"));
const PricingComponent           = lazy(() => import("./components/pricing/pricing.component"));
const PostDetailsComponent       = lazy(() => import("./components/post/post.details.component"));
const ExploreComponent           = lazy(() => import("./components/post/post.component"));
const BookmarksComponent         = lazy(() => import("./components/post/bookmarks.component"));
const CommunityComponent         = lazy(() => import("./components/community/community.component"));
const ResourcesListComponent     = lazy(() => import("./components/community/resources_list.component"));
const ResourceDetailComponent    = lazy(() => import("./components/community/resource_detail.component"));
const HelpCenterComponent        = lazy(() => import("./components/help_center/help_center.component"));
const Contact                    = lazy(() => import("./components/contactus/contactus"));
const AboutUsComponent           = lazy(() => import("./components/footer/about-us"));
const CareerComponent            = lazy(() => import("./components/footer/career"));
const BlogComponent              = lazy(() => import("./components/footer/blog"));
const PrivacyPolicy              = lazy(() => import("./components/footer/Privacy"));
const CookiePolicy               = lazy(() => import("./components/footer/cookie-policy"));
const Terms                      = lazy(() => import("./components/footer/terms"));
const GuidelinesComponent        = lazy(() => import("./components/footer/guidelines"));
const ContributorsComponent      = lazy(() => import("./components/footer/contributors"));
const ReportBug                  = lazy(() => import("./components/report-bug/ReportBug"));
const ForgotPasswordComponent    = lazy(() => import("./components/forgot-password/forgot-password.component"));
const EmailValidationComponent   = lazy(() => import("./components/email_validation/email.validation.component"));
const PaymentComponent           = lazy(() => import("./components/home/pricing/payment.component"));
const CollabHome                 = lazy(() => import("./components/collab/CollabHome"));
const CollabRoom                 = lazy(() => import("./components/collab/CollabRoom"));

// ── Dashboard (heavy — analytics uses d3/recharts) ────────────────────────────
const DashboardLayout            = lazy(() => import("./components/dashboard/dashboard_layout.component"));
const DashboardComponent         = lazy(() => import("./components/dashboard/dashboard.component"));
const ProfileComponent           = lazy(() => import("./components/dashboard/profile/profile.component"));
const SettingComponent           = lazy(() => import("./components/dashboard/settings/settings.component"));
const WriterApplicationComponent = lazy(() => import("./components/dashboard/writers/writer_application.component"));
const UserComponent              = lazy(() => import("./components/dashboard/users/user.component"));
const PostListsComponent         = lazy(() => import("./components/dashboard/posts/post_lists.component"));
const AnalyticsPage              = lazy(() => import("./components/dashboard/analytics/analytics.page"));
const PublishedStoriesComponent  = lazy(() => import("./components/dashboard/posts/published_stories.component"));

// ── Auth Guard ────────────────────────────────────────────────────────────────
type ProtectedRouteProps = {
  allowedRoles: string[];
  element?: React.ReactElement;
};

const ProtectedRoute = ({ allowedRoles, element }: ProtectedRouteProps) => {
  const user = getUserInfo();

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return element ? element : <Outlet />;
};

// =========================================================================
// 2. CENTRAL ROUTER MATRIX (Initialized exactly once in the global scope)
// =========================================================================
const ALL_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER, USER_ROLE.USER];
const ELEVATED_ADMIN_ROLES = [USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN];

// ── Router ────────────────────────────────────────────────────────────────────
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <MagicCursorComponent />
        <ScrollToTop />
        <RootLayout>
          <Outlet />
        </RootLayout>
      </>
    ),
    children: [
      // Eagerly rendered critical routes
      { index: true, element: <><HeroSectionComponent /><HomeComponent /></> },
      { path: "login",  element: <LoginComponent /> },
      { path: "signup", element: <SignUpComponent /> },

      // Lazy routes — wrapped in Suspense by the parent router Suspense
      { path: "templates",        element: <TemplatesComponent /> },
      { path: "writing-assistant",element: <ProtectedRoute allowedRoles={ALL_ROLES} element={<WritingAssistantComponent />} /> },
      { path: "story-inspiration",element: <StoryInspirationWrapper /> },
      { path: "stories",          element: <SimpleProtectedRoute><StoriesComponent /></SimpleProtectedRoute> },
      { path: "branching-story",  element: <SimpleProtectedRoute><BranchingStory /></SimpleProtectedRoute> },
      { path: "story-workspace",  element: <SimpleProtectedRoute><StoryWorkspace /></SimpleProtectedRoute> },
      { path: "pricing",          element: <PricingComponent /> },
      { path: "post/:id",         element: <PostDetailsComponent /> },
      { path: "help",             element: <HelpCenterComponent /> },
      { path: "help-center",      element: <HelpCenterComponent /> },
      { path: "contact-us",       element: <Contact /> },
      { path: "about-us",         element: <AboutUsComponent /> },
      { path: "career",           element: <CareerComponent /> },
      { path: "blog",             element: <BlogComponent /> },
      { path: "privacy-policy",   element: <PrivacyPolicy /> },
      { path: "cookie-policy",    element: <CookiePolicy /> },
      { path: "terms",            element: <Terms /> },
      { path: "guidelines",       element: <GuidelinesComponent /> },
      { path: "contributors",     element: <ContributorsComponent /> },
      { path: "report-bug",       element: <ReportBug /> },
      { path: "forgot-password",  element: <ForgotPasswordComponent /> },

      // Protected Sub-Tree running under the RootLayout context
      {
        element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
        children: [
          { path: "explore",                    element: <ExploreComponent /> },
          { path: "bookmarks",                  element: <BookmarksComponent /> },
          { path: "community",                  element: <CommunityComponent /> },
          { path: "resources",                  element: <ResourcesListComponent /> },
          { path: "resources/:resourceName",    element: <ResourceDetailComponent /> },
        ],
      },
      { path: "*", element: <NotFoundComponent /> },
    ],
  },

  // Isolated layout branches (Bypassing public navigation headers entirely)
  { path: "/auth/email-validation", element: <EmailValidationComponent /> },
  { path: "/payment",               element: <PaymentComponent /> },
  { path: "/collab",                element: <CollabHome /> },
  { path: "/collab/:roomId",        element: <CollabRoom /> },

  // Administrative Dashboard Infrastructure Tree
  {
    path: "/dashboard",
    element: <ProtectedRoute allowedRoles={ALL_ROLES} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { index: true,      element: <DashboardComponent /> },
          { path: "profile",  element: <ProfileComponent /> },
          { path: "writers",  element: <WriterApplicationComponent /> },
          { path: "users",    element: <UserComponent /> },
          {
            element: <ProtectedRoute allowedRoles={[USER_ROLE.USER, USER_ROLE.WRITER]} />,
            children: [
              { path: "settings", element: <SettingComponent /> },
              { path: "published-stories", element: <PublishedStoriesComponent /> },
            ],
          },
          {
            element: <ProtectedRoute allowedRoles={[USER_ROLE.WRITER]} />,
            children: [{ path: "analytics", element: <AnalyticsPage /> }],
          },
          {
            element: <ProtectedRoute allowedRoles={[USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN, USER_ROLE.WRITER]} />,
            children: [{ path: "post-lists", element: <PostListsComponent /> }],
          },
        ],
      },
    ],
  },
]);

// =========================================================================
// APP
// =========================================================================
function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
