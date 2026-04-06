// Re-export all canteiro hooks from new modular location for backwards compatibility
export type { CollectiveBed, CollectiveBedEntry, CanteiroEntry, EntryType, ReactionType } from './canteiro/types';
export { useActiveCanteiro } from './canteiro/useActiveCanteiro';
export { useCanteiroEntries, useCanteiroPublicEntries, useArchivedCanteiros } from './canteiro/useCanteiroEntries';
export { useCanteiroReactions, useToggleReaction } from './canteiro/useCanteiroReactions';
export { useSubmitPartilha } from './canteiro/useSubmitPartilha';
