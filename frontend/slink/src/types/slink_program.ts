/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/slink_program.json`.
 */
export type SlinkProgram = {
  "address": "4goWpqS7XGfyvXZAKSf7mdUPShMoFZWvmS4S5H21xY9s",
  "metadata": {
    "name": "slinkProgram",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "cancel",
      "discriminator": [
        232,
        219,
        223,
        41,
        219,
        236,
        220,
        190
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true,
          "relations": [
            "slinkVault"
          ]
        },
        {
          "name": "slinkVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  108,
                  105,
                  110,
                  107,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "slinkId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "slinkId",
          "type": "string"
        }
      ]
    },
    {
      "name": "claim",
      "discriminator": [
        62,
        198,
        214,
        193,
        213,
        159,
        108,
        210
      ],
      "accounts": [
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "slinkVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  108,
                  105,
                  110,
                  107,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "slinkId"
              }
            ]
          }
        },
        {
          "name": "recipient",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "slinkId",
          "type": "string"
        },
        {
          "name": "claimKey",
          "type": "string"
        }
      ]
    },
    {
      "name": "create",
      "discriminator": [
        24,
        30,
        200,
        40,
        5,
        28,
        7,
        119
      ],
      "accounts": [
        {
          "name": "creator",
          "writable": true,
          "signer": true
        },
        {
          "name": "slinkVault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  108,
                  105,
                  110,
                  107,
                  95,
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "slinkId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "slinkId",
          "type": "string"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "description",
          "type": "string"
        },
        {
          "name": "claimKey",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "slinkVault",
      "discriminator": [
        17,
        222,
        124,
        45,
        13,
        176,
        24,
        49
      ]
    }
  ],
  "events": [
    {
      "name": "slinkClaimed",
      "discriminator": [
        195,
        45,
        122,
        78,
        219,
        124,
        99,
        52
      ]
    },
    {
      "name": "slinkClosed",
      "discriminator": [
        238,
        10,
        6,
        206,
        97,
        113,
        110,
        110
      ]
    },
    {
      "name": "slinkCreated",
      "discriminator": [
        30,
        181,
        63,
        212,
        75,
        43,
        85,
        144
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "alreadyClaimed",
      "msg": "Sorry, this slink has already been claimed!"
    },
    {
      "code": 6001,
      "name": "invalidClaimKey",
      "msg": "Incorrect claim key, please try again"
    },
    {
      "code": 6002,
      "name": "insufficientBalance",
      "msg": "Insufficient Balance"
    },
    {
      "code": 6003,
      "name": "descriptionTooLong",
      "msg": "Description too long"
    },
    {
      "code": 6004,
      "name": "nonCreator",
      "msg": "not slink creator"
    },
    {
      "code": 6005,
      "name": "incorrectSlinkId",
      "msg": "incorrect slink id"
    },
    {
      "code": 6006,
      "name": "cannotCancelAlradyClaimedSlink",
      "msg": "cannot cancel already claimed slink"
    }
  ],
  "types": [
    {
      "name": "slinkClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "isClaimed",
            "type": "bool"
          },
          {
            "name": "recipient",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "slinkClosed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "slinkCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "slinkVault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "creator",
            "type": "pubkey"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "slinkId",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "claimKeyHash",
            "type": "string"
          },
          {
            "name": "isClaimed",
            "type": "bool"
          }
        ]
      }
    }
  ]
};
