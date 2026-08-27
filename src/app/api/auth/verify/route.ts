import { NextResponse, type NextRequest } from "next/server";
import {
  NONCE_COOKIE,
  SESSION_COOKIE,
  SESSION_TTL_S,
  encodeSession,
  normaliseChain,
  verifySignature,
  type Chain,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Check the wallet's signature over the issued nonce, then open a session. */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    address?: string;
    signature?: string;
    walletId?: string;
  };
  const { address, signature } = body;

  if (!address || !signature) {
    return NextResponse.json(
      { error: "address and signature required" },
      { status: 400 },
    );
  }

  const raw = req.cookies.get(NONCE_COOKIE)?.value;
  if (!raw) {
    return NextResponse.json(
      { error: "The sign-in took too long — start it again." },
      { status: 400 },
    );
  }

  let challenge: {
    nonce: string;
    issuedAt: string;
    address: string;
    chain: Chain;
    domain: string;
    uri: string;
  };
  try {
    challenge = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "malformed challenge" }, { status: 400 });
  }

  if (challenge.address !== address) {
    return NextResponse.json(
      { error: "address does not match the challenge" },
      { status: 400 },
    );
  }

  const chain = normaliseChain(challenge.chain);
  const ok = verifySignature({
    address,
    nonce: challenge.nonce,
    issuedAt: challenge.issuedAt,
    chain,
    domain: challenge.domain,
    uri: challenge.uri,
    signature,
  });
  if (!ok) {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  const res = NextResponse.json({
    address,
    chain,
    walletId: body.walletId ?? null,
  });

  res.cookies.set(SESSION_COOKIE, encodeSession(address, chain), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_S,
  });
  res.cookies.delete(NONCE_COOKIE);
  return res;
}
