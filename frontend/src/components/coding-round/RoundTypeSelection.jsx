const RoundTypeSelection = ({ roundType, setRoundType }) => {
    return (
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div 
                className="cursor-not-allowed p-4 rounded-xl border-2 border-gray-800 bg-gray-900/50 opacity-50"
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-500">
                        Self-Hosted (Piston)
                    </h3>
                    <span className="text-[10px] uppercase font-bold bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">
                        Coming Soon
                    </span>
                </div>
                <p className="text-sm text-gray-600">
                    Code runs on our server. Feature currently under development.
                </p>
            </div>

            <div 
                onClick={() => setRoundType('External')}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                    roundType === 'External' 
                        ? 'border-purple-500 bg-purple-900/20' 
                        : 'border-gray-700 hover:border-gray-600 bg-gray-800'
                }`}
            >
                <h3 className={`font-bold text-lg mb-2 ${roundType === 'External' ? 'text-purple-400' : 'text-gray-300'}`}>
                    External Platform & Timer
                </h3>
                <p className="text-sm text-gray-400">
                    Solve on LeetCode/CodeChef. Participants track time manually. collaborative question pool.
                </p>
            </div>
        </div>
    );
};

export default RoundTypeSelection;
