import { NextResponse, NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  const url = new URL("/api/logger", request.url);
  const requestId = crypto.randomUUID();

  try {
    await fetch(url.toString(), {
      method: "POST",
      body: JSON.stringify({
        level: "info",
        requestId,
        request: {
          url: request.url,
          method: request.method,
          path: request.nextUrl.pathname,
          referrerPolicy: request.referrerPolicy,
          headers: Object.fromEntries(request.headers.entries()),
          cookies: request.cookies.getAll().reduce((acc, cookie) => {
            acc[cookie.name] = cookie.value;
            return acc;
          }, {} as Record<string, string>),
        },
      }),
    });
  } catch (error) {
    console.error("Error logging request:", error);
  }

  const response = NextResponse.next();
  response.headers.set("x-request-id", requestId);

  if (!isApiRoute) {
    response.cookies.set("x-request-id", requestId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax", // Changed from strict to lax for better cross-domain compatibility
      maxAge: 60,
      secure: request.url.startsWith("https"), // Only secure if on HTTPS
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/image|_next/static|api/logger|favicon.ico).*)"],
};
src/utils/manifestStatus.ts
/**
 * Utility functions for checking Farcaster manifest signing status
 */

interface AccountAssociation {
    header?: string
    payload?: string
    signature?: string
  }
  
  interface FarcasterConfig {
    accountAssociation?: AccountAssociation
    frame?: any
  }
  
  /**
   * Checks if the manifest is already signed by verifying accountAssociation fields
   */
  export const isManifestSigned = async (): Promise<boolean> => {
    try {
      const response = await fetch('/.well-known/farcaster.json')
      if (!response.ok) {
        return false
      }
  
      const config: FarcasterConfig = await response.json()
      
      // Check if accountAssociation exists and has all required fields
      const { accountAssociation } = config
      if (!accountAssociation) {
        return false
      }
  
      const { header, payload, signature } = accountAssociation
      return !!(header && payload && signature)
      
    } catch (error) {
      console.error('Error checking manifest status:', error)
      return false
    }
  }
  
  /**
   * Gets the current manifest signing status with detailed info
   */
  export const getManifestStatus = async (): Promise<{
    isSigned: boolean
    accountAssociation?: AccountAssociation
    error?: string
  }> => {
    try {
      const response = await fetch('/.well-known/farcaster.json')
      if (!response.ok) {
        return { 
          isSigned: false, 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }
      }
  
      const config: FarcasterConfig = await response.json()
      const { accountAssociation } = config
  
      if (!accountAssociation) {
        return { isSigned: false }
      }
  
      const { header, payload, signature } = accountAssociation
      const isSigned = !!(header && payload && signature)
  
      return {
        isSigned,
        accountAssociation: isSigned ? accountAssociation : undefined
      }
      
    } catch (error) {
      console.error('Error getting manifest status:', error)
      return { 
        isSigned: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }
  
  export type { AccountAssociation, FarcasterConfig }
