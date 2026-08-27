import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, decodeSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Who is signed in, if anyone. */
export async function GET(req: NextRequest) {
  const session = decodeSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) return NextResponse.json({ address: null });

  return NextResponse.json({
    address: session.address,
    chain: session.chain,
    issuedAt: session.issuedAt,
    expiresAt: session.expiresAt,
  });
}

/** Sign out. */
export async function DELETE() {
  const res = NextResponse.json({ address: null });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
