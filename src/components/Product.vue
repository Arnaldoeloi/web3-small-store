<template>
    <b-card 
        :title="product.name"
        style="width: 15rem;min-width=10rem;max-width=15rem"
        border-variant="light"
        tag="div"
        class="mb-2 product"
        :img-src="product.img_link"
        bg-variant="dark"
        text-variant="white"
    >
        <b-card-text>
            <span><img src="../assets/ethereum.png" alt="EthIcon">{{ priceInEther }} ETH</span><br/>
            <span v-if="product.stock>=1">{{ product.stock }} in stock</span> 
            <h5 class="text-danger" v-else>Out of Stock</h5>
        </b-card-text>
        <div v-if="product.stock>=1" class="flex flex-column">
            <b-form-spinbutton class="bg-light" v-model="amount" min="1" :max="product.stock" inline></b-form-spinbutton>
            <b-button @click="addToCart(product)" href="#" variant="success" inline :disabled="product.stock<1"> <b-icon icon="cart-plus-fill"/> Add to cart</b-button>
        </div>
    </b-card>

</template>
<script>
import web3 from 'web3'
export default {
    props: ['product'],
    data() {
        return {
            amount: 1,
        };
    },
    methods: {
        addToCart: function(product){
            this.$emit('addedToCart', {'product':product, 'amount':this.amount});
            // console.log(product.price);

            // window.contract.methods.buyProduct(product.id, 1).send(
            //     {
            //         from: window.DApp.account,
            //         value: product.price
            //     }
            // ).then(
            //     (tx)=>console.log(tx)
            // );
        }
    },
    computed: {
        priceInEther() {
            return web3.utils.fromWei(String(this.product.price), 'ether');
        },
    
    },

}
</script>
<style>
.card-title{
    flex-grow: 2;
}
.product > .card-body{
    display: flex;
    flex-direction: column;
    align-content: space-between;
}
</style>