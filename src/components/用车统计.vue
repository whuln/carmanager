<template>
  <mu-flex ref="summaryMainDiv1" class="main" direction="column" fill>
    <div ref="summaryYearDiv" style="margin-top:10px; vertical-align: bottom;">
      <mu-date-input style="width:150px;" v-model="year" prefix="选择年份:" suffix="年" type="year"></mu-date-input>&nbsp;&nbsp;&nbsp;&nbsp;
      <mu-select style="width:150px;" prefix="选择月份:" suffix="月" v-model="month" fill>
        <mu-option v-for="option,index in months" :key="option" :label="option" :value="option"></mu-option>
      </mu-select>
      &nbsp;&nbsp;
      <button @click="doTongji">
        统计
      </button>
    </div>
    <div ref="summaryContentDiv" style="overflow:auto;">
      <fieldset v-for="item in summary">
        <legend>{{item.type}}</legend>
        <mu-data-table :columns="columns" :data="item.data">
          <template slot-scope="scope">
            <td>{{scope.row.key}}</td>
            <td class="is-right">{{scope.row.distance}}</td>
            <td class="is-right">{{scope.row.times}}</td>
            <td class="is-right">{{scope.row.places}}</td>
          </template>
        </mu-data-table>
      </fieldset>
    </div>
  </mu-flex>
</template>

<script>
import request from "@/lib/api.request.js";
import qs from "qs";

export default {
  name: "carusesummary",
  data() {
    return {
      caruse: [1],
      year: "",
      month: "*",
      months: [
        "*",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12"
      ],
      columns: [
        { title: "统计项", width: 80, name: "subject" },
        {
          title: "距离(km)",
          name: "distance",
          width: 100,
          align: "center",
          sortable: true
        },
        {
          title: "出车次数",
          name: "times",
          width: 70,
          align: "center",
          sortable: true
        },
        {
          title: "出车地点",
          name: "places",
          width: 100,
          align: "center",
          sortable: true
        }
      ],
      summary: [
        // {
        //   type: "总计",
        //   data: [
        //     {
        //       key: "2018年",
        //       distance: 6666,
        //       times: 20,
        //       places: "武汉，南京，兰州，乌鲁木齐，北京"
        //     }
        //   ]
        // },
        // {
        //   type: "车辆",
        //   data: [
        //     {
        //       key: "豫A1",
        //       distance: 6666,
        //       times: 20,
        //       places: "武汉，南京，兰州，乌鲁木齐"
        //     },
        //     {
        //       key: "豫A2",
        //       distance: 6666,
        //       times: 20,
        //       places: "南京，兰州，乌鲁木齐，北京"
        //     },
        //     {
        //       key: "豫A3",
        //       distance: 6666,
        //       times: 20,
        //       places: "武汉，南京，乌鲁木齐，北京"
        //     }
        //   ]
        // },
        // {
        //   type: "司机",
        //   data: [
        //     {
        //       key: "s1",
        //       distance: 6666,
        //       times: 20,
        //       places: "武汉，南京，兰州，乌鲁木齐"
        //     },
        //     {
        //       key: "s2",
        //       distance: 6666,
        //       times: 20,
        //       places: "南京，兰州，乌鲁木齐，北京"
        //     },
        //     {
        //       key: "s3",
        //       distance: 6666,
        //       times: 20,
        //       places: "武汉，南京，乌鲁木齐，北京"
        //     }
        //   ]
        // },
        // {
        //   type: "部门",
        //   data: [
        //     {
        //       key: "b1",
        //       distance: 6666,
        //       times: 20,
        //       places: "武汉，南京，兰州，乌鲁木齐"
        //     },
        //     {
        //       key: "b2",
        //       distance: 6666,
        //       times: 20,
        //       places: "南京，兰州，乌鲁木齐，北京"
        //     },
        //     {
        //       key: "b3",
        //       distance: 6666,
        //       times: 20,
        //       places: "武汉，南京，乌鲁木齐，北京"
        //     }
        //   ]
        // }
      ]
    };
  },
  mounted() {
    //  this.$alert(this.$refs.summaryMainDiv1.clientHeight);
    // this.$alert(this.$refs.summaryYearDiv.clientHeight);
    // this.$alert(this.$refs.summaryContentDiv.clientHeight);
    this.$refs.summaryContentDiv.style.height =
      this.$refs.summaryMainDiv1.clientHeight -
      this.$refs.summaryYearDiv.clientHeight;
  },
  methods:{
    async doTongji(){
      let year = (this.year+"").split(' ')[3] ,
        month = this.month, id;
      let now = new Date(), thisYear = now.getFullYear(), thisMonth = now.getMonth() +1;
      if(!year){
         this.$alert("请选择统计年份.");
        return;}
      if(year > thisYear) {
        this.$alert("还没有到" + year +"年,请重新选择.");
        return;
      }
      // this.$alert(month +'=' +thisMonth);
      if(year == thisYear && month > thisMonth){
         this.$alert("还没有到" + month +"月,请重新选择.");
        return;
      } 
      let resp;
      //id格式为year+month, XXXX(year)XX(month),六位
      if(month == '*'){
        if(year != thisYear){
          resp = await request.post("getsummary",qs.stringify({d_min:year+'/1/1', d_max:year+'/12/31'}));
        }else{
          resp = await request.post("getsummary",qs.stringify({d_min:year+'/1/1', d_max:new Date(new Date(year+'-'+(parseInt(thisMonth)+1) +'/1').getTime() - 1000 * 60 * 60 * 24).toLocaleDateString()}));
        }
        
      }else {
        resp = await request.post("getsummary",qs.stringify({d_min:year+'/'+month + '/1', d_max:new Date(new Date(year+'/'+(parseInt(month)+1) +'/1').getTime() - 1000 * 60 * 60 * 24).toLocaleDateString()}));
      }
               
      this.summary = resp.data;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.main {
  width: 100%;
}

.flex-wrapper {
  width: 100%;
  height: 56px;
  margin-top: 8px;
}

.flex-demo {
  width: 200px;
  height: 32px;
  background-color: #e0e0e0;
  text-align: center;
  line-height: 32px;
  margin-left: 8px;
}

.flex-wrapper:first-child {
  margin-top: 0;
}

.flex-demo:first-child {
  margin-left: 0;
}
</style>
