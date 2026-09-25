import {
  Features,
  FinalCta,
  Hero,
  HowItWorks,
  WelcomeFooter,
  WelcomeHeader,
} from "@/components/home";

interface WelcomePageProps {
  isSignedIn?: boolean;
}

export default function Page({ isSignedIn = false }: WelcomePageProps) {
  return (
    <div className="min-h-screen bg-(--bg-base) text-(--text-primary)">
      <WelcomeHeader isSignedIn={isSignedIn} />
      <Hero isSignedIn={isSignedIn} />
      <HowItWorks />
      <Features />
      <FinalCta isSignedIn={isSignedIn} />
      <WelcomeFooter />
    </div>
  );
}
