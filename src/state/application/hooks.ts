import type { AppState } from '..';
import { useAppSelector } from '../hooks';

export function useApplicationState(): AppState['application'] {
  return useAppSelector((state) => state.application);
}
