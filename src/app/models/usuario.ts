export interface Usuario {
    id: string;
    email: string;
    banned_until?: Date;
    created_at: Date;
    confirmed_at?: Date;
    confirmation_send_at?: Date;
    is_anonymous: boolean;
    is_sso_user: boolean;
    invited_at?: Date;
    last_sign_in_at?: Date;
    phone?: number;
    updated_at: Date;
}
