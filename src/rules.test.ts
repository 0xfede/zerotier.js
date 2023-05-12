import { expect } from 'chai';
import { compileRules } from './rules.js';
import { ZeroTier } from './types.js';

describe('compileRules', () => {
  it('should compile rules', () => {
    const source = `#
  drop
    not ethertype ipv4
    and not ethertype arp
    and not ethertype ipv6
  ;
  
  tag server
    id 2
    enum 0 No
    enum 1 Yes
    default No;
  
  drop
    not tor server 1
  ;
  
  accept;
  `;
    const rules: ZeroTier.Compiler.Rule[] = [];
    const capabilities: ZeroTier.Compiler.Capabilities = {};
    const tags: ZeroTier.Compiler.Tags = {};

    compileRules(source, rules, capabilities, tags);
    expect(rules).to.deep.equal([
      {
        etherType: 2048,
        not: true,
        or: false,
        type: 'MATCH_ETHERTYPE',
      },
      {
        etherType: 2054,
        not: true,
        or: false,
        type: 'MATCH_ETHERTYPE',
      },
      {
        etherType: 34525,
        not: true,
        or: false,
        type: 'MATCH_ETHERTYPE',
      },
      {
        type: 'ACTION_DROP',
      },
      {
        id: 2,
        not: true,
        or: false,
        type: 'MATCH_TAGS_BITWISE_OR',
        value: 1,
      },
      {
        type: 'ACTION_DROP',
      },
      {
        type: 'ACTION_ACCEPT',
      },
    ]);
    expect(tags).to.deep.equal({
      server: {
        default: 0,
        enums: {
          no: 0,
          yes: 1,
        },
        flags: {},
        id: 2,
      },
    });
  });
});
