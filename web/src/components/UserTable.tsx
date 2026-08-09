import type { UserProfile } from '../api/userApi';
import StatusToggle from './StatusToggle';
import ApproveExpertButton from './ApproveExpertButton';

interface UserTableProps {
  users: UserProfile[];
  onStatusChange: (userId: string, newStatus: 'ACTIVE' | 'LOCKED') => void;
  onApproveExpert: (userId: string, action: 'APPROVE' | 'REJECT') => void;
}

export default function UserTable({ users, onStatusChange, onApproveExpert }: UserTableProps) {
  if (users.length === 0) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Không tìm thấy người dùng nào</div>;
  }

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Người dùng</th>
            <th>Vai trò</th>
            <th>Ngày tạo</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="avatar" style={{ width: 36, height: 36, fontSize: 14 }}>
                    {user.avatarUrl ? <img src={user.avatarUrl} alt="" style={{ width: '100%', borderRadius: '50%' }}/> : user.fullName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text)' }}>{user.fullName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
                  </div>
                </div>
              </td>
              <td>
                <span className={`badge badge-${user.role.toLowerCase()}`}>
                  {user.role === 'PARENT' ? 'Phụ huynh' : user.role === 'CHILD' ? 'Trẻ em' : user.role === 'EXPERT' ? 'Chuyên gia' : 'Quản trị'}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString('vi-VN')}</td>
              <td>
                <span className={`badge badge-${user.status.toLowerCase()}`}>
                  {user.status === 'ACTIVE' ? 'Hoạt động' : user.status === 'LOCKED' ? 'Bị khóa' : 'Chờ duyệt'}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: 10 }}>
                  {user.role !== 'ADMIN' && (
                    <StatusToggle 
                      isActive={user.status === 'ACTIVE'} 
                      isPending={user.status === 'PENDING'}
                      onChange={(active) => onStatusChange(user._id, active ? 'ACTIVE' : 'LOCKED')}
                    />
                  )}
                  {user.role === 'EXPERT' && user.status === 'PENDING' && (
                    <ApproveExpertButton onAction={(action) => onApproveExpert(user._id, action)} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
