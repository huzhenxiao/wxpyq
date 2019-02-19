<template>
  <div class="circle">
    <Header title="朋友圈" btn_icon="camera" :isLeft="true" @rightclick="$router.push('/publish')"></Header>
    <div class="container">
      <Scroll ref="refresh" @pulldown="loadData" @pullup="loadMore">
        <div class="head_wrapper">
          <div class="user_head">
            <span>{{user.name}}</span>
            <div class="user_img">
              <img :src="user.avatar" alt class="head_img">
            </div>
          </div>
        </div>
        <div class="content_wrapper">
          <CellView
           v-for="(moment,index) in momentsList" 
           :key="index"
           :momentObj="moment"
           ></CellView>
        </div>
      </Scroll>
    </div>
  </div>
</template>
  
<script>
import Header from "../components/Header";
import jwt_decode from "jwt-decode";
import CellView from "../components/CellView";
import Scroll from "../components/Scroll";

export default {
  name: "moments",
  props: [],
  data() {
    return {
      momentsList:[],
      page:2,  // 加载更多从page2开始
      size:3,   // 每次请求3条数据
      loading:false
    };
  },
  computed: {
    user() {
      const token = localStorage.wxpyqToken;
      // 解析token
      const decode = jwt_decode(token);
      return decode;
    }
  },
  methods: {
    getLatestData() {
      if(this.loading) return;
      this.loading = true;
      this.$axios("/api/profiles/latest").then(res => {
        this.loading = false;
        // console.log(res.data);
        this.momentsList = [...res.data];
      });
    },
    loadData(){
      this.getLatestData();
      // 触发事件，解决重置问题
      this.$refs.refresh.$emit('refresh');
      // 重置page
      this.page = 2;
    },
    loadMore(){
      if(this.loading) return;
      this.loading = true;
      this.$axios(`/api/profiles/${this.page}/${this.size}`)
          .then(res=>{
            this.loading = false;
            // console.log(res.data)
            const result = [...res.data];
            // 遍历数组
            if(result.length>0){
              result.forEach(item=>{
                this.momentsList.push(item)
              })
              // 自增page
              this.page++;
            }else{
              // 数组为空，没有更多数据，不再page自增
              this.$refs.refresh.$emit('loadedDone')
            }
          })
    }
  },
  created() {
    this.getLatestData();
  },
  components: {
    Header,
    CellView,
    Scroll
  }
};
</script>
  
<style lang="scss" scoped>
.circle {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.container {
  width: 100%;
  height: calc(100% - 50px);
  padding-top: 50px;
  overflow: auto;
}
.head_wrapper {
  width: 100%;
  position: relative;
  height: 200px;
  background: url(../assets/cricle_bg.png) no-repeat;
  background-size: 100% 100%;
}
.head_wrapper .user_head {
  position: absolute;
  bottom: -30px;
  right: 16px;
}
.user_img {
  width: 60px;
  height: 60px;
  padding: 3px;
  border: 1px solid #c5c5c5;
  box-sizing: border-box;
}
.user_head img {
  width: 100%;
  height: 100%;
}
.user_head span {
  line-height: 30px;
  position: absolute;
  right: 76px;
  width: 200px;
  text-align: right;
  color: white;
}
</style>