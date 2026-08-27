import { NextResponse, type NextRequest } from "next/server";
import {
  NONCE_COOKIE,
  NONCE_TTL_S,
  buildMessage,
  newNonce,
  normaliseChain,
  requestOrigin,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Issue a nonce and the exact statement the wallet should sign. */
export async function POST(req: NextRequest) {
  const { address, chain } = (await req.json().catch(() => ({}))) as {
    address?: string;
    chain?: string;
  };
  if (!address || typeof address !== "string" || address.length > 64) {
    return NextResponse.json({ error: "address required" }, { status: 400 });
  }

  const nonce = newNonce();
  const issuedAt = new Date().toISOString();
  const resolvedChain = normaliseChain(chain);
  const { domain, uri } = requestOrigin(req);
  const message = buildMessage({
    address,
    nonce,
    issuedAt,
    chain: resolvedChain,
    domain,
    uri,
  });

  const res = NextResponse.json({ nonce, issuedAt, message });
  res.cookies.set(
    NONCE_COOKIE,
    JSON.stringify({
      nonce,
      issuedAt,
      address,
      chain: resolvedChain,
      domain,
      uri,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: NONCE_TTL_S,
    },
  );
  return res;
}
