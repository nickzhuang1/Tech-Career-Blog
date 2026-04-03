import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { lazy, Suspense, useEffect } from "react";

const About = lazy(() => import("@/pages/About"));
const Timeline = lazy(() => import("@/pages/Timeline"));
const Certificates = lazy(() => import("@/pages/Certificates"));
const Posts = lazy(() => import("@/pages/Posts"));
const PostDetail = lazy(() => import("@/pages/PostDetail"));
const Contact = lazy(() => import("@/pages/Contact"));

function PageFallback() {
  return <div className="flex-1 min-h-[60vh]" />;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={() => (
            <Suspense fallback={<PageLoading />}> <About /> </Suspense>
          )} />
          <Route path="/timeline" component={() => (
            <Suspense fallback={<PageLoading />}> <Timeline /> </Suspense>
          )} />
          <Route path="/certificates" component={() => (
            <Suspense fallback={<PageLoading />}> <Certificates /> </Suspense>
          )} />
          <Route path="/posts" component={() => (
            <Suspense fallback={<PageLoading />}> <Posts /> </Suspense>
          )} />
          <Route path="/posts/:id" component={() => (
            <Suspense fallback={<PageLoading />}> <PostDetail /> </Suspense>
          )} />
          <Route path="/contact" component={() => (
            <Suspense fallback={<PageLoading />}> <Contact /> </Suspense>
          )} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

// 全螢幕 loading 動畫元件
function PageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary border-solid border-opacity-30 border-t-primary" />
    </div>
  );
}
function App() {
  const [location] = useLocation();
  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
