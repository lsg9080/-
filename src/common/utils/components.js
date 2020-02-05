import shopPanel from "@/components/children/shopPanel.vue";
// import shopCartControl from '@/components/children/shopCartControl.vue'
function plugin(Vue) {
    if (plugin.installed) return;
    Vue.component('shop-panel', shopPanel);
    // Vue.component('cart-control', shopCartControl);

}
export default plugin;