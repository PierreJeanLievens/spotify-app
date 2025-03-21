import { NextResponse } from "next/server";
import Ably from "ably";

export async function GET() {
  const client = new Ably.Rest(process.env.ABLY_API_KEY!);

  // Crée un clientId unique basé sur un timestamp + random
  const userId = `${Math.random().toString(36).substring(2, 9)}`;

  const tokenRequest = await client.auth.createTokenRequest({
    clientId: userId,
  });

  console.log("Token généré pour:", userId); // Vérifie bien cet ID dans la console

  return NextResponse.json(tokenRequest);
}
