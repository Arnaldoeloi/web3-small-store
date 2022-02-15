import Vue from 'vue'
import App from './App.vue'
import Web3 from 'web3';
import Abi from './util/contractAbi.js'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'



Vue.config.productionTip = false
// const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
// console.log(web3);
const contractAddress = "0x6096d993911835be78c09De6d2420334d1f04A11";

const DApp = {
  web3: null,
  contract: {},
  account: null,

  init: function () {
    return DApp.initWeb3();
  },

  // Inicializa o provedor web3
  initWeb3: async function () {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ // Requisita primeiro acesso ao Metamask
          method: "eth_requestAccounts",
        });
        DApp.account = accounts[0];
        window.ethereum.on('accountsChanged', DApp.updateAccount); // Atualiza se o usuário trcar de conta no Metamaslk
      } catch (error) {
        console.error("Usuário negou acesso ao web3!");
        return;
      }
      DApp.web3 = new Web3(window.ethereum);
    } else {
      console.error("Instalar MetaMask!");
      return;
    }
    return DApp.initContract();
  },

  // Atualiza 'DApp.account' para a conta ativa no Metamask
  updateAccount: async function() {
    DApp.account = (await DApp.web3.eth.getAccounts())[0];
  },

  // Associa ao endereço do seu contrato
  initContract: async function () {
    DApp.contract = new DApp.web3.eth.Contract(Abi, contractAddress);
    return DApp.contract;
    // return DApp.render();
  },
};

Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

async function loadContract(){
  await DApp.initWeb3();
  window.DApp = DApp;
  window.contract = DApp.contract;
}

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

loadContract().then((e)=>{
  console.log("Added to window");
}).catch((e)=>
  console.log(e.message)
);
