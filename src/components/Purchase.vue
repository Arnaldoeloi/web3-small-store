<template>
    <div class="mt-4 rounded p-5 bg-dark text-white">
        <h4>Purchase #{{id}} - Made in {{ date }}</h4>
        <p>Bought for <span><img src="../assets/ethereum.png" alt="EthIcon">{{ totalInEthers }} ETH</span></p><br>
        <b-card v-for="product in products" :key="product.id"
            :img-src="product.img_link" 
            img-alt="Product image" 

            style="overflow:none"
            img-left 
            img-width="150px"
            bg-variant="dark"
            text-variant="white"
            class="mb-3 mx-auto img-thumbnail"
            :title="product.name"
            >
            <b-card-text>
                <b-card-text>
                    <span>Current price: <img src="../assets/ethereum.png" alt="EthIcon">{{ weiToEthers(product.price) }} ETH</span><br/>
                    <span v-if="product.stock>=1">{{ product.stock }} still in stock</span> 
                    <h5 class="text-danger" v-else>Out of Stock</h5>
                </b-card-text>
            </b-card-text>    
        </b-card>
        <hr class="text-white bg-white">
        <span>Transaction on Etherscan:</span><br>
        <b-link target="_blank" class="text-white link-light" :href="linkToTxHash">{{txHash}}</b-link>
    </div>
</template>

<script>
import web3 from 'web3'

export default {
    name: 'Purchase',
    props:['products','amounts', 'date', 'total', 'id'],
    data() {
        return {
            txHash: null,
        };
    },

    mounted() {
        this.getTxHashByPurchaseId(this.id);
    },

    methods: {
        weiToEthers: function(wei){
            return web3.utils.fromWei(String(wei), 'ether');
        },
        getTxHashByPurchaseId: function(id){
            window.contract.getPastEvents('PurchaseWasMade', {
                fromBlock: 0,
                filter:{
                    id:id+1,
                    buyer:window.DApp.account
                }
            }).then((tx)=>{
                console.log('purchase_id '+id+":",tx);
                this.txHash = tx[0].transactionHash;
            });
        }
    },
    computed: {
        totalInEthers(){
            if(!this.total)return;
            return this.weiToEthers(this.total);
        },
        linkToTxHash: function(){
            return `https://ropsten.etherscan.io/tx/${this.txHash}`;
        }
    },
};
</script>

<style lang="scss" scoped>

</style>