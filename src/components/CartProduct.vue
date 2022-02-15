<template>
<div>
    <b-card 
        :title="`${product.canBeBought?'':'[DELETED]'}${product.name}`"
        tag="article"
        style="width: 100%;"
        class="mb-2"
        img-left
        :img-src="product.img_link"
        img-height="150px"
    >
        <b-card-text>
            <span><img src="../assets/ethereum.png" alt="EthIcon">{{ priceInEther }}</span><br/>   
            <span v-if="amount>=1">{{ amount }} in cart</span> 
        </b-card-text>
        <div v-if="product.stock>=1" class="block">
            <b-button class="block" @click="removeFromCart(product)" href="#" variant="danger" inline ><b-icon icon="cart-dash-fill"/> Remove from cart</b-button>
        </div>
    </b-card>
</div>
</template>
<script>
import web3 from 'web3';
export default {
    name: 'CartProduct',
    props: ['product','amount'],
    methods: {
        removeFromCart: function(product){
            this.$emit('removeFromCard', product);
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
.block{
    display: block;
}    
.inline-block{
    display: inline-block;
}    
.height-100{
    height: 100%;
}
.flex-stretch{
    align-items: stretch;
}
</style>