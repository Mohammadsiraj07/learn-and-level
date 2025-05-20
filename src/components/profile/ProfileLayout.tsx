
import { ReactNode } from "react";

interface ProfileLayoutProps {
  children: ReactNode;
}

export const ProfileLayout = ({ children }: ProfileLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/95">
      <div className="container max-w-4xl px-4 py-8 md:py-12">
        {children}
      </div>
    </div>
  );
};
