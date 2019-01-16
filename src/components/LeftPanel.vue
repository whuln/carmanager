<template>   
   <div class="leftpanel">
  
  <mu-flex direction="column" align-items="center">
    <mu-flex class="name" justify-content="center" >
         <mu-avatar color="lightBlue500"> 李宁    
    </mu-avatar></mu-flex>
    
    <mu-flex direction="column" align-items="center" style="width:100%;">
         <mu-paper class="demo-list-wrap" :z-depth="5">
             <mu-list toggle-nested @click="doClose">
                <mu-list-item v-if="access.includes(1)" button :ripple="false" :to="topath('')">
                    <mu-list-item-action>
                        <img src="../assets/首页.png"/>
                    </mu-list-item-action>
                    <mu-list-item-title>首页</mu-list-item-title>
                </mu-list-item>
                <mu-list-item v-if="access.includes(2)" button :ripple="false" :to="topath('carreq')">
                    <mu-list-item-action>
                         <img src="../assets/车辆申请.png"/>
                    </mu-list-item-action>
                    <mu-list-item-title>用车申请</mu-list-item-title>
                </mu-list-item>
                <mu-list-item v-if="access.includes(3)"  button :ripple="false" :to="topath('carexam')">
                    <mu-list-item-action>
                       <img src="../assets/用车审批.png"/>
                    </mu-list-item-action>
                    <mu-list-item-title>用车审批</mu-list-item-title>
                </mu-list-item>
                <mu-list-item v-if="access.includes(4)" button :ripple="false" :to="topath('carallot')">
                    <mu-list-item-action>
                        <img src="../assets/车辆分配.png"/>
                    </mu-list-item-action>
                    <mu-list-item-title>车辆分配</mu-list-item-title>
                </mu-list-item>
                 <mu-list-item v-if="access.includes(5)" button :ripple="false" :to="topath('driver')">
                    <mu-list-item-action>
                        <img src="../assets/司机排班.png"/>
                    </mu-list-item-action>
                    <mu-list-item-title>司机接单</mu-list-item-title>
                </mu-list-item>
            <mu-list>
            </mu-list>
            <mu-divider></mu-divider>
            <mu-divider></mu-divider>
             <!-- <mu-list-item v-if="access.includes(6)" button :ripple="false" :to="topath('allcaruse')">
                    <mu-list-item-action>
                        <img src="../assets/所有用车.png"/>
                    </mu-list-item-action>
                    <mu-list-item-title>所有用车</mu-list-item-title>                
                </mu-list-item> -->
                <mu-list-item v-if="access.includes(6)" button :ripple="false" :to="topath('carmanage')">
                    <mu-list-item-action>
                        <img src="../assets/车辆管理.png"/>
                    </mu-list-item-action>
                    <mu-list-item-title>车辆管理</mu-list-item-title>                
                </mu-list-item>
                <mu-list-item v-if="access.includes(7)" button :ripple="false" :to="topath('usermanage')">
                     <mu-list-item-action>
                         <img src="../assets/人员管理.png"/>
                    </mu-list-item-action>
                    <mu-list-item-title>用户管理</mu-list-item-title>               
                </mu-list-item>
               
            </mu-list>
         </mu-paper>
    </mu-flex>
  </mu-flex>
 
</div>
</template>
<script>
export default {
    data () {
    return {
      panel: '',
      access:[1,2,3,4,5,6,7]
    }
  },
  props: {
    base: String
  },
  methods: {
    toggle (panel) {
      this.panel = panel === this.panel ? '' : panel;
    },
    topath(path){
        return this.base + "/" +path
    },
    doClose(){
        this.$emit("close");
    }
  }
}
</script>
<style lang="stylus" scoped>
    .leftpanel        
        width 100% 
        padding 8px 
    
    .name
        width 100%
        border-bottom 0.5rem #f5f5f5 solid
        color blue
    
    .demo-list-wrap 
        width 100%
        max-width 360px

    img
        width 1.2rem
        height 1.2rem

</style>
