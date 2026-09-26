import { useCallback, useEffect, useMemo, useState } from 'react';
import { accessoryApi } from '../api/accessoryApi';
import type { Accessory, AccessoryCategory, Wardrobe, WornAccessories } from '../types';
import { ACCESSORY_SLOT } from '../view/accessoryLayout';

interface Options {
  token: string | null;
  childId: string | null;
  /** Báo XP mới lên trang pet sau khi mua */
  onXpBalance: (xp: number) => void;
}

/**
 * Tủ đồ phụ kiện: dữ liệu thật từ /api/pet/accessories.
 * "Mặc thử" chỉ đổi `preview` (state UI tạm, chưa gọi API) để pet đổi đồ ngay lập tức;
 * bấm "Mặc luôn" mới gọi API equip — lỗi thì bỏ preview (rollback) và báo lỗi.
 */
export function usePetWardrobe({ token, childId, onXpBalance }: Options) {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<Partial<Record<AccessoryCategory, string>>>({});
  /** id món đang gọi API → khoá nút của món đó */
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const apply = useCallback(
    (w: Wardrobe) => {
      setAccessories(w.accessories);
      onXpBalance(w.xpBalance);
    },
    [onXpBalance],
  );

  useEffect(() => {
    if (!token || !childId) return;
    let cancelled = false;
    setLoading(true);
    accessoryApi
      .list(token, childId)
      .then((w) => {
        if (!cancelled) apply(w);
      })
      .catch((err: Error) => {
        if (!cancelled) setNotice(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, childId, apply]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  const clearPreview = (category: AccessoryCategory) =>
    setPreview(({ [category]: _removed, ...rest }) => rest);

  const run = useCallback(
    async (acc: Accessory, call: (token: string, childId: string) => Promise<Wardrobe>, onError?: () => void) => {
      if (!token || !childId) return false;
      setBusyId(acc.id);
      try {
        apply(await call(token, childId));
        return true;
      } catch (err) {
        onError?.();
        setNotice(err instanceof Error ? err.message : 'Có lỗi xảy ra');
        return false;
      } finally {
        setBusyId(null);
      }
    },
    [token, childId, apply],
  );

  /** Mặc thử: mỗi vị trí đeo chỉ thử 1 món (thử vương miện thì bỏ mũ đang thử) */
  const tryOn = useCallback((acc: Accessory) => {
    setPreview((p) => {
      const next = { ...p };
      for (const c of Object.keys(next) as AccessoryCategory[]) {
        if (ACCESSORY_SLOT[c] === ACCESSORY_SLOT[acc.category]) delete next[c];
      }
      next[acc.category] = acc.id;
      return next;
    });
  }, []);

  const cancelTryOn = useCallback((category: AccessoryCategory) => clearPreview(category), []);

  const buy = useCallback(
    async (acc: Accessory) => {
      // mua xong cho mặc thử luôn để bé thấy ngay
      if (await run(acc, (t, id) => accessoryApi.buy(t, id, acc.id))) tryOn(acc);
    },
    [run, tryOn],
  );

  const equip = useCallback(
    async (acc: Accessory) => {
      await run(acc, (t, id) => accessoryApi.equip(t, id, acc.id), () => clearPreview(acc.category));
      clearPreview(acc.category);
    },
    [run],
  );

  const unequip = useCallback(
    (acc: Accessory) => run(acc, (t, id) => accessoryApi.unequip(t, id, acc.id)),
    [run],
  );

  /** Món đang hiện trên pet: mỗi vị trí đeo 1 món, ưu tiên món đang mặc thử, không thì món đã mặc */
  const worn = useMemo<WornAccessories>(() => {
    const bySlot = new Map<string, Accessory>();
    for (const a of accessories) if (a.isEquipped) bySlot.set(ACCESSORY_SLOT[a.category], a);
    for (const id of Object.values(preview)) {
      const a = accessories.find((x) => x.id === id);
      if (a) bySlot.set(ACCESSORY_SLOT[a.category], a);
    }
    const out: WornAccessories = {};
    for (const a of bySlot.values()) out[a.category] = a;
    return out;
  }, [accessories, preview]);

  const resetPreview = useCallback(() => setPreview({}), []);

  return { accessories, loading, preview, worn, busyId, notice, tryOn, cancelTryOn, resetPreview, buy, equip, unequip };
}
