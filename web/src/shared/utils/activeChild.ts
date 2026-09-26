// Bé đang dùng app ở chế độ "Bé" — lưu lại sau khi nhập đúng PIN ở ChildLoginPage.
// Token vẫn là của phụ huynh, nên các API theo bé (pet, ví...) cần gửi kèm childId này.
const ACTIVE_CHILD_KEY = 'kl_active_child_id';

export function getActiveChildId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_CHILD_KEY);
  } catch {
    return null;
  }
}

export function setActiveChildId(childId: string): void {
  try {
    localStorage.setItem(ACTIVE_CHILD_KEY, childId);
  } catch {
    // bỏ qua (trình duyệt chặn storage)
  }
}

/** Chọn bé từ danh sách /api/children: ưu tiên bé đã đăng nhập PIN, không có thì lấy bé đầu tiên. */
export function pickActiveChild<T extends { _id: string }>(children: T[]): T | null {
  const id = getActiveChildId();
  return children.find((c) => c._id === id) ?? children[0] ?? null;
}
