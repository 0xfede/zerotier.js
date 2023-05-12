import { compile } from "zerotier-rule-compiler/rule-compiler.js";

export interface BaseRule {
  type: string;
  not: boolean;
  or: boolean;
}

export interface SimpleRule extends BaseRule {
  type: 'ACTION_DROP' | 'ACTION_BREAK' | 'ACTION_ACCEPT';
}

export interface TeeRule extends BaseRule {
  type: 'ACTION_TEE';
  length: number;
  address: string;
}

export interface RedirectRule extends BaseRule {
  type: 'ACTION_REDIRECT';
  address: string;
}

export interface ZeroTierAddressRule extends BaseRule {
  type: 'MATCH_SOURCE_ZEROTIER_ADDRESS' | 'MATCH_DEST_ZEROTIER_ADDRESS';
  zt: string;
}

export interface MacAddressRule extends BaseRule {
  type: 'MATCH_MAC_SOURCE' | 'MATCH_MAC_DEST';
  mac: string;
}

export interface IpAddressRule extends BaseRule {
  type: 'MATCH_IPV4_SOURCE' | 'MATCH_IPV4_DEST' | 'MATCH_IPV6_SOURCE' | 'MATCH_IPV6_DEST';
  ip: string;
}

export interface IpTosRule extends BaseRule {
  type: 'MATCH_IP_TOS';
  mask: string;
  start: number;
  end: number;
}

export interface IpProtocolRule extends BaseRule {
  type: 'MATCH_IP_PROTOCOL';
  ipProtocol: number;
}

export interface EtherTypeRule extends BaseRule {
  type: 'MATCH_ETHERTYPE';
  etherType: number;
}

export interface IcmpRule extends BaseRule {
  type: 'MATCH_ICMP';
  icmpType: number;
  icmpCode: number;
}

export interface IpPortRangeRule extends BaseRule {
  type: 'MATCH_IP_SOURCE_PORT_RANGE' | 'MATCH_IP_DEST_PORT_RANGE';
  start: number;
  end: number;
}

export interface CharacteristicsRule extends BaseRule {
  type: 'MATCH_CHARACTERISTICS';
  mask: string;
}

export interface FrameSizeRangeRule extends BaseRule {
  type: 'MATCH_FRAME_SIZE_RANGE';
  start: number;
  end: number;
}

export interface RandomRule extends BaseRule {
  type: 'MATCH_RANDOM';
  probability: number;
}

export interface TagsDifferenceRule extends BaseRule {
  type: 'MATCH_TAGS_DIFFERENCE';
  id: string;
  value: number;
}

export interface TagsRule extends BaseRule {
  type: 'MATCH_TAGS_DIFFERENCE' | 'MATCH_TAGS_BITWISE_AND' | 'MATCH_TAGS_BITWISE_OR' | 'MATCH_TAGS_BITWISE_XOR' | 'MATCH_TAGS_EQUAL' | 'MATCH_TAG_SENDER' | 'MATCH_TAG_RECEIVER';
  id: string;
  value: number;
}

export type Rule = SimpleRule | TeeRule | RedirectRule | ZeroTierAddressRule | MacAddressRule | IpAddressRule | IpTosRule | IpProtocolRule | EtherTypeRule | IcmpRule | IpPortRangeRule | CharacteristicsRule | FrameSizeRangeRule | RandomRule | TagsDifferenceRule | TagsRule;

export interface Capabilities {
  [name: string]: {
    'id': string,
    'default': boolean,
    'rules': Rule[]
  }
}

export interface Tags {
  [name: string]: {
    'id': string,
    'default': number,
    enum: {
      [name: string]: number
    }
    flags: {
      [name: string]: number
    }
  }
}

export function compileRules(src: string, rules: Rule[], caps: Capabilities, tags: Tags): any {
  return compile(src, rules, caps, tags);
}
