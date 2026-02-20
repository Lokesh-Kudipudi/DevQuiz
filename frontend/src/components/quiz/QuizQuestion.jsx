import Card from '../ui/Card';
import QuestionDisplay from '../ui/QuestionDisplay';

const QuizQuestion = ({ question, selectedOption, onOptionSelect }) => {
    return (
        <Card className="mb-8 min-h-[400px] flex flex-col">
            <div className="mb-8 text-white">
                <QuestionDisplay content={question.question} />
            </div>
            
            <div className="space-y-3 flex-grow">
                {question.options.map((option, idx) => (
                    <div 
                        key={idx}
                        onClick={() => onOptionSelect(option)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center ${
                            selectedOption === option 
                                ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-500/20' 
                                : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-500 text-gray-300'
                        }`}
                    >
                        <div className={`w-5 h-5 rounded-full border mr-4 flex items-center justify-center ${
                            selectedOption === option 
                                ? 'border-white bg-white text-primary-600' 
                                : 'border-gray-500'
                        }`}>
                            {selectedOption === option && <div className="w-2.5 h-2.5 rounded-full bg-current"></div>}
                        </div>
                        {option}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default QuizQuestion;
