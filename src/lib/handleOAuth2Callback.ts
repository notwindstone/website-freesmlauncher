"use server";

import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function handleCallback({
    request,
    provider,
    fetchUserProfile,
}: {
    request: NextRequest;
    provider: {
        validateAuthorizationCode: (code: string) => Promise<{
            accessToken: () => string;
        }>;
    };
    fetchUserProfile: (accessToken: string) => Promise<Response>;
}): Promise<string> {
    let tokens;
    let accessToken;

    const cookieStore = await cookies();
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const storedState = cookieStore.get('state')?.value;
    const errorUrl = "/oauth2/others";

    if (storedState === undefined) {
        return "/oauth2/different-browser";
    }

    if (code === null || state === null || state !== storedState) {
        return errorUrl;
    }

    try {
        tokens = await provider.validateAuthorizationCode(code);
        accessToken = tokens.accessToken();
    } catch (e) {
        console.error(e);

        return errorUrl;
    }

    const response = await fetchUserProfile(accessToken);

    let user: {
        id: string;
        login: string;
        avatar_url: string;
        email: string;
    };

    try {
        user = await response.json();
    } catch (e) {
        console.error(e);

        return errorUrl;
    }

    if (!user) {
        return errorUrl;
    }

    cookieStore.set("accessTokenGithub", accessToken, {
        secure: process.env.NODE_ENV === "production",
        path: "/",
        httpOnly: true,
        // 30 days
        maxAge: 30 * 24 * 60 * 60,
    });

    return "/session";
}