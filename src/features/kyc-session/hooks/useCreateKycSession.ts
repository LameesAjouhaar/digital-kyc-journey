import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import {
  sessionCreated,
  setWorkflowError,
} from '@/store/slices/kycWorkflowSlice';
import { createKycSession } from '../services/kycSessionService';

export function useCreateKycSession() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: createKycSession,

    onSuccess: (response) => {
      dispatch(
        sessionCreated({
          id: response.session.id,
          expiresAt: response.session.expiresAt,
        }),
      );
    },

    onError: () => {
      dispatch(
        setWorkflowError(
          'Unable to start verification. Please try again.',
        ),
      );
    },
  });
}