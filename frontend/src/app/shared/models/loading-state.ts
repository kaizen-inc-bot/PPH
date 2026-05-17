export interface UserDto {
    id: string;
    fullName: string;
    flatNumber: string;
    mobileNumber: string;
    verificationStatus: 'UNVERIFIED' | 'MOBILE_MATCHED' | 'APPROVED' | 'REJECTED' | 'DEACTIVATED';
    roles: string[];
    notificationPreferences: NotificationPreferencesDto;
}

export interface NotificationPreferencesDto {
    consentGiven: boolean;
    consentTimestamp: string | null;
}

export type LoadingState<T> =
    | { status: 'loading' }
    | { status: 'loaded'; data: T }
    | { status: 'error'; message: string };

export type AuthState =
    | { status: 'loading' }
    | { status: 'authenticated'; user: UserDto; token: string }
    | { status: 'unauthenticated' };

export interface NoticePollingState {
    status: 'loading' | 'loaded' | 'error';
    notices: NoticeDto[];
    consecutiveFailures: number;
}

export interface NoticeDto {
    id: string;
    title: string;
    body: string;
    category: string;
    isPinned: boolean;
    publishAt: string;
    expiresAt: string | null;
}
