import { describe, expect, it } from "vitest";

const validHex = (value: string) => /^#?[\da-f]{6}$/i.test(value.trim());
const rgb = (value: string) => { if (!validHex(value)) return null; const s=value.trim().replace(/^#/,""); return [parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)]; };
const luminance = (value: string) => { const c=rgb(value); if(!c)return 0; const v=c.map(n=>{const x=n/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;}); return .2126*v[0]+.7152*v[1]+.0722*v[2]; };
const contrast = (a:string,b:string) => {const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};

describe("color utilities", () => {
  it("parses valid six-digit HEX values with or without hash", () => { expect(rgb("#6C5CE7")).toEqual([108,92,231]); expect(rgb("FFFFFF")).toEqual([255,255,255]); });
  it("rejects malformed values", () => { expect(rgb("#bad")).toBeNull(); expect(rgb("nope!!")).toBeNull(); });
  it("calculates the WCAG black/white contrast ratio", () => { expect(contrast("#000000","#FFFFFF")).toBeCloseTo(21,5); });
  it("recognizes a failing low-contrast pair", () => { expect(contrast("#777777","#888888")).toBeLessThan(2); });
});
