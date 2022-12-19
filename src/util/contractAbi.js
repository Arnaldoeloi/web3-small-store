[
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "_products",
				"type": "uint256[]"
			},
			{
				"internalType": "uint8[]",
				"name": "_amounts",
				"type": "uint8[]"
			}
		],
		"name": "buyProducts",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "img_link",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "stock",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "_canBeBought",
				"type": "bool"
			}
		],
		"name": "editProduct",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "img_link",
						"type": "string"
					},
					{
						"internalType": "uint8",
						"name": "stock",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "canBeBought",
						"type": "bool"
					}
				],
				"internalType": "struct SmallStore.Product",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_productId",
				"type": "uint256"
			}
		],
		"name": "removeProduct",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "img_link",
						"type": "string"
					},
					{
						"internalType": "uint8",
						"name": "stock",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "canBeBought",
						"type": "bool"
					}
				],
				"internalType": "struct SmallStore.Product",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "img_link",
						"type": "string"
					},
					{
						"internalType": "uint8",
						"name": "stock",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "canBeBought",
						"type": "bool"
					}
				],
				"indexed": false,
				"internalType": "struct SmallStore.Product",
				"name": "product",
				"type": "tuple"
			}
		],
		"name": "NewProductStored",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "uint256[]",
						"name": "productId",
						"type": "uint256[]"
					},
					{
						"internalType": "uint8[]",
						"name": "amounts",
						"type": "uint8[]"
					},
					{
						"internalType": "uint256",
						"name": "paid",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					}
				],
				"indexed": false,
				"internalType": "struct SmallStore.Purchase",
				"name": "",
				"type": "tuple"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "PurchaseWasMade",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "img_link",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "stock",
				"type": "uint8"
			}
		],
		"name": "storeProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAllProducts",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "price",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "img_link",
						"type": "string"
					},
					{
						"internalType": "uint8",
						"name": "stock",
						"type": "uint8"
					},
					{
						"internalType": "bool",
						"name": "canBeBought",
						"type": "bool"
					}
				],
				"internalType": "struct SmallStore.Product[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyPurchases",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256[]",
						"name": "productId",
						"type": "uint256[]"
					},
					{
						"internalType": "uint8[]",
						"name": "amounts",
						"type": "uint8[]"
					},
					{
						"internalType": "uint256",
						"name": "paid",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					}
				],
				"internalType": "struct SmallStore.Purchase[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "productIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "img_link",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "stock",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "canBeBought",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "products",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "img_link",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "stock",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "canBeBought",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
