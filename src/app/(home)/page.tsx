import {
  Features,
  FinalCta,
  Hero,
  HowItWorks,
  WelcomeFooter,
  WelcomeHeader,
} from "@/components/home";

export default function Page() {
  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary)">
      <WelcomeHeader />
      <Hero />
      <HowItWorks />
      <Features />
      <FinalCta />
      <WelcomeFooter />
    </div>
  );
}
