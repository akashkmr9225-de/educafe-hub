"use client";

import { useEffect } from "react";
import { initEduCafe } from "./runtime";

export function EduCafeRuntime() {
  useEffect(() => {
    void initEduCafe();
  }, []);
  return null;
}
