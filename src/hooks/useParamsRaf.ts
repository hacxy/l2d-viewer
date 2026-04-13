import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { loadingStatusAtom, paramValuesAtom } from "@/atoms/model";
import { getL2DInstance } from "@/lib/l2dSingleton";

const PARAM_SYNC_INTERVAL_MS = 66; // ~15fps, 降低参数面板高频重渲染压力

export function useParamsRaf() {
  const loadingStatus = useAtomValue(loadingStatusAtom);
  const setParamValues = useSetAtom(paramValuesAtom);
  const prevRef = useRef<Record<string, number>>({});
  const lastSyncAtRef = useRef(0);

  useEffect(() => {
    if (loadingStatus !== "loaded") return;

    prevRef.current = {};
    lastSyncAtRef.current = 0;
    let rafId: number;

    const loop = () => {
      const params = getL2DInstance()?.getParams();
      if (params && params.length > 0) {
        const next: Record<string, number> = {};
        let changed = false;

        for (const p of params) {
          const id = String(p.id);
          if (!id || id === "undefined") continue;
          next[id] = p.value;
          if (prevRef.current[id] !== p.value) changed = true;
        }

        const now = performance.now();
        const shouldSync = now - lastSyncAtRef.current >= PARAM_SYNC_INTERVAL_MS;
        if (changed && shouldSync) {
          prevRef.current = next;
          lastSyncAtRef.current = now;
          setParamValues(next);
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [loadingStatus, setParamValues]);
}
