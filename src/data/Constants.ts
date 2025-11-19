export const CommonTimeouts = {
    Short: 5000,
    Medium: 10000,
    MediumRefresh: 15000,
    Long: 30000,
    ExtraLong: 60000,
} as const;

export type TimeoutValue = (typeof CommonTimeouts)[keyof typeof CommonTimeouts];
