import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.get("session_id")) {
    const sessionId = crypto.randomUUID();
    response.cookies.set("session_id", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/match"],
};
