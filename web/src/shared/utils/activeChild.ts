// Bé đang được chọn: bé đăng nhập PIN (chế độ Bé) hoặc bé phụ huynh chọn ở ChildPicker.
// Token vẫn là của phụ huynh, nên các API theo bé (pet, báo cáo...) cần gửi kèm childId này.
const ACTIVE_CHILD_KEY = 'kl_active_child_id';

/** Phát khi đổi bé → useActiveChild ở mọi trang tự cập nhật */
export const ACTIVE_CHILD_EVENT = 'kidlife_active_child_change';

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
  window.dispatchEvent(new CustomEvent<string>(ACTIVE_CHILD_EVENT, { detail: childId }));
}

/** Chọn bé từ danh sách /api/children: ưu tiên bé đang chọn, không có thì lấy bé đầu tiên. */
export function pickActiveChild<T extends { _id: string }>(children: T[]): T | null {
  const id = getActiveChildId();
  return children.find((c) => c._id === id) ?? children[0] ?? null;
}
