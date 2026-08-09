import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as walletApi from '../api/walletApi';
import * as petApi from '../api/petApi';
import * as rewardApi from '../api/rewardApi';
import * as paymentApi from '../api/paymentApi';
import * as certificateApi from '../api/certificateApi';

// WALLET
export const useWallet = (childId: string) => {
  return useQuery({
    queryKey: ['wallet', childId],
    queryFn: () => walletApi.getWallet(childId),
    enabled: !!childId,
  });
};

export const useWalletHistory = (
  childId: string,
  limit = 20,
  cursor?: string,
) => {
  return useQuery({
    queryKey: ['walletHistory', childId, limit, cursor],
    queryFn: () => walletApi.getWalletHistory(childId, limit, cursor),
    enabled: !!childId,
  });
};

// PET
export const usePet = (childId: string) => {
  return useQuery({
    queryKey: ['pet', childId],
    queryFn: () => petApi.getPet(childId),
    enabled: !!childId,
  });
};

export const useFeedPet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (childId: string) => petApi.feedPet(childId),
    onSuccess: (_, childId) => {
      queryClient.invalidateQueries({ queryKey: ['pet', childId] });
      queryClient.invalidateQueries({ queryKey: ['wallet', childId] });
    },
  });
};

// REWARD
export const useRewards = () => {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: () => rewardApi.getRewards(),
  });
};

export const useCreateReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<rewardApi.Reward>) =>
      rewardApi.createReward(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });
};

export const useUpdateReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<rewardApi.Reward>;
    }) => rewardApi.updateReward(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });
};

export const useDeleteReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rewardApi.deleteReward(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rewards'] });
    },
  });
};

export const useRedemptions = (status?: string) => {
  return useQuery({
    queryKey: ['redemptions', status],
    queryFn: () => rewardApi.getRedemptions(status),
  });
};

export const useRedeemReward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rewardId: string) => rewardApi.redeemReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redemptions'] });
    },
  });
};

export const useApproveRedemption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      redemptionId,
      approved,
    }: {
      redemptionId: string;
      approved: boolean;
    }) => rewardApi.approveRedemption(redemptionId, approved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['redemptions'] });
    },
  });
};

// PAYMENT
export const usePlans = () => {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => paymentApi.getPlans(),
  });
};

export const useMySubscriptions = () => {
  return useQuery({
    queryKey: ['mySubscriptions'],
    queryFn: () => paymentApi.getMySubscriptions(),
  });
};

export const useSubscribe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      planId,
      idempotencyKey,
    }: {
      planId: string;
      idempotencyKey: string;
    }) => paymentApi.subscribe(planId, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => paymentApi.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mySubscriptions'] });
    },
  });
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: () => paymentApi.getTransactions(),
  });
};

// CERTIFICATE
export const useCertificates = (childId: string) => {
  return useQuery({
    queryKey: ['certificates', childId],
    queryFn: () => certificateApi.getCertificates(childId),
    enabled: !!childId,
  });
};
