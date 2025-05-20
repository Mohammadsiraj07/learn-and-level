
import { useState, useEffect } from "react";
import { CheckCircle, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface CompletionModalProps {
  onClose: () => void;
  topSkill: string;
}

export const CompletionModal = ({ onClose, topSkill }: CompletionModalProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Short delay for animation effect
    const timer = setTimeout(() => {
      setOpen(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  const handleTakeTest = () => {
    handleClose();
    navigate("/test");
  };
  
  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-md border-primary/20">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 260, 
                      damping: 20, 
                      duration: 0.5 
                    }}
                  >
                    <div className="rounded-full bg-gradient-to-br from-emerald-500 to-green-600 p-3 text-white">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-2"
                  >
                    <h2 className="text-2xl font-bold">You're All Set!</h2>
                    <p className="text-center text-muted-foreground">
                      Your profile is complete. You've unlocked all features on SkillSwap!
                    </p>
                  </motion.div>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            {topSkill && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col items-center gap-4 my-4 bg-primary/5 p-6 rounded-lg"
              >
                <Award className="h-10 w-10 text-primary" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">Verify Your Skills</h3>
                  <p className="text-sm text-muted-foreground">
                    Take a quick test to earn a verification badge for your top skill:
                  </p>
                  <p className="mt-2 text-lg font-bold">{topSkill}</p>
                </div>
              </motion.div>
            )}
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
                className="sm:w-full"
              >
                Maybe Later
              </Button>
              
              <Button
                onClick={handleTakeTest}
                className="sm:w-full relative overflow-hidden group"
                disabled={!topSkill}
              >
                <span className="relative z-10">Take Test Now</span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/80 to-purple-600/80 group-hover:scale-105 transition-transform duration-300"></span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
