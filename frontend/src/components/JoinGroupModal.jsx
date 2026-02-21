import { useState } from 'react';
import axios from '../api/axios';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { INPUT_BASE_STYLES, INPUT_LABEL_STYLES } from '../constants/ui';

const JoinGroupModal = ({ isOpen, onClose, onGroupJoined }) => {
    const [inviteCode, setInviteCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('/api/groups/join', { inviteCode });
            onGroupJoined();
            onClose();
            setInviteCode('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join group');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Join a Group"
            subtitle="Enter the invite code shared by a group admin"
            footer={
                <>
                    <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                    <Button variant="primary" loading={loading} onClick={handleSubmit}>
                        {loading ? 'Joining...' : 'Join Group'}
                    </Button>
                </>
            }
        >
            <form onSubmit={handleSubmit}>
                {error && (
                    <div className="px-3 py-2 bg-[#ff5555]/10 border border-[#ff5555]/20 rounded-lg text-xs text-[#ff5555] font-mono mb-4">
                        {error}
                    </div>
                )}
                <div>
                    <label className={INPUT_LABEL_STYLES}>Invite Code</label>
                    <input
                        type="text"
                        className={`${INPUT_BASE_STYLES} uppercase tracking-[6px] text-center text-base`}
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        placeholder="XXXXXX"
                        maxLength={8}
                        required
                    />
                </div>
            </form>
        </Modal>
    );
};

export default JoinGroupModal;
