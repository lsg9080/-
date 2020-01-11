import shopPanel from "@/components/shop/shopPanel.vue"; 

function plugin (Vue){
    if(plugin.installed)return;
    Vue.component('shop-panel',shopPanel)
}
export default plugin;