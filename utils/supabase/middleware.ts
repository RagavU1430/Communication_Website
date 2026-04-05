import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect users who are not logged in and not on login page
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user exists, check for MFA
  if (user) {
    const { data: aal, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    
    // If the user has a verified factor but only used AAL1 (password) to sign in,
    // they need to complete AAL2 (MFA).
    if (aal?.nextLevel === 'aal2' && aal?.currentLevel === 'aal1') {
      // Allow access to the verify page, but redirect everything else to verify
      if (!request.nextUrl.pathname.startsWith('/verify')) {
        const url = request.nextUrl.clone();
        url.pathname = '/verify';
        return NextResponse.redirect(url);
      }
    } else {
      // If they are fully authenticated (or don't have MFA), don't let them on the verify page or login page
      // Exception: allow going to /dashboard or other pages.
      if (request.nextUrl.pathname.startsWith('/verify') || request.nextUrl.pathname.startsWith('/login')) {
         const url = request.nextUrl.clone();
         url.pathname = '/dashboard';
         return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}
