import { useState } from 'react';
import axios from '../api/axios';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { INPUT_BASE_STYLES, INPUT_LABEL_STYLES, INPUT_ERROR_MESSAGE_STYLES } from '../constants/ui';

const CreateGroupModal = ({ isOpen, onClose, onGroupCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/groups', { name, description });
            onGroupCreated();
            onClose();
            setName('');
            setDescription('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create New Group"
            subtitle="Set up a group to start running quizzes"
            footer={
                <>
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" loading={loading} onClick={handleSubmit}>
                        {loading ? 'Creating...' : 'Create Group'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="px-3 py-2 bg-[#ff5555]/10 border border-[#ff5555]/20 rounded-lg text-xs text-[#ff5555] font-mono">
                        {error}
                    </div>
                )}
                <div>
                    <label className={INPUT_LABEL_STYLES}>Group Name</label>
                    <input
                        type="text"
                        className={INPUT_BASE_STYLES}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Backend Ninjas"
                        required
                    />
                </div>
                <div>
                    <label className={INPUT_LABEL_STYLES}>Description <span className="text-[#6b6b80]/60 normal-case tracking-normal">(optional)</span></label>
                    <textarea
                        className={`${INPUT_BASE_STYLES} resize-none h-20`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What's this group about?"
                    />
                </div>
            </form>
        </Modal>
    );
};

export default CreateGroupModal;
