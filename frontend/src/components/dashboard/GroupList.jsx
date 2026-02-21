import Button from '../ui/Button';
import {
  GROUP_CARD_STYLES,
  GROUP_CARD_ACCENT_BAR,
  TAG_STYLES,
  EMPTY_STATE_STYLES,
  EMPTY_STATE_ICON_STYLES,
  EMPTY_STATE_TEXT_STYLES,
} from '../../constants/ui';

const GroupList = ({ groups, onJoin, onCreate, onNavigate }) => {
    if (groups.length === 0) {
        return (
            <div className={EMPTY_STATE_STYLES}>
                <div className={EMPTY_STATE_ICON_STYLES}>👥</div>
                <p className="font-['Syne',sans-serif] font-semibold text-[#f0f0f5] text-sm mb-2">No groups yet</p>
                <p className={EMPTY_STATE_TEXT_STYLES}>Join a group to start taking quizzes or create your own to challenge others.</p>
                <Button onClick={onCreate}>Create your first group</Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4">
            {groups.map((group, i) => (
                <div
                    key={group._id}
                    className={GROUP_CARD_STYLES}
                    style={{ animationDelay: `${i * 50}ms` }}
                    onClick={() => onNavigate(`/groups/${group._id}`)}
                >
                    {/* Green top accent bar (slides in on hover via group-hover) */}
                    <div className={GROUP_CARD_ACCENT_BAR} />

                    {/* Name */}
                    <h3 className="font-['Syne',sans-serif] font-bold text-lg text-[#f0f0f5] mb-1.5">
                        {group.name}
                    </h3>

                    {/* Description */}
                    <p className="text-[#6b6b80] text-[11px] mb-5 min-h-[16px] line-clamp-2">
                        {group.description || 'No description'}
                    </p>

                    {/* Footer row */}
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-[#6b6b80] flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            {group.members?.length ?? 0} members
                        </span>
                        <span className={TAG_STYLES}>{group.inviteCode}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default GroupList;
