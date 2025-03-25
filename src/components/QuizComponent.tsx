
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface QuizComponentProps {
  questions: Question[];
  onComplete: (score: number) => void;
  bossName: string;
}

const QuizComponent = ({ questions, onComplete, bossName }: QuizComponentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  const handleOptionSelect = (index: number) => {
    if (!answered) {
      setSelectedOption(index);
    }
  };
  
  const handleSubmit = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    setAnswered(true);
    setShowFeedback(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      setAnswered(false);
      setSelectedOption(null);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onComplete(score + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Challenge {bossName}</h2>
          <div className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">{currentQuestion.text}</h3>
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg cursor-pointer transition-all 
                ${selectedOption === index 
                  ? (answered 
                    ? (index === currentQuestion.correctAnswer 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50')
                    : 'border-primary bg-primary/10') 
                  : 'border-gray-200 hover:border-gray-300'}
                ${answered && index === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : ''}
              `}
              onClick={() => handleOptionSelect(index)}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {answered && index === currentQuestion.correctAnswer && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {answered && selectedOption === index && index !== currentQuestion.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showFeedback && (
        <div className={`p-4 mb-4 rounded-lg ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {selectedOption === currentQuestion.correctAnswer 
            ? 'Correct! Well done!' 
            : `Incorrect. The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
        </div>
      )}
      
      <Button
        className="w-full"
        disabled={selectedOption === null || answered}
        onClick={handleSubmit}
      >
        Submit Answer
      </Button>
    </div>
  );
};

export default QuizComponent;
