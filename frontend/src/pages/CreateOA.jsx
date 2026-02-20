import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../api/axios';
import Layout from '../components/ui/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const defaultSection = () => ({
    name: '',
    topics: '',
    difficulty: 'Medium',
    questionCount: 20,
    timeLimit: 20
});

const CreateOA = () => {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [sections, setSections] = useState([defaultSection()]);
    const [loading, setLoading] = useState(false);

    const updateSection = (idx, field, value) => {
        setSections(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
    };

    const addSection = () => setSections(prev => [...prev, defaultSection()]);
    const removeSection = (idx) => setSections(prev => prev.filter((_, i) => i !== idx));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return toast.error('Assessment title is required');
        for (const [i, s] of sections.entries()) {
            if (!s.name.trim()) return toast.error(`Section ${i + 1}: name is required`);
            if (!s.topics.trim()) return toast.error(`Section ${i + 1}: topics are required`);
        }

        setLoading(true);
        const toastId = toast.loading(`Generating questions for ${sections.length} section${sections.length > 1 ? 's' : ''} with AI…`);
        try {
            await axios.post('/api/online-assessments/generate-and-create', {
                title,
                groupId,
                sections: sections.map(s => ({
                    ...s,
                    questionCount: Number(s.questionCount),
                    timeLimit: Number(s.timeLimit)
                }))
            });
            toast.success('Assessment created!', { id: toastId });
            window.dispatchEvent(new Event('group-content-updated'));
            navigate(`/groups/${groupId}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create assessment', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-violet-500/30">
                        <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Online Assessment</h1>
                    <p className="text-gray-400">AI will generate MCQ questions for each section you define.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <Input
                            label="Assessment Title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Campus Recruitment OA 2024"
                            required
                        />
                    </Card>

                    {sections.map((section, idx) => (
                        <Card key={idx} className="border-violet-500/20 relative">
                            <div className="flex justify-between items-center mb-5">
                                <h2 className="text-lg font-semibold text-violet-300 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-violet-900/50 border border-violet-500/40 flex items-center justify-center text-sm font-bold text-violet-300">
                                        {idx + 1}
                                    </span>
                                    Section {idx + 1}
                                </h2>
                                {sections.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSection(idx)}
                                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                        title="Remove section"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                <Input
                                    label="Section Name"
                                    value={section.name}
                                    onChange={e => updateSection(idx, 'name', e.target.value)}
                                    placeholder="e.g. Coding MCQ, Aptitude"
                                    required
                                />

                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Topics to Cover</label>
                                    <textarea
                                        className="w-full p-3 rounded-xl bg-gray-900/50 text-white border border-gray-700/50 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                                        rows={3}
                                        value={section.topics}
                                        onChange={e => updateSection(idx, 'topics', e.target.value)}
                                        placeholder="e.g. SQL, Pseudo Code, Output guessing, DBMS, C++ concepts..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 mb-2 font-medium">Difficulty</label>
                                    <div className="flex gap-2">
                                        {['Easy', 'Medium', 'Hard'].map(d => (
                                            <button
                                                key={d}
                                                type="button"
                                                onClick={() => updateSection(idx, 'difficulty', d)}
                                                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                                                    section.difficulty === d
                                                        ? d === 'Easy'
                                                            ? 'bg-green-900/40 border-green-500 text-green-300'
                                                            : d === 'Medium'
                                                                ? 'bg-amber-900/40 border-amber-500 text-amber-300'
                                                            : 'bg-red-900/40 border-red-500 text-red-300'
                                                        : 'bg-gray-800 border-gray-700 text-gray-500 hover:border-gray-500'
                                                }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">
                                            Questions: <span className="text-violet-400 font-bold">{section.questionCount}</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="5"
                                            max="50"
                                            step="5"
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                            value={section.questionCount}
                                            onChange={e => updateSection(idx, 'questionCount', e.target.value)}
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>5</span><span>50</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 mb-2 font-medium">
                                            Time Limit: <span className="text-violet-400 font-bold">{section.timeLimit} min</span>
                                        </label>
                                        <input
                                            type="range"
                                            min="5"
                                            max="120"
                                            step="5"
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                            value={section.timeLimit}
                                            onChange={e => updateSection(idx, 'timeLimit', e.target.value)}
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>5 min</span><span>120 min</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}

                    <button
                        type="button"
                        onClick={addSection}
                        className="w-full py-3 border-2 border-dashed border-violet-500/30 rounded-xl text-violet-400 hover:border-violet-500/60 hover:bg-violet-500/5 transition-all flex items-center justify-center gap-2 font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Section
                    </button>

                    <div className="flex justify-between items-center pt-2">
                        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button type="submit" loading={loading} className="px-8 bg-violet-600 hover:bg-violet-700 border-violet-600">
                            Generate Assessment
                        </Button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreateOA;
