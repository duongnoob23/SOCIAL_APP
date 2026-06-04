export interface InstagramUser {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  timestamp: string;
  permalink: string;
  selected: boolean;
  selectionOrder?: number;
  width?: number;
  height?: number;
}

export interface InstagramAuthSession {
  accessToken: string;
  userId: string;
  expiresIn: number;
}

export interface UseInstagramReturn {
  isLoading: boolean;
  media: InstagramMediaItem[];
  showWebView: boolean;
  selectedCount: number;
  onSelectInstagram: () => void;
  toggleSelection: (mediaId: string) => void;
  getSelectedAssets: () => InstagramMediaAsset[];
  closeWebView: () => void;
  handleWebViewImages: (imageUrls: string[]) => void;
  requestMoreImages: () => void;
  shouldScrollForMore: boolean;
}

export interface InstagramMediaAsset extends InstagramMediaItem {
  filename: string;
  width?: number;
  height?: number;
  creationDate?: Date;
  monthYearKey?: string;
}
