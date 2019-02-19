<template>
  <div class="publish">
    <div class="header">
      <button @click="$router.go(-1)">取消</button>
      <button @click="publish">发表</button>
    </div>
    <div class="content">
      <div class="text_wrap">
        <textarea placeholder="此刻你的感受..." v-model="text"></textarea>
        <!-- 文件上传 -->
        <Upload :loading="loading" @getImgs="getImgs"></Upload>
      </div>
    </div>
    <Loading :loading="loading"></Loading>
  </div>
</template>
  
<script>
import Upload from "../components/Upload";
import Loading from "../components/Loading";
import jwt_decode from "jwt-decode";

export default {
  name: "chats",
  props: [],
  data() {
    return {
      text: "",
      imgs: [],
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
    publish() {
      this.loading = true;
      // 发表消息
      // console.log(this.imgs);
      const postData = {
        name: this.user.name,
        img: this.user.avatar,
        text: this.text,
        imgs: this.imgs.join("|")
      };
      // 请求
      this.$axios.post("/api/profiles/add", postData).then(res=> {
        this.loading = false;
        console.log(res)
        // 发布成功后跳转
        this.$router.push("/moments");
      });
    },
    getImgs(imgs) {
      // 获取base64
      imgs.forEach(file => {
        this.uploadFile(file);
      });
    },
    uploadFile(file) {
      let reader = new FileReader();
      const self = this;
      reader.onload = function() {
        // console.log(e.target.result);
        // console.log(this.result);
        self.imgs.push(this.result);
      };
      reader.readAsDataURL(file);
    }
  },
  components: {
    Upload,
    Loading
  }
};
</script>
  
<style lang="scss" scoped>
.publish {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.header {
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  display: flex;
  padding: 0 10px;
  line-height: 50px;
  justify-content: space-between;
}
.header button {
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 16px;
}
.header button:nth-child(2) {
  color: #20af0e;
}
.content {
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
}
.text_wrap textarea {
  width: 100%;
  font-size: 14px;
  min-height: 60px;
  border: none;
  outline: none;
}
.text_wrap {
  margin-bottom: 16px;
}
</style>
