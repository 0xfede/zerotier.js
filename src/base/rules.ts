import { compile } from "zerotier-rule-compiler/rule-compiler.js";
import { ZeroTier } from "./types.js";

export function compileRules(src: string, rules: ZeroTier.Compiler.Rule[], caps: ZeroTier.Compiler.Capabilities, tags:  ZeroTier.Compiler.Tags): any {
  return compile(src, rules, caps, tags);
}
