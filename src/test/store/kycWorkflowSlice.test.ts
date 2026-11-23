
import { describe, expect, it } from 'vitest';

import reducer, {
  resetWorkflow,
  setWorkflowError,
  sessionCreated,
  transitionTo,
} from '@/store/slices/kycWorkflowSlice';

describe('kycWorkflowSlice', () => {
  it('initialises the workflow in the idle state', () => {
    const state = reducer(undefined, { type: 'unknown' });

    expect(state.currentStep).toBe('idle');
    expect(state.previousStep).toBeNull();
    expect(state.errorMessage).toBeNull();
    expect(state.sessionId).toBeNull();
  });

  it('allows a valid workflow transition', () => {
    const initialState = reducer(undefined, { type: 'unknown' });

    const nextState = reducer(
      initialState,
      transitionTo('device-selection'),
    );

    expect(nextState.currentStep).toBe('device-selection');
    expect(nextState.previousStep).toBe('idle');
  });

  it('rejects an invalid workflow transition', () => {
    const initialState = reducer(undefined, { type: 'unknown' });

    const nextState = reducer(
      initialState,
      transitionTo('face-match'),
    );

    expect(nextState.currentStep).toBe('idle');
  });

  it('records workflow errors', () => {
    const initialState = reducer(undefined, { type: 'unknown' });

    const nextState = reducer(
      initialState,
      setWorkflowError('Document upload failed'),
    );

    expect(nextState.currentStep).toBe('error');
    expect(nextState.previousStep).toBe('idle');
    expect(nextState.errorMessage).toBe('Document upload failed');
  });

  it('resets the workflow', () => {
    const errorState = reducer(
      undefined,
      setWorkflowError('Something went wrong'),
    );

    const resetState = reducer(errorState, resetWorkflow());

    expect(resetState.currentStep).toBe('idle');
    expect(resetState.previousStep).toBeNull();
    expect(resetState.errorMessage).toBeNull();
    expect(resetState.sessionId).toBeNull();
  });

  it('stores the session ID and advances to device selection', () => {
  const state = reducer(undefined, sessionCreated('session-123'));

  expect(state.sessionId).toBe('session-123');
  expect(state.currentStep).toBe('device-selection');
  expect(state.previousStep).toBe('idle');
});

it('does not create a session outside the idle state', () => {
  const initialState = reducer(
    undefined,
    transitionTo('device-selection'),
  );

  const state = reducer(initialState, sessionCreated('session-123'));

  expect(state.sessionId).toBeNull();
  expect(state.currentStep).toBe('device-selection');
});

it('allows a new session after a previous session creation failure', () => {
  const errorState = reducer(
    undefined,
    setWorkflowError('Unable to start verification'),
  );

  const state = reducer(errorState, sessionCreated('session-456'));

  expect(state.sessionId).toBe('session-456');
  expect(state.currentStep).toBe('device-selection');
  expect(state.errorMessage).toBeNull();
});
});
