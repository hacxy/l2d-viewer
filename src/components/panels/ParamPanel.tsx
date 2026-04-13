import { useState } from "react";
import { Input, Slider, Button, Typography, theme } from "antd";
import { useAtomValue } from "jotai";
import { paramsAtom, paramValuesAtom, loadingStatusAtom } from "@/atoms/model";
import { getL2DInstance } from "@/lib/l2dSingleton";
import { useParamsRaf } from "@/hooks/useParamsRaf";
import EmptyState from "@/components/shared/EmptyState";

const { Text } = Typography;
const ACTIVE_THRESHOLD = 0.001;

export default function ParamPanel() {
  const params = useAtomValue(paramsAtom);
  const values = useAtomValue(paramValuesAtom);
  const status = useAtomValue(loadingStatusAtom);
  const [search, setSearch] = useState("");
  const { token } = theme.useToken();
  useParamsRaf();

  if (status !== "loaded") return <EmptyState />;

  const filtered = search.trim()
    ? params.filter((p) =>
        p.id.toLowerCase().includes(search.trim().toLowerCase()),
      )
    : params;

  return (
    <div>
      <div style={{ padding: "8px 12px 4px" }}>
        <Input
          size="small"
          placeholder="搜索参数..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
        />
      </div>

      <div style={{ padding: "0 12px 8px" }}>
        {filtered.length === 0 && (
          <Text type="secondary" style={{ fontSize: 12 }}>
            无匹配参数
          </Text>
        )}
        {filtered.map((p) => {
          const liveValue = values[p.id] ?? p.value;
          const isActive = Math.abs(liveValue - p.default) > ACTIVE_THRESHOLD;
          const step = (p.max - p.min) / 200 || 0.01;

          return (
            <div
              key={p.id}
              style={{
                borderLeft: isActive
                  ? `3px solid ${token.colorPrimary}`
                  : "3px solid transparent",
                paddingLeft: 6,
                marginBottom: 8,
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
                  title={p.id}
                  style={{
                    fontSize: 11,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    color: isActive ? token.colorPrimary : token.colorText,
                    fontWeight: isActive ? 600 : undefined,
                  }}
                >
                  {p.id}
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
                  onClick={() =>
                    getL2DInstance()?.setParams({ [p.id]: p.default })
                  }
                >
                  ↺
                </Button>
              </div>

              <Slider
                min={p.min}
                max={p.max}
                step={step}
                value={liveValue}
                onChange={(val) => getL2DInstance()?.setParams({ [p.id]: val })}
                styles={{ rail: { height: 3 }, track: { height: 3 } }}
                tooltip={{ formatter: (v) => v?.toFixed(3) }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
