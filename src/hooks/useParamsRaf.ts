import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { loadingStatusAtom, paramValuesAtom } from "@/atoms/model";
import { getL2DInstance } from "@/lib/l2dSingleton";

export function useParamsRaf() {
  const loadingStatus = useAtomValue(loadingStatusAtom);
  const setParamValues = useSetAtom(paramValuesAtom);
  const prevRef = useRef<Record<string, number>>({});

  useEffect(() => {
    if (loadingStatus !== "loaded") return;

    prevRef.current = {};
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

        if (changed) {
          prevRef.current = next;
          setParamValues(next);
        }
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [loadingStatus, setParamValues]);
}
