
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Home, ShoppingBag, Users, Calendar, LogIn, UserPlus, TestTube, LogOut, User } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-4 z-40 mx-auto max-w-7xl px-4">
      <div className="backdrop-blur-xl bg-background/40 border border-white/10 shadow-lg rounded-full flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-primary-foreground font-semibold transition-transform group-hover:scale-110">S</span>
            <span className="font-playfair text-lg font-semibold dark:bg-gradient-to-r dark:from-white dark:to-purple-200 bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-indigo-600 dark:group-hover:from-purple-400 dark:group-hover:to-indigo-300 transition-colors">SkillSwap</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList className="space-x-1">
                <NavigationMenuItem>
                  <Link to="/marketplace" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <ShoppingBag className="mr-1.5 h-4 w-4 text-purple-300 group-hover:text-purple-500 transition-colors" />
                    <span>Marketplace</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/matches" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <Users className="mr-1.5 h-4 w-4 text-purple-300 group-hover:text-purple-500 transition-colors" />
                    <span>Matches</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/schedule" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <Calendar className="mr-1.5 h-4 w-4 text-purple-300 group-hover:text-purple-500 transition-colors" />
                    <span>Schedule</span>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/test" className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background/50 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                    <TestTube className="mr-1.5 h-4 w-4 text-purple-300 group-hover:text-purple-500 transition-colors" />
                    <span>Take Test</span>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full bg-background/50 border border-white/10 transition-all hover:bg-white/10 hover:scale-105"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-300" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-purple-400" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Separator orientation="vertical" className="h-6 bg-white/10" />
          
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1.5 hover:bg-accent/40 transition-all duration-300 rounded-full px-4 bg-white/5 border border-white/10 backdrop-blur-lg">
                    <User className="h-4 w-4 text-purple-300" />
                    <span className="ml-1">{user.email?.split('@')[0] || 'Account'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 backdrop-blur-xl bg-background/80 border border-white/10">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-purple-300" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/settings" className="flex items-center">
                      <Moon className="mr-2 h-4 w-4 text-purple-300" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-rose-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" className="rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center gap-1.5 transition-all duration-300 px-4">
                    <LogIn className="h-4 w-4 text-purple-300" />
                    Log in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="flex items-center gap-1.5 group transition-all duration-300 hover:scale-105 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-lg hover:shadow-purple-500/20">
                    <UserPlus className="h-4 w-4 transition-transform group-hover:scale-110" />
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden fixed inset-0 top-16 z-50 backdrop-blur-xl bg-background/95 px-6 py-8 transition-transform duration-300 ease-in-out",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col gap-6">
          <Link 
            to="/marketplace" 
            className="flex items-center gap-2 text-foreground text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <ShoppingBag className="h-5 w-5 text-purple-400" />
            Marketplace
          </Link>
          <Link 
            to="/matches" 
            className="flex items-center gap-2 text-foreground text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Users className="h-5 w-5 text-purple-400" />
            Matches
          </Link>
          <Link 
            to="/schedule" 
            className="flex items-center gap-2 text-foreground text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <Calendar className="h-5 w-5 text-purple-400" />
            Schedule
          </Link>
          <Link 
            to="/test" 
            className="flex items-center gap-2 text-foreground text-lg font-medium hover:text-primary transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            <TestTube className="h-5 w-5 text-purple-400" />
            Take Test
          </Link>
          
          <div className="flex flex-col gap-3 mt-6 border-t border-white/10 pt-6">
            {user ? (
              <>
                <div className="px-2 py-1 text-sm text-muted-foreground mb-2">
                  Signed in as <span className="font-medium text-purple-400">{user.email}</span>
                </div>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2 bg-white/5 border-white/10">
                    <User className="h-5 w-5 text-purple-300" />
                    Profile
                  </Button>
                </Link>
                <Button 
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }} 
                  variant="destructive" 
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="h-5 w-5" />
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10">
                    <LogIn className="h-5 w-5 text-purple-300" />
                    Log in
                  </Button>
                </Link>
                <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600">
                    <UserPlus className="h-5 w-5" />
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
