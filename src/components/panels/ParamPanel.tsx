import { memo, useMemo, useRef, useState } from "react";
import { Input, Slider, Button, Typography, theme } from "antd";
import { useAtomValue } from "jotai";
import type { ParamInfo } from "l2d";
import { paramsAtom, paramValuesAtom, loadingStatusAtom } from "@/atoms/model";
import { getL2DInstance } from "@/lib/l2dSingleton";
import { useParamsRaf } from "@/hooks/useParamsRaf";
import EmptyState from "@/components/shared/EmptyState";

const { Text } = Typography;
const ACTIVE_THRESHOLD = 0.001;
const ROW_HEIGHT = 68;
const ROW_OVERSCAN = 8;
const VIEWPORT_HEIGHT = 420;

interface ParamRowProps {
  param: ParamInfo;
  liveValue: number;
  colorPrimary: string;
  colorText: string;
  sliderTooltip: { open: false };
}

const ParamRow = memo(function ParamRow({
  param,
  liveValue,
  colorPrimary,
  colorText,
  sliderTooltip,
}: ParamRowProps) {
  const isActive = Math.abs(liveValue - param.default) > ACTIVE_THRESHOLD;
  const step = (param.max - param.min) / 200 || 0.01;

  return (
    <div
      style={{
        borderLeft: isActive
          ? `3px solid ${colorPrimary}`
          : "3px solid transparent",
        paddingLeft: 6,
        transition: "border-color 0.15s",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 2,
        }}
      >
        <span
          title={param.id}
          style={{
            fontSize: 11,
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            color: isActive ? colorPrimary : colorText,
            fontWeight: isActive ? 600 : undefined,
          }}
        >
          {param.id}
        </span>
        <Text
          type="secondary"
          style={{
            fontSize: 11,
            minWidth: 40,
            textAlign: "right",
            flexShrink: 0,
          }}
        >
          {liveValue.toFixed(2)}
        </Text>
        <Button
          type="text"
          size="small"
          style={{ padding: "0 4px", fontSize: 12, flexShrink: 0 }}
          disabled={!isActive}
          onClick={() => getL2DInstance()?.setParams({ [param.id]: param.default })}
        >
          ↺
        </Button>
      </div>

      <Slider
        min={param.min}
        max={param.max}
        step={step}
        value={liveValue}
        onChange={(val) => getL2DInstance()?.setParams({ [param.id]: val })}
        styles={{ rail: { height: 3 }, track: { height: 3 } }}
        tooltip={sliderTooltip}
      />
    </div>
  );
}, areEqualParamRow);

function areEqualParamRow(prev: ParamRowProps, next: ParamRowProps) {
  return (
    prev.param === next.param &&
    prev.liveValue === next.liveValue &&
    prev.colorPrimary === next.colorPrimary &&
    prev.colorText === next.colorText &&
    prev.sliderTooltip === next.sliderTooltip
  );
}

export default function ParamPanel() {
  const params = useAtomValue(paramsAtom);
  const values = useAtomValue(paramValuesAtom);
  const status = useAtomValue(loadingStatusAtom);
  const [search, setSearch] = useState("");
  const [scrollTop, setScrollTop] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const { token } = theme.useToken();
  useParamsRaf();
  const sliderTooltip = useMemo(() => ({ open: false as const }), []);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return params;
    return params.filter((p) => p.id.toLowerCase().includes(keyword));
  }, [params, search]);

  const totalHeight = filtered.length * ROW_HEIGHT;
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / ROW_HEIGHT) - ROW_OVERSCAN,
  );
  const endIndex = Math.min(
    filtered.length,
    Math.ceil((scrollTop + VIEWPORT_HEIGHT) / ROW_HEIGHT) + ROW_OVERSCAN,
  );
  const visibleRows = filtered.slice(startIndex, endIndex);

  if (status !== "loaded") return <EmptyState />;

  return (
    <div>
      <div style={{ padding: "8px 12px 4px" }}>
        <Input
          size="small"
          placeholder="搜索参数..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setScrollTop(0);
            if (listRef.current) {
              listRef.current.scrollTop = 0;
            }
          }}
          allowClear
        />
      </div>

      <div
        ref={listRef}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        style={{ padding: "0 12px 8px", maxHeight: "55vh", overflowY: "auto" }}
      >
        {filtered.length === 0 && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            无匹配参数
          </Text>
        )}
        {filtered.length > 0 && (
          <div style={{ height: totalHeight, position: "relative" }}>
            {visibleRows.map((p, i) => {
              const rowIndex = startIndex + i;
              const liveValue = values[p.id] ?? p.value;
              return (
                <div
                  key={p.id}
                  style={{
                    position: "absolute",
                    top: rowIndex * ROW_HEIGHT,
                    left: 0,
                    right: 0,
                    height: ROW_HEIGHT,
                    overflow: "hidden",
                  }}
                >
                  <ParamRow
                    param={p}
                    liveValue={liveValue}
                    colorPrimary={token.colorPrimary}
                    colorText={token.colorText}
                    sliderTooltip={sliderTooltip}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
