import { useEffect, useState } from 'react';
import { getProject, getMembers, updateProject, inviteMember, removeMember } from '../../api/projects.api';
import { useAuthStore } from '../../store/auth.store';
import { X, UserPlus, Trash2, Shield, Users } from 'lucide-react';
import type { Member, Project } from '../../types';

interface Props {
  projectId: string;
  onClose: () => void;
  onUpdate: () => void;
}

export function ProjectSettingsModal({ projectId, onClose, onUpdate }: Props) {
  const { user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState('');

  const loadData = async () => {
    try {
      const [projData, membersData] = await Promise.all([
        getProject(projectId),
        getMembers(projectId),
      ]);
      setProject(projData);
      setMembers(membersData);
      setName(projData.name);
      setDescription(projData.description || '');
    } catch (err) {
      console.error('Failed to load project settings data', err);
      setError('Не удалось загрузить данные настроек');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [projectId]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaveLoading(true);
    setError('');
    try {
      await updateProject(projectId, { name, description });
      onUpdate();
      onClose();
    } catch (err) {
      setError('Не удалось обновить настройки проекта');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteLoading(true);
    setError('');
    setInviteSuccess('');
    try {
      await inviteMember(projectId, inviteEmail);
      setInviteSuccess(`Пользователь ${inviteEmail} успешно приглашен`);
      setInviteEmail('');
      // Reload members list
      const updatedMembers = await getMembers(projectId);
      setMembers(updatedMembers);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Не удалось отправить приглашение');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого участника из проекта?')) return;
    try {
      await removeMember(projectId, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err) {
      alert('Не удалось удалить участника');
    }
  };

  if (loading) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
            Загрузка настроек...
          </div>
        </div>
      </div>
    );
  }

  const isOwner = project?.role === 'OWNER';

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={20} color="#6366f1" />
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
              Настройки проекта
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 4,
              borderRadius: 6,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Tabs/Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxHeight: '70vh', overflowY: 'auto', paddingRight: 4 }}>
          
          {/* Main Info Settings */}
          <div>
            <h4 style={sectionTitleStyle}>Основная информация</h4>
            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Название проекта</label>
                <input
                  type="text"
                  required
                  disabled={!isOwner}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  placeholder="Название проекта"
                />
              </div>
              <div>
                <label style={labelStyle}>Описание</label>
                <textarea
                  disabled={!isOwner}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="Краткое описание проекта"
                />
              </div>

              {isOwner && (
                <button
                  type="submit"
                  disabled={saveLoading || !name.trim()}
                  style={{
                    alignSelf: 'flex-start',
                    background: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#4f46e5')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#6366f1')}
                >
                  {saveLoading ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
              )}
            </form>
          </div>

          <div style={{ height: 1, background: '#e2e8f0' }} />

          {/* Members Management */}
          <div>
            <h4 style={sectionTitleStyle}>Участники проекта</h4>
            
            {/* Invite Form */}
            {isOwner && (
              <form onSubmit={handleInvite} style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="email.co-worker@example.com"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button
                  type="submit"
                  disabled={inviteLoading || !inviteEmail.trim()}
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0 16px',
                    fontSize: 13,
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <UserPlus size={16} />
                  <span>{inviteLoading ? 'Отправка...' : 'Пригласить'}</span>
                </button>
              </form>
            )}

            {inviteSuccess && <p style={{ color: '#10b981', fontSize: 12, margin: '0 0 10px' }}>{inviteSuccess}</p>}
            {error && <p style={{ color: '#ef4444', fontSize: 12, margin: '0 0 10px' }}>{error}</p>}

            {/* Members List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {members.map((member) => {
                const isMemberOwner = member.role === 'OWNER';
                const isCurrentUser = member.userId === user?.id;

                return (
                  <div
                    key={member.userId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      borderRadius: 10,
                      padding: '10px 14px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: isMemberOwner ? '#e0e7ff' : '#f1f5f9',
                          color: isMemberOwner ? '#4f46e5' : '#475569',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                          fontWeight: 600,
                          border: member.color ? `2px solid ${member.color}` : undefined,
                        }}
                      >
                        {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1e293b' }}>
                          {member.name} {isCurrentUser && <span style={{ color: '#94a3b8', fontWeight: 'normal' }}>(вы)</span>}
                        </span>
                        <span style={{ fontSize: 11, color: '#64748b' }}>{member.email}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 11,
                          fontWeight: 600,
                          color: isMemberOwner ? '#4f46e5' : '#64748b',
                          background: isMemberOwner ? '#eef2ff' : '#f1f5f9',
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}
                      >
                        {isMemberOwner && <Shield size={12} />}
                        {isMemberOwner ? 'Владелец' : 'Редактор'}
                      </span>

                      {isOwner && !isMemberOwner && (
                        <button
                          onClick={() => handleRemoveMember(member.userId)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: 4,
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#ef4444';
                            e.currentTarget.style.background = '#fef2f2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#94a3b8';
                            e.currentTarget.style.background = 'transparent';
                          }}
                          title="Исключить из проекта"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '1px solid #e2e8f0',
            paddingTop: 16,
            marginTop: 20,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: 8,
              padding: '8px 20px',
              fontSize: 13,
              fontWeight: 600,
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15, 23, 42, 0.4)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  padding: 24,
  width: '100%',
  maxWidth: 520,
  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
};

const sectionTitleStyle: React.CSSProperties = {
  margin: '0 0 14px',
  fontSize: 13,
  fontWeight: 700,
  color: '#64748b',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 600,
  color: '#475569',
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
};
