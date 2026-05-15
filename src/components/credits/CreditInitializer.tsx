"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function CreditInitializer() {
  const { user } = useUser();
  const initializeUserCredits = useMutation(api.credits.initializeUserCredits);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!user || hasInitialized.current) return;
    hasInitialized.current = true;
    void initializeUserCredits();
  }, [user, initializeUserCredits]);

  return null;
}
