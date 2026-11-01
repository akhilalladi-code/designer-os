import {describe,expect,it} from "vitest";
const rgb=(h:string)=>{let s=h.replace("#","");if(!/^[0-9a-f]{6}$/i.test(s))return null;return [parseInt(s.slice(0,2),16),parseInt(s.slice(2,4),16),parseInt(s.slice(4,6),16)]};
describe("HEX color parsing",()=>{it("parses six-digit HEX",()=>expect(rgb("#6C5CE7")).toEqual([108,92,231]));it("rejects malformed values",()=>expect(rgb("#bad")).toBeNull())});
