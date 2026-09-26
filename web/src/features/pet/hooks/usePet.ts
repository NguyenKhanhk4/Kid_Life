import { useCallback, useEffect, useState } from 'react';
import { useActiveChild } from '@/hooks/useActiveChild';
import { PetApiError, petApi } from '../api/petApi';
import type { FeedResult, Pet, PetConfig } from '../types';

/** Các màn khác (sidebar, trang chủ bé) nghe event này để cập nhật pet ngay sau khi cho ăn. */
export const PET_UPDATE_EVENT = 'kidlife_pet_update';

export interface PetUpdateDetail {
  childId: string;
  pet: Pet | null;
}

export function broadcastPet(childId: string, pet: Pet | null) {
  window.dispatchEvent(new CustomEvent<PetUpdateDetail>(PET_UPDATE_EVENT, { detail: { childId, pet } }));
}

function messageOf(err: unknown): string {
  return err instanceof Error ? err.message : 'Có lỗi xảy ra';
}

/**
 * Cầu nối giữa backend (/api/pet) và lớp hiển thị: giữ state Pet của bé đang dùng app.
 * Mọi quy tắc (EXP, lượt ăn/ngày, trừ XP, streak) do server tính — hook chỉ gọi API và lưu kết quả.
 */
export function usePet() {
  const { child, status: childStatus, token } = useActiveChild();
  const childId = child?._id ?? null;

  const [pet, setPet] = useState<Pet | null>(null);
  const [xpBalance, setXpBalance] = useState(0);
  const [config, setConfig] = useState<PetConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  /** Lỗi thao tác (cho ăn, chọn loài...) — hiện 1 lúc rồi tự ẩn */
  const [notice, setNotice] = useState<string | null>(null);
  const [lastFeed, setLastFeed] = useState<FeedResult | null>(null);

  const applyPet = useCallback(
    (next: Pet | null) => {
      setPet(next);
      if (childId) broadcastPet(childId, next);
    },
    [childId],
  );

  const reload = useCallback(async (silent = false) => {
    if (!token || !childId) return;
    if (!silent) setLoading(true);
    setLoadError(null);
    try {
      const [data, cfg] = await Promise.all([petApi.getPet(token, childId), petApi.getConfig(token)]);
      setPet(data.pet);
      setXpBalance(data.xpBalance);
      setConfig(cfg);
    } catch (err) {
      setLoadError(messageOf(err));
    } finally {
      setLoading(false);
    }
  }, [token, childId]);

  useEffect(() => {
    if (childStatus === 'loading') return;
    if (childStatus !== 'ready') {
      setLoading(false);
      return;
    }
    void reload();
  }, [childStatus, reload]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(t);
  }, [notice]);

  /** Chạy 1 thao tác API; lỗi → hiện notice (và tải lại khi dữ liệu có thể đã lệch). */
  const run = useCallback(
    async (action: (token: string, childId: string) => Promise<void>) => {
      if (!token || !childId) return;
      try {
        await action(token, childId);
      } catch (err) {
        setNotice(messageOf(err));
        if (err instanceof PetApiError && ['CONFLICT', 'PET_FULL', 'PET_NOT_FOUND', 'PET_EXISTS'].includes(err.code)) {
          void reload(true);
        }
      }
    },
    [token, childId, reload],
  );

  const selectSpecies = useCallback(
    (speciesId: string) => run(async (t, id) => applyPet(await petApi.createPet(t, id, speciesId))),
    [run, applyPet],
  );

  const feedPet = useCallback(
    () =>
      run(async (t, id) => {
        const { pet: next, result } = await petApi.feed(t, id);
        applyPet(next);
        setXpBalance(result.xpBalance);
        setLastFeed(result);
      }),
    [run, applyPet],
  );

  const tapPet = useCallback(() => {
    // tap chỉ để view chạy animation, không đổi dữ liệu
  }, []);

  return {
    child,
    childStatus,
    pet,
    xpBalance,
    config,
    loading: childStatus === 'loading' || loading,
    loadError,
    notice,
    lastFeed,
    reload,
    selectSpecies,
    feedPet,
    tapPet,
    /** Cho tủ đồ dùng chung token/XP với trang pet */
    token,
    setXpBalance,
  };
}

/** Bản gọn cho sidebar/trang chủ bé: chỉ đọc pet + nghe cập nhật từ trang Thú cưng. */
export function usePetSummary() {
  const { child, status, token } = useActiveChild();
  const childId = child?._id ?? null;
  const [pet, setPet] = useState<Pet | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!token || !childId) return;
    let cancelled = false;
    petApi
      .getPet(token, childId)
      .then((data) => {
        if (!cancelled) setPet(data.pet);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token, childId]);

  useEffect(() => {
    const onUpdate = (e: Event) => {
      const { detail } = e as CustomEvent<PetUpdateDetail>;
      if (detail.childId === childId) setPet(detail.pet);
    };
    window.addEventListener(PET_UPDATE_EVENT, onUpdate);
    return () => window.removeEventListener(PET_UPDATE_EVENT, onUpdate);
  }, [childId]);

  return { child, childStatus: status, pet, loaded: loaded || (status !== 'loading' && status !== 'ready') };
}
