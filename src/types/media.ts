import type { StoryMonth, StoryYear } from '@/features/story/types/story';
import type { Asset } from 'expo-media-library';

export interface MediaAsset extends Asset {
  selected?: boolean;
  selectionOrder?: number;
  creationDate?: Date;
  monthYearKey?: string;
}

export interface StoryFailedUploads {
  type: 'failed_uploads';
  monthDate: string;
  count: number;
  uploads: Array<{
    uri: string;
    filename: string;
    originalAsset: MediaAsset;
    fileSize?: number;
    monthDate: string;
    userId: number;
  }>;
}

export type StoryItem = StoryMonth | StoryYear | StoryFailedUploads;
