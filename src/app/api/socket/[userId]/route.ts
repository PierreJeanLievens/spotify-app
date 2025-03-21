import { NextResponse } from "next/server";
import Ably from "ably";

export async function GET(
    req: Request,
    { params} : { params: Promise<{ userId : string}>}
  ) {
  const client = new Ably.Rest(process.env.ABLY_API_KEY!);

  const { userId } = await params;

  const tokenRequest = await client.auth.createTokenRequest({
    clientId: userId,
  });

  console.log("Token généré pour:", userId); // Vérifie bien cet ID dans la console

  return NextResponse.json(tokenRequest);
}
