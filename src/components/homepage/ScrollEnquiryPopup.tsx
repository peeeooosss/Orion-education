"use client";

import { useEffect } from "react";
import { useEnquiryStore } from "@/store/useEnquiryStore";

const SEEN_KEY = "orion-enquiry-popup-seen";
const SCROLL_EVENTS_TO_TRIGGER = 3;

export function ScrollEnquiryPopup() {
  useEffect(() => {
    let count = 0;
    let lastY = window.scrollY;
    let timer: number | undefined;

    function onScroll() {
      if (sessionStorage.getItem(SEEN_KEY)) return;
      const now = window.scrollY;
      if (Math.abs(now - lastY) < 40) return; // ignore tiny scroll ticks
      lastY = now;
      count += 1;
      if (count >= SCROLL_EVENTS_TO_TRIGGER && !useEnquiryStore.getState().open) {
        sessionStorage.setItem(SEEN_KEY, "1");
        useEnquiryStore.getState().openModal();
      }
    }

    function onScrollThrottled() {
      if (timer !== undefined) return;
      timer = window.setTimeout(() => {
        timer = undefined;
        onScroll();
      }, 250);
    }

    window.addEventListener("scroll", onScrollThrottled, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollThrottled);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, []);

  return null;
}
