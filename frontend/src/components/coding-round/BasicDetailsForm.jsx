import Input from '../ui/Input';

const BasicDetailsForm = ({ title, setTitle, timeLimit, setTimeLimit, roundType, allowSelfAttempt, setAllowSelfAttempt }) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="Round Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Weekly Contest 101"
                    required
                />
                <Input
                    label="Time Limit (minutes)"
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                    min="1"
                    required
                />
            </div>

            {roundType === 'External' && (
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mt-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={allowSelfAttempt}
                            onChange={(e) => setAllowSelfAttempt(e.target.checked)}
                            className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-600 bg-gray-700 focus:ring-purple-500"
                        />
                        <div>
                            <span className="text-white font-medium">Allow Self Attempt</span>
                            <p className="text-sm text-gray-400">If checked, creators can attempt their own questions (points will count).</p>
                        </div>
                    </label>
                </div>
            )}
        </>
    );
};

export default BasicDetailsForm;
