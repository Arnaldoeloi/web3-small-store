<template>
  <div class="m-3">
        <h3>Products <b-button v-if="chosenProducts.length>=1" variant="dark" v-b-modal="'cart-modal'">Open Cart</b-button></h3>
        <template v-if="!fetchingProducts">
          <b-card-group class="products-container">
            <Product @addedToCart="handleAddToCart" v-for="product in products" :product="product" v-bind:key="product.id"/>
            
            <div v-if="products.length<=0">
              <h4 class="text-warning" >No products in the store :(</h4>
              <span>If you are the owner, <b-link to="/products/add">add a new product.</b-link></span>
            </div>
          </b-card-group>
        </template>
        <div v-else class="text-center">
          <b-spinner variant="primary"></b-spinner>
        </div>


      <b-modal ref="cart-modal" id="cart-modal" hide-footer :title="`Cart (${chosenProducts.length})`" v-if="chosenProducts.length>=1">
        <div class="flex flex-column flex-stretch">
          <CartProduct v-for="product in chosenProducts" 
            :product="product.product"
            :amount="product.amount" 
            :key="product.product.id"
            @removeFromCard="handleRemovalFromCart"
          />
        </div>
        <div class="flex justify-between align-center">
            <h5>Total: <img src="../assets/ethereum.png" alt="EthIcon">{{totalInEthers}} ETH</h5>
            <b-button type="button" @click="checkout" variant="success" :disabled="processingCheckout">
                <b-spinner v-if="processingCheckout" small></b-spinner>
                {{`${processingCheckout?'Processing':'Checkout'}`}}
            </b-button>
        </div>
      </b-modal>
    </div>
</template>

<script>
import Product from '../components/Product.vue'
import CartProduct from '../components/CartProduct.vue'
import web3 from 'web3'

export default {
  name: 'Store',
  components: {
    Product,
    CartProduct
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
    handleRemovalFromCart: function(product){
      console.log('removed:',product)
      this.chosenProducts=this.chosenProducts.filter((p)=>p.product.id!=product.id);
    },
    makeToast(title,variant = null,description,) {
        this.$bvToast.toast(description, {
          title: title,
          variant: variant,
          solid: true
        })
    },
    checkout: function(){
      const productIds=this.chosenProducts.map(
        (purchase)=>purchase.product.id
      );
      
      const amounts=this.chosenProducts.map(
        (purchase)=>purchase.amount
      );
      
      this.processingCheckout=true;
      var tx = window.contract.methods.buyProducts(productIds,amounts).send(
        {
            from: window.DApp.account,
            value: this.total,
        }
      ).then(
          (tx)=>{
            console.log(tx)
            this.chosenProducts=[]
            this.processingCheckout=false;
          }
      ).catch(err=>console.log(err));
      

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
            this.products = this.products.filter((product)=>product.canBeBought)
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
      console.log('handlePurchaseWasMadeEvent: ',event.returnValues[1].productId);

      event.returnValues[1][1].forEach( (id,index)=>{
          this.products = this.products.map((product)=>{
            if(product.id==id){
              console.log(product);
              product.stock = Math.max(product.stock-event.returnValues[1].amounts[index],0)
              if(window.DApp.account==event.returnValues.buyer.toLowerCase()){
                this.makeToast(`Your purchase of the ${product.name} was processed`,'success',`The address ${event.returnValues.buyer} just bought ${event.returnValues[1].amounts[index]} of ${product.name}.`);        
              }else{
                this.makeToast(`Some ${product.name} was bought`,'info',`The address ${event.returnValues[1].amounts[index]} of it.`);        
              }
            }
            return product;
          })
      })
      
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