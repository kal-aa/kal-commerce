import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-up(.*)",
  "/sign-in(.*)",
  "/images(.*)",
]);

const isAdmin = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const url = new URL(req.url);

  if (url.pathname === "/api/stripe/webhook") {
    return NextResponse.next();
  }

  if (
    isAdmin(req) &&
    (await auth()).sessionClaims?.metadata?.role !== "admin"
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Clerk for Stripe webhook
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
