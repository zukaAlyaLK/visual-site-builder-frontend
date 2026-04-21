import type { Member } from '../../types';

interface Props {
  members: Member[];
}

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];

export function AvatarList({ members }: Props) {
  const safeMembers = Array.isArray(members) ? members : [];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: -8 }}>
      {safeMembers.map((m, i) => {
        const color = m.color || COLORS[i % COLORS.length];
        const initials = m.name
          .split(' ')
          .map((p) => p[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        return (
          <div
            key={m.userId}
            title={`${m.name} (${m.role})`}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: color,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'bold',
              border: '2px solid #fff',
              marginLeft: i > 0 ? -8 : 0,
              cursor: 'default',
              position: 'relative',
              zIndex: members.length - i,
            }}
          >
            {initials}
          </div>
        );
      })}
    </div>
  );
}
