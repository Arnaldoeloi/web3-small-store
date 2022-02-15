<template>
  <div class="m-3">
        <h3>Purchases </h3>
        <template v-if="!fetchingMyPurchases">
          <b-card-group deck class="products-container width-100">
            
            <Purchase v-for="purchase in purchases" 
              :key="purchase.id"
              :id="purchase.id"
              :date="purchase.date" 
              :products="purchase.products" 
              :amounts="purchase.amounts"
              :total="purchase.total"
              class="width-100"
            />
            <div v-if="purchases.length<=0">
              <h4 class="text-warning" >No purchases yet :(</h4>
              <span>Just go <b-link to="/">buy something.</b-link></span>
            </div>
          </b-card-group>
        </template>
        <div v-else class="text-center">
          <b-spinner variant="primary"></b-spinner>
        </div>
    </div>
</template>

<script>
import Purchase from '../components/Purchase.vue'
import web3 from 'web3'

export default {
  name: 'MyPurchases',
  components: {
    Purchase,
  },
  data() {
    return {
      fetchingMyPurchases: true,
      contract: {},
      allProducts: [],
      notifiedHashes:[],
      purchases: [],
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
    getAllProducts: function() {
        this.contract.methods.getAllProducts().call().then((products)=>{
            this.allProducts = products.map(
              (product) => {
                return {
                "id":product[0],
                "name":product[1],
                "price":product[2],
                "img_link":product[3],
                "stock": product[4]}
              }
            );
            this.getMyPurchases();
            // this.fetchingMyPurchases=false;
          }
        );
    },
    getMyPurchases: function() {
        this.contract.methods.getMyPurchases().call(
          {
            from: window.DApp.account
          }
        ).then((r)=>{
            console.log('my purchases',r)
            r.forEach((p,index) => {
              const products = p.productId.map((id)=>this.allProducts[id]);
              const amounts  = p.amounts;
              const total    = p.paid;  
              const date     = new Date(p.date*1000).toLocaleString()
  
              const purchase = {
                id: index,
                products: products,
                amounts: amounts,
                total: total,
                date: date,
              }

              console.log('purchase', purchase);
  
              this.purchases.push(purchase);
            });
            this.fetchingMyPurchases=false;
          }
        );
    },
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

</style>