// File: src/types/next-auth.d.ts

import "next-auth";

declare module "next-auth" {
  /**
   * Extends the built-in session types to add the accessToken property.
   */
  interface Session {
    accessToken?: string;
  }
}