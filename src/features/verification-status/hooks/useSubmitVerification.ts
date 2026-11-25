import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hooks';
import {
  setSubmission,
  transitionTo,
} from '@/store/slices/kycWorkflowSlice';
import { submitVerification } from '../services/verificationSubmissionService';

export function useSubmitVerification() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: submitVerification,
    onSuccess: (result) => {
      dispatch(
        setSubmission({
          reference: result.reference,
          submittedAt: result.submittedAt,
        }),
      );

      dispatch(transitionTo('complete'));
    },
  });
}