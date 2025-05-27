
import { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { MatchingService, MatchedUser } from '@/services/MatchingService';
import { MessageCircle, Video, Users } from 'lucide-react';

const SkillBadge = ({ skill, isMatching = false }: { skill: string; isMatching?: boolean }) => (
  <Badge 
    variant="outline"
    className={`${isMatching ? 'bg-primary/20 border-primary/40' : 'bg-secondary/20'}`}
  >
    {skill}
  </Badge>
);

const MatchCard = ({ match }: { match: MatchedUser }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={match.avatar_url || undefined} alt={match.full_name} />
          <AvatarFallback className="text-lg">
            {match.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="text-xl font-semibold">{match.full_name}</h3>
          <p className="text-sm text-muted-foreground">
            {match.matchingTeachSkills.length} skill{match.matchingTeachSkills.length !== 1 ? 's' : ''} they can teach you
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium mb-2 text-green-600">
            ✅ They can teach you:
          </p>
          <div className="flex flex-wrap gap-2">
            {match.skills_teach.map((skill) => (
              <SkillBadge 
                key={skill} 
                skill={skill} 
                isMatching={match.matchingTeachSkills.includes(skill)}
              />
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium mb-2 text-blue-600">
            📚 They want to learn:
          </p>
          <div className="flex flex-wrap gap-2">
            {match.skills_learn.map((skill) => (
              <SkillBadge 
                key={skill} 
                skill={skill} 
                isMatching={match.matchingLearnSkills.includes(skill)}
              />
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <MessageCircle className="h-4 w-4 mr-2" />
          Message
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <Video className="h-4 w-4 mr-2" />
          Video Chat
        </Button>
      </CardFooter>
    </Card>
  );
};

const LoadingState = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="text-center py-12">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Matches</h3>
      <p className="text-red-600">{message}</p>
    </div>
  </div>
);

const NoMatchesState = () => (
  <div className="text-center py-12">
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md mx-auto">
      <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Matches Found</h3>
      <p className="text-gray-600 mb-4">
        We couldn't find anyone whose skills match what you're looking for right now.
      </p>
      <p className="text-sm text-gray-500">
        Try updating your profile with more skills or check back later!
      </p>
    </div>
  </div>
);

const Matches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<MatchedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      if (!user?.id) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading matches for user:', user.id);
        const foundMatches = await MatchingService.findMatches(user.id);
        
        setMatches(foundMatches);
        
        if (foundMatches.length === 0) {
          console.log('DEBUG: No matches found - this could be because:');
          console.log('1. User has no skills configured');
          console.log('2. No other users in database');
          console.log('3. No overlapping skills with other users');
          console.log('4. Other users don\'t have complementary skills');
        }
      } catch (err) {
        console.error('Error loading matches:', err);
        setError(err instanceof Error ? err.message : 'Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [user?.id]);

  const renderContent = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (matches.length === 0) return <NoMatchesState />;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Your Skill Matches</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect with people who can teach you skills you want to learn, and who want to learn skills you can teach.
          </p>
          {matches.length > 0 && (
            <p className="text-sm text-primary mt-2">
              Found {matches.length} perfect match{matches.length !== 1 ? 'es' : ''} for you!
            </p>
          )}
        </div>

        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default Matches;
