<template>
<div class="m-3">
    <Withdraw/>
    <hr>
    <h3>Products <b-button v-if="chosenProducts.length>=1" variant="dark" v-b-modal="'cart-modal'">Open Cart</b-button></h3>
    <template v-if="!fetchingProducts">
      <b-card-group class="products-container flex flex-stretch flex-column">
        <ProductManagement @addedToCart="handleAddToCart" v-for="product in products" :product="product" v-bind:key="product.id"/>
        
        <div v-if="products.length<=0">
          <h4 class="text-warning" >No products in the store :(</h4>
          <span>If you are the owner, <b-link to="/products/add">add a new product.</b-link></span>
        </div>
      </b-card-group>
    </template>
    <div v-else class="text-center">
      <b-spinner variant="primary"></b-spinner>
    </div>
  </div>
</template>

<script>
import ProductManagement from '../components/ProductManagement.vue'
import Withdraw from '../components/Withdraw.vue'
import CartProduct from '../components/CartProduct.vue'
import web3 from 'web3'

export default {
  name: 'StoreManagement',
  components: {
    ProductManagement,
    Withdraw,
  },
  data() {
    return {
      fetchingProducts: true,
      processingCheckout: false,
      contract: {},
      products: [],
      chosenProducts: [],
      notifiedHashes:[],
    };
  },
  methods: {

    makeToast(title,variant = null,description,) {
        this.$bvToast.toast(description, {
          title: title,
          variant: variant,
          solid: true
        })
    },

    handleAddToCart: function(product){
      this.chosenProducts.push(product)
    },
    getAllProducts: function() {
        this.contract.methods.getAllProducts().call().then((products)=>{
            this.products = products.map(
              (product) => {
                return {
                "id":product[0],
                "name":product[1],
                "price":product[2],
                "img_link":product[3],
                "stock": product[4],
                "canBeBought":product.canBeBought
                }
              }
            );
            this.fetchingProducts=false;
          }
        );
    },
    handleNewProductStored: function(event){
      if(this.notifiedHashes.includes(event.signature))return;
      this.notifiedHashes.push(event.signature);
      const product = {
        id: event.returnValues.product.id,
        name:event.returnValues.product.name,
        price:event.returnValues.product.price,
        img_link:event.returnValues.product.img_link,
        stock:event.returnValues.product.stock,
      }
      this.products=this.products.filter((p)=>product.id!=p.id)
      this.makeToast(`New product available for sale!`,'success',`You can now buy ${product.name} at the store.`);
      this.products.push(product)
    },
    handlePurchaseWasMade: function(event){
      if(this.notifiedHashes.includes(event.signature))return;
      this.notifiedHashes.push(event.signature);
      this.products = this.products.map((product)=>{
        if(product.id == event.returnValues[0][0]){
          product.stock = Math.max(product.stock-event.returnValues[0][1],0)
          console.log('event.returnValues[1].toLowerCase()',event.returnValues[1].toLowerCase())
          console.log('window.DApp.account',window.DApp.account)
        }
        if(window.DApp.account==event.returnValues[1].toLowerCase()){
          this.makeToast(`Your purchase of the ${product.name} was processed`,'success',`The address ${event.returnValues[1]} just bought ${event.returnValues[0][1]} of ${product.name}.`);        
        }else{
          this.makeToast(`Some ${product.name} was bought`,'info',`The address ${event.returnValues[1]} bought ${event.returnValues[0][1]} of it.`);        
        }
        return product;
      });
      console.log(event);
      // var product = this.products.filter()
    }
  },
  computed: {
    total() {
      return this.chosenProducts.reduce(
        (previousValue,currentProduct)=>{
          return previousValue+(currentProduct.product.price*currentProduct.amount);
        },0
      );
    },
    totalInEthers(){
      return web3.utils.fromWei(String(this.total), 'ether');
    }
  
  },
  created() {
    console.log('created')
    this.contract = window.contract
    this.contract.events.NewProductStored({})
      .on('data', (event) =>{
        this.handleNewProductStored(event);
          console.log('data',event)
      })
      .on('changed', changed => console.log("changed",changed))
      .on('error', err => console.log("err",err))
      .on('connected', str => console.log('connected',str))

    this.contract.events.PurchaseWasMade({})
      .on('data', (event) =>{
          this.handlePurchaseWasMade(event)
      })
      .on('changed', changed => console.log("changedPurchaseMade",changed))
      .on('error', err => console.log("errPurchaseMade",err))
      .on('connected', str => console.log('connectedPurchaseMade',str))
  },
  mounted() {
    this.getAllProducts();
  },
  
}
</script>
<style>
.products-container{
  display: flex;
  flex-flow: row nowrap;
  flex-wrap: wrap;
}
.products-container > div{
  margin-right: 1rem;
}
.products-container > .product{
  min-width: 15rem;
  max-width: 15rem;
}

</style>