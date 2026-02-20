import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import RoundTypeSelection from '../components/coding-round/RoundTypeSelection';
import BasicDetailsForm from '../components/coding-round/BasicDetailsForm';
import PistonRoundForm from '../components/coding-round/PistonRoundForm';

const CreateCodingRound = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [timeLimit, setTimeLimit] = useState(60);
    const [roundType, setRoundType] = useState('External'); // 'Piston' | 'External'
    const [allowSelfAttempt, setAllowSelfAttempt] = useState(false);

    // Piston specific state
    const [questions, setQuestions] = useState([
        { 
            title: '', 
            description: '', 
            difficulty: 'Easy', 
            topic: '', 
            starterCode: '// Write your code here',
            testCases: [{ input: '', expectedOutput: '', isHidden: false }] 
        }
    ]);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                title,
                groupId,
                timeLimit,
                type: roundType,
                allowSelfAttempt
            };

            if (roundType === 'Piston') {
                payload.questions = questions;
            }

            const { data } = await axios.post('/api/coding-rounds', payload);
            
            if (roundType === 'External') {
                navigate(`/coding-round/${data._id}/lobby`);
            } else {
                navigate(`/groups/${groupId}`);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create coding round');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <Card>
                    <h1 className="text-3xl font-bold text-white mb-6">Create Coding Round</h1>
                    
                    {error && (
                        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Round Type Selection */}
                        <RoundTypeSelection 
                            roundType={roundType} 
                            setRoundType={setRoundType} 
                        />

                        {/* Basic Details */}
                        <BasicDetailsForm 
                            title={title} 
                            setTitle={setTitle}
                            timeLimit={timeLimit}
                            setTimeLimit={setTimeLimit}
                            roundType={roundType}
                            allowSelfAttempt={allowSelfAttempt}
                            setAllowSelfAttempt={setAllowSelfAttempt}
                        />

                        {/* Piston Specific Form */}
                        {roundType === 'Piston' && (
                            <PistonRoundForm 
                                questions={questions} 
                                setQuestions={setQuestions} 
                            />
                        )}

                        <div className="flex justify-end pt-6 border-t border-gray-700 mt-8">
                            <Button type="submit" disabled={loading} className="w-full md:w-auto">
                                {loading ? 'Creating...' : (roundType === 'External' ? 'Create Lobby' : 'Create Coding Round')}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </Layout>
    );
};

export default CreateCodingRound;

