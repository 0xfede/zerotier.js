declare module 'zerotier-rule-compiler/rule-compiler.js' {
  import { ZeroTier } from '@covisian/zerotier.js';
  export function compile(src: string, rules: ZeroTier.Controller.Network['rules'], caps: ZeroTier.Controller.Network['capabilities'], tags: ZeroTier.Controller.Network['tags']): any;
}
