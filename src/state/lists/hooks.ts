import type { AppState } from '..';
import { useAppSelector } from '../hooks';

export function useAllLists(): AppState['lists']['byUrl'] {
  return useAppSelector((state) => state.lists.byUrl);
}
