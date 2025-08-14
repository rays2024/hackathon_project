export type TokenPool = {
  "version": "0.1.0",
  "name": "token_pool",
  "instructions": [
    {
      "name": "initializeWithSplToken",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitParams"
          }
        }
      ]
    },
    {
      "name": "initializeWithRewards",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardsConf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "changeConf",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newBackendAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stakeSplToken",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backendAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "conf",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAtaToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "stakeNativeToken",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backendAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programSolWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backendAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programSolWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAtaToken",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "for sol token just create a empty ata account for user if it doesn't exist"
          ]
        },
        {
          "name": "poolToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimRewards",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backendAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsSolWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAtaToken",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "for sol token just create a empty ata account for user if it doesn't exist"
          ]
        },
        {
          "name": "rewardsConf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferToRewards",
      "accounts": [
        {
          "name": "backendAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programSolWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardsConf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsSolWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "conf",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "backendAuthority",
            "type": "publicKey"
          },
          {
            "name": "initType",
            "type": "u8"
          },
          {
            "name": "reserved",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "rewardsConf",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "reserved",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "stakeAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "stakeAmount",
            "type": "u64"
          },
          {
            "name": "withdrawAmount",
            "type": "u64"
          },
          {
            "name": "withdrawRewardsAmount",
            "type": "u64"
          },
          {
            "name": "reserved",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initType",
            "type": "u8"
          },
          {
            "name": "backendAuthority",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "ChangeConfigEvent",
      "fields": [
        {
          "name": "conf",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "backendAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimRewardsEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "initType",
          "type": "u8",
          "index": false
        }
      ]
    },
    {
      "name": "InitEvent",
      "fields": [
        {
          "name": "admin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "conf",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "initType",
          "type": "u8",
          "index": false
        },
        {
          "name": "backendAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "InitRewardsEvent",
      "fields": [
        {
          "name": "rewardsConf",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardsTokenMint",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "TokenStakeEvent",
      "fields": [
        {
          "name": "payer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "receiver",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "initType",
          "type": "u8",
          "index": false
        }
      ]
    },
    {
      "name": "TokenWithdrawEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "initType",
          "type": "u8",
          "index": false
        }
      ]
    },
    {
      "name": "TransferToRewardsEvent",
      "fields": [
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "initType",
          "type": "u8",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InputAmountIsZero",
      "msg": "InputAmountIsZero"
    },
    {
      "code": 6001,
      "name": "NotEnoughStakeAmountForUser",
      "msg": "NotEnoughStakeAmountForUser"
    },
    {
      "code": 6002,
      "name": "NotPoolTokenReserved",
      "msg": "NotPoolTokenReserved"
    },
    {
      "code": 6003,
      "name": "NotPoolSolReserved",
      "msg": "NotPoolSolReserved"
    },
    {
      "code": 6004,
      "name": "SwapAmountIsTooSmall",
      "msg": "SwapAmountIsTooSmall"
    },
    {
      "code": 6005,
      "name": "NotSplToken",
      "msg": "NotSplToken"
    },
    {
      "code": 6006,
      "name": "NotNativeToken",
      "msg": "NotNativeToken"
    }
  ]
};

export const IDL: TokenPool = {
  "version": "0.1.0",
  "name": "token_pool",
  "instructions": [
    {
      "name": "initializeWithSplToken",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "poolToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": "InitParams"
          }
        }
      ]
    },
    {
      "name": "initializeWithRewards",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsTokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardsConf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "changeConf",
      "accounts": [
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "newBackendAuthority",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "stakeSplToken",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backendAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "conf",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAtaToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "stakeNativeToken",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backendAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programSolWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backendAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "stakeAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programSolWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAtaToken",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "for sol token just create a empty ata account for user if it doesn't exist"
          ]
        },
        {
          "name": "poolToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimRewards",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "backendAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsSolWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userAtaToken",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "for sol token just create a empty ata account for user if it doesn't exist"
          ]
        },
        {
          "name": "rewardsConf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferToRewards",
      "accounts": [
        {
          "name": "backendAuthority",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "conf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "poolToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "programSolWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rewardsConf",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsToken",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "rewardsSolWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "conf",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "backendAuthority",
            "type": "publicKey"
          },
          {
            "name": "initType",
            "type": "u8"
          },
          {
            "name": "reserved",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "rewardsConf",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": {
              "array": [
                "u8",
                1
              ]
            }
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "reserved",
            "type": "publicKey"
          }
        ]
      }
    },
    {
      "name": "stakeAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "stakeAmount",
            "type": "u64"
          },
          {
            "name": "withdrawAmount",
            "type": "u64"
          },
          {
            "name": "withdrawRewardsAmount",
            "type": "u64"
          },
          {
            "name": "reserved",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "InitParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initType",
            "type": "u8"
          },
          {
            "name": "backendAuthority",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "ChangeConfigEvent",
      "fields": [
        {
          "name": "conf",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "backendAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "ClaimRewardsEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "initType",
          "type": "u8",
          "index": false
        }
      ]
    },
    {
      "name": "InitEvent",
      "fields": [
        {
          "name": "admin",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "conf",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "initType",
          "type": "u8",
          "index": false
        },
        {
          "name": "backendAuthority",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "InitRewardsEvent",
      "fields": [
        {
          "name": "rewardsConf",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "rewardsTokenMint",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "TokenStakeEvent",
      "fields": [
        {
          "name": "payer",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "receiver",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "initType",
          "type": "u8",
          "index": false
        }
      ]
    },
    {
      "name": "TokenWithdrawEvent",
      "fields": [
        {
          "name": "user",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "initType",
          "type": "u8",
          "index": false
        }
      ]
    },
    {
      "name": "TransferToRewardsEvent",
      "fields": [
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "initType",
          "type": "u8",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InputAmountIsZero",
      "msg": "InputAmountIsZero"
    },
    {
      "code": 6001,
      "name": "NotEnoughStakeAmountForUser",
      "msg": "NotEnoughStakeAmountForUser"
    },
    {
      "code": 6002,
      "name": "NotPoolTokenReserved",
      "msg": "NotPoolTokenReserved"
    },
    {
      "code": 6003,
      "name": "NotPoolSolReserved",
      "msg": "NotPoolSolReserved"
    },
    {
      "code": 6004,
      "name": "SwapAmountIsTooSmall",
      "msg": "SwapAmountIsTooSmall"
    },
    {
      "code": 6005,
      "name": "NotSplToken",
      "msg": "NotSplToken"
    },
    {
      "code": 6006,
      "name": "NotNativeToken",
      "msg": "NotNativeToken"
    }
  ]
};
