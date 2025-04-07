import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, MapPin, Users, Clock, Shield, Zap, BrainCircuit, Gauge, Share, Circle, X, Sword } from "lucide-react";
import Button from "@/components/Button";
import QRCode from "@/components/QRCode";
import QuizComponent from "@/components/QuizComponent";
import TicTacToeGame from "@/components/TicTacToeGame";
import SwipeGame from "@/components/SwipeGame";
import { Question } from "@/components/QuizComponent";

const BOSSES = {
  b1: {
    id: "b1",
    name: "Crystal Golem",
    image: "https://images.unsplash.com/photo-1551396089-31f85ca7d9dd?q=80&w=2574&auto=format&fit=crop",
    description: "A massive crystalline entity that has emerged from the depths of the earth. Test your knowledge about gemstones and minerals to defeat it.",
    location: "Central Park, near the fountain",
    difficulty: "rare",
    reward: "15% Off at Starbucks",
    teamSize: 1,
    timeLimit: "10 min",
    distance: "0.3 mi",
    challengeType: "quiz",
    stats: {
      health: 70,
      power: 40,
      defense: 90,
      speed: 20
    },
    business: {
      name: "Starbucks",
      offer: "15% Off Any Drink",
      validUntil: "Sep 30, 2023",
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png"
    },
    quiz: [
      {
        id: 1,
        text: "Which mineral is known as 'Fool's Gold'?",
        options: ["Quartz", "Pyrite", "Calcite", "Mica"],
        correctAnswer: 1
      },
      {
        id: 2,
        text: "What is the hardest natural substance on Earth?",
        options: ["Titanium", "Platinum", "Diamond", "Steel"],
        correctAnswer: 2
      },
      {
        id: 3,
        text: "Which of these is NOT a crystal system?",
        options: ["Cubic", "Hexagonal", "Octagonal", "Tetragonal"],
        correctAnswer: 2
      }
    ]
  },
  b2: {
    id: "b2",
    name: "Shadow Drake",
    image: "https://images.unsplash.com/photo-1560089168-4b1539c9b56e?q=80&w=2564&auto=format&fit=crop",
    description: "A mysterious draconic creature that manipulates shadows and darkness. Answer questions about mythological creatures to earn your reward.",
    location: "Downtown Plaza, near the theater",
    difficulty: "epic",
    reward: "Free Appetizer at Cheesecake Factory",
    teamSize: 2,
    timeLimit: "15 min",
    distance: "0.8 mi",
    challengeType: "quiz",
    stats: {
      health: 85,
      power: 75,
      defense: 60,
      speed: 70
    },
    business: {
      name: "Cheesecake Factory",
      offer: "Free Appetizer with Entrée",
      validUntil: "Oct 15, 2023",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/The_Cheesecake_Factory_Logo_2023.svg/2560px-The_Cheesecake_Factory_Logo_2023.svg.png"
    },
    quiz: [
      {
        id: 1,
        text: "In Greek mythology, what creature has the head of a human and the body of a lion?",
        options: ["Minotaur", "Sphinx", "Centaur", "Chimera"],
        correctAnswer: 1
      },
      {
        id: 2,
        text: "Which mythical creature is said to be able to breathe fire?",
        options: ["Unicorn", "Griffin", "Dragon", "Kraken"],
        correctAnswer: 2
      },
      {
        id: 3,
        text: "What mythical bird rises from its own ashes?",
        options: ["Roc", "Phoenix", "Thunderbird", "Harpy"],
        correctAnswer: 1
      },
      {
        id: 4,
        text: "Which creature from Japanese folklore can shapeshift?",
        options: ["Kappa", "Tengu", "Kitsune", "Oni"],
        correctAnswer: 2
      }
    ]
  },
  b3: {
    id: "b3",
    name: "Celestial Guardian",
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2274&auto=format&fit=crop",
    description: "An ancient being of cosmic energy that tests the worthiness of those who seek knowledge. Answer astronomy questions to claim your reward.",
    location: "Harbor View Park, pier entrance",
    difficulty: "legendary",
    reward: "50% Off at AMC Theaters",
    teamSize: 3,
    timeLimit: "20 min",
    distance: "1.2 mi",
    challengeType: "quiz",
    stats: {
      health: 95,
      power: 90,
      defense: 85,
      speed: 80
    },
    business: {
      name: "AMC Theaters",
      offer: "50% Off Any Movie Ticket",
      validUntil: "Nov 30, 2023",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/AMC_Theatres_Logo.svg/2560px-AMC_Theatres_Logo.svg.png"
    },
    quiz: [
      {
        id: 1,
        text: "What is the largest planet in our solar system?",
        options: ["Saturn", "Jupiter", "Neptune", "Uranus"],
        correctAnswer: 1
      },
      {
        id: 2,
        text: "What is the name of the galaxy that contains our solar system?",
        options: ["Andromeda", "Triangulum", "Milky Way", "Whirlpool"],
        correctAnswer: 2
      },
      {
        id: 3,
        text: "What is a celestial body made of ice and dust that orbits the Sun?",
        options: ["Asteroid", "Comet", "Meteor", "Planet"],
        correctAnswer: 1
      },
      {
        id: 4,
        text: "What phenomenon occurs when the Moon passes between the Sun and Earth?",
        options: ["Solar Eclipse", "Lunar Eclipse", "Supernova", "Aurora Borealis"],
        correctAnswer: 0
      },
      {
        id: 5,
        text: "What is the hottest planet in our solar system?",
        options: ["Mercury", "Venus", "Mars", "Jupiter"],
        correctAnswer: 1
      }
    ]
  },
  featured: {
    id: "featured",
    name: "Today's Featured Boss",
    image: "https://images.unsplash.com/photo-1633478062482-790967a4169c?q=80&w=3088&auto=format&fit=crop",
    description: "A special challenge that changes daily. Today's challenge tests your skills in the classic game of Tic-Tac-Toe against an AI opponent.",
    location: "City Center Mall",
    difficulty: "epic",
    reward: "Buy One Get One Free at Jamba Juice",
    teamSize: 1,
    timeLimit: "15 min",
    distance: "0.5 mi",
    challengeType: "tictactoe",
    stats: {
      health: 80,
      power: 70,
      defense: 75,
      speed: 85
    },
    business: {
      name: "Jamba Juice",
      offer: "Buy One Get One Free",
      validUntil: "Today Only",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Jamba_2017.svg/2560px-Jamba_2017.svg.png"
    },
    quiz: []
  },
  swipeboss: {
    id: "swipeboss",
    name: "Blade Master",
    image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=2218&auto=format&fit=crop",
    description: "A formidable opponent that can only be defeated by swift, precise strikes. Test your reflexes in this swipe challenge!",
    location: "Downtown Square",
    difficulty: "legendary",
    reward: "Free Movie Ticket at AMC",
    teamSize: 1,
    timeLimit: "30 sec",
    distance: "0.7 mi",
    challengeType: "swipe",
    stats: {
      health: 90,
      power: 85,
      defense: 60,
      speed: 95
    },
    business: {
      name: "AMC Theaters",
      offer: "Free Movie Ticket",
      validUntil: "Dec 31, 2023",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/AMC_Theatres_Logo.svg/2560px-AMC_Theatres_Logo.svg.png"
    },
    quiz: []
  }
};

const BossDetails = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [showReward, setShowReward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inChallenge, setInChallenge] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<"quiz" | "tictactoe" | "swipe" | null>(null);
  
  const boss = BOSSES[id as keyof typeof BOSSES];
  
  if (!boss) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Boss Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The boss you're looking for doesn't exist or has been defeated.
          </p>
          <Button onClick={() => navigate("/map")}>
            Return to Map
          </Button>
        </div>
      </div>
    );
  }
  
  const difficultyColors = {
    rare: "bg-boss-rare text-white",
    epic: "bg-boss-epic text-white",
    legendary: "bg-boss-legendary text-white",
  };
  
  const difficultyLabels = {
    rare: "Rare",
    epic: "Epic",
    legendary: "Legendary",
  };
  
  const handleStartChallenge = (challengeType: "quiz" | "tictactoe" | "swipe") => {
    setIsLoading(true);
    setSelectedChallenge(challengeType);
    setTimeout(() => {
      setIsLoading(false);
      setInChallenge(true);
    }, 1000);
  };
  
  const handleChallengeComplete = (result: number | boolean) => {
    let success: boolean;
    
    if (typeof result === 'number') {
      const totalQuestions = boss.quiz?.length || 1;
      const percentage = (result / totalQuestions) * 100;
      success = percentage >= 60;
      
      if (!success) {
        alert(`You need at least 60% correct answers to defeat ${boss.name}. Try again!`);
      }
    } else {
      success = result;
      
      if (!success) {
        alert(`You failed to defeat ${boss.name}. Try again!`);
      }
    }
    
    if (success) {
      setShowReward(true);
      setInChallenge(false);
    } else {
      setInChallenge(false);
    }
  };
  
  const renderChallenge = () => {
    const challengeType = selectedChallenge || boss.challengeType;
    
    if (challengeType === "quiz") {
      return (
        <QuizComponent 
          questions={boss.quiz}
          onComplete={handleChallengeComplete}
          bossName={boss.name}
        />
      );
    } else if (challengeType === "tictactoe") {
      const tictactoeDifficulty = (boss.difficulty === "rare" || boss.difficulty === "epic" || boss.difficulty === "legendary") 
        ? boss.difficulty 
        : "epic" as const;
      
      return (
        <TicTacToeGame
          onComplete={handleChallengeComplete}
          difficulty={tictactoeDifficulty}
        />
      );
    } else if (challengeType === "swipe") {
      const swipeDifficulty = (boss.difficulty === "rare" || boss.difficulty === "epic" || boss.difficulty === "legendary") 
        ? boss.difficulty 
        : "epic" as const;
      
      return (
        <SwipeGame
          onComplete={handleChallengeComplete}
          difficulty={swipeDifficulty}
          bossName={boss.name}
        />
      );
    }
    
    return null;
  };
  
  const getChallengeTypeIcon = () => {
    if (boss.challengeType === "quiz") {
      return <BrainCircuit size={24} className="text-primary mb-2" />;
    } else if (boss.challengeType === "tictactoe") {
      return <div className="flex mb-2"><Circle size={20} className="text-primary mr-1" /><X size={20} className="text-primary" /></div>;
    } else if (boss.challengeType === "swipe") {
      return <Sword size={24} className="text-primary mb-2" />;
    }
    
    return <BrainCircuit size={24} className="text-primary mb-2" />;
  };
  
  const getChallengeTypeName = () => {
    if (boss.challengeType === "quiz") {
      return "Quiz Challenge";
    } else if (boss.challengeType === "tictactoe") {
      return "Tic-Tac-Toe";
    } else if (boss.challengeType === "swipe") {
      return "Swipe Attack";
    }
    
    return "Challenge";
  };
  
  return (
    <div className="min-h-screen bg-background">
      {showReward ? (
        <div className="min-h-screen flex flex-col items-center justify-center p-6">
          <div className="w-full max-w-md mx-auto text-center">
            <div className="mb-6">
              <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy size={40} className="text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Challenge Complete!</h1>
              <p className="text-muted-foreground mb-8">
                Congratulations on defeating {boss.name}! Here's your reward:
              </p>
            </div>
            
            <QRCode
              value={`bosshunt:reward:${boss.id}`}
              business={boss.business}
            />
            
            <div className="mt-8 space-y-4">
              <Button
                fullWidth
                variant="outline"
                onClick={() => navigate("/rewards")}
              >
                View All Rewards
              </Button>
              
              <Button
                fullWidth
                variant="ghost"
                onClick={() => navigate("/map")}
              >
                Return to Map
              </Button>
            </div>
          </div>
        </div>
      ) : inChallenge ? (
        <div className="min-h-screen p-6">
          <div className="max-w-lg mx-auto">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => setInChallenge(false)}
            >
              <ArrowLeft size={20} className="mr-2" /> Back to Boss Info
            </Button>
            
            {renderChallenge()}
          </div>
        </div>
      ) : (
        <>
          <div className="relative">
            <div className="h-64 overflow-hidden">
              <img 
                src={boss.image} 
                alt={boss.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
            </div>
            
            <Button
              variant="ghost"
              className="absolute top-4 left-4 text-white hover:bg-white/20"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={24} />
            </Button>
            
            <Button
              variant="ghost"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              size="icon"
            >
              <Share size={20} />
            </Button>
            
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
              <div className={`px-4 py-2 rounded-full shadow-lg ${difficultyColors[boss.difficulty as keyof typeof difficultyColors]}`}>
                <span className="text-sm font-bold">{difficultyLabels[boss.difficulty as keyof typeof difficultyLabels]} Challenge</span>
              </div>
            </div>
          </div>
          
          <div className="px-6 pt-12 pb-28 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center">{boss.name}</h1>
            
            <div className="flex items-center justify-center text-sm text-muted-foreground mb-6">
              <MapPin size={16} className="mr-1" />
              <span>{boss.location}</span>
              {boss.distance && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-secondary text-xs">
                  {boss.distance}
                </span>
              )}
            </div>
            
            <p className="text-muted-foreground mb-8">
              {boss.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                <Trophy size={24} className="text-primary mb-2" />
                <span className="text-sm font-medium">{boss.reward}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                <Users size={24} className="text-primary mb-2" />
                <span className="text-sm font-medium">Team of {boss.teamSize}</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                <Clock size={24} className="text-primary mb-2" />
                <span className="text-sm font-medium">{boss.timeLimit} limit</span>
              </div>
              
              <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/50">
                {getChallengeTypeIcon()}
                <span className="text-sm font-medium">{getChallengeTypeName()}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Boss Stats</h2>
              <div className="space-y-3">
                <StatBar
                  label="Health"
                  value={boss.stats.health}
                  icon={<Shield size={16} />}
                  color="bg-red-500"
                />
                <StatBar
                  label="Power"
                  value={boss.stats.power}
                  icon={<Zap size={16} />}
                  color="bg-yellow-500"
                />
                <StatBar
                  label="Defense"
                  value={boss.stats.defense}
                  icon={<Shield size={16} />}
                  color="bg-blue-500"
                />
                <StatBar
                  label="Speed"
                  value={boss.stats.speed}
                  icon={<Gauge size={16} />}
                  color="bg-green-500"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <Button
                fullWidth
                size="lg"
                onClick={() => handleStartChallenge(boss.challengeType as "quiz" | "tictactoe" | "swipe")}
                isLoading={isLoading && selectedChallenge === boss.challengeType}
                className="shadow-xl"
              >
                Start {getChallengeTypeName()}
              </Button>
              
              {boss.challengeType !== "quiz" && (
                <Button
                  fullWidth
                  size="lg"
                  variant="secondary"
                  onClick={() => handleStartChallenge("quiz")}
                  isLoading={isLoading && selectedChallenge === "quiz"}
                  className="shadow-xl"
                  leftIcon={<BrainCircuit size={20} />}
                >
                  Start Quiz Game
                </Button>
              )}
              
              {boss.challengeType !== "tictactoe" && boss.id !== "featured" && (
                <Button
                  fullWidth
                  size="lg"
                  variant="outline"
                  onClick={() => handleStartChallenge("tictactoe")}
                  isLoading={isLoading && selectedChallenge === "tictactoe"}
                  className="shadow-xl"
                  leftIcon={<Circle size={20} />}
                  rightIcon={<X size={20} />}
                >
                  Start Tic-Tac-Toe
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface StatBarProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatBar = ({ label, value, icon, color }: StatBarProps) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center text-sm">
          <span className="mr-2">{icon}</span>
          <span>{label}</span>
        </div>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default BossDetails;
