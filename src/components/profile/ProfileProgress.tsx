
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ProfileProgressProps {
  completion: number;
}

export const ProfileProgress = ({ completion }: ProfileProgressProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setProgress(completion), 100);
    return () => clearTimeout(timer);
  }, [completion]);
  
  return (
    <div className="sticky top-4 z-10 p-4 bg-card/60 backdrop-blur-md rounded-lg shadow-lg border border-primary/10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">
              Profile Completion: 
            </span>
            <motion.span
              key={completion}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold text-primary"
            >
              {progress}%
              {completion >= 80 && " ✅"}
            </motion.span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {completion < 80 ? (
              <>Complete at least 80% to unlock all features</>
            ) : (
              <>All features unlocked! Complete your profile for full experience</>
            )}
          </div>
        </div>
        
        <div className="w-full md:max-w-[200px]">
          <div className="h-2 w-full">
            <Progress
              value={progress} 
              className="h-2 bg-secondary/30"
              indicatorClassName={`${
                completion < 40
                  ? "bg-red-500"
                  : completion < 80
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              } transition-all duration-500 shadow-[0_0_10px_var(--tw-shadow-color)] shadow-current`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
