<template>
  <div class="description">
    <div class="description_header">
        <img class="header_back" src="../assets/description/back.png" @click="goBack()">
        <img class="header_share" src="../assets/description/share_iso.png"/>
    </div>
    <div class="articleContent">
        <div class="siteClip">
            <p>{{ articleContent.siteName}}</p>
            <img src="../assets/description/news_clip.png"/>
        </div>
        <div class="openDate"><p>{{ articleContent.openDate }}</p></div>
        <div class="title">{{ articleContent.title }}</div>
        <div class="content">{{ articleContent.content }}</div>
        <div class="readMore" @click="gotoLogin()">続きを読む（ログインが必要です）</div>
    </div>
  </div>
</template>

<script>
export default {
   name: 'Description',
   data() {
        return {
            articleContent:{
                title: null,
                siteName: null,
                imgUrl: null,
                openDate: null,
                content: null
            }
        }
    },
    mounted: function () {
        this.getDescription()
    },
    methods: {
        getDescription: function() {
            var articleTitle =  this.$route.params.title
            var siteName =  this.$route.params.siteName
            var openDate =  this.$route.params.openDate
            var description =  this.$route.params.description
            if (typeof(articleTitle) == "undefined" || articleTitle == null) {
               return;
            }
            this.articleContent.title = articleTitle == "null" ? "" : articleTitle
            this.articleContent.siteName = siteName == "null" ? "" : siteName
            this.articleContent.openDate = openDate == "null" ? "" : openDate
            this.articleContent.content = description == "null" ? "" : description
            
        },
        goBack: function() {
            if (window.history.length > 1) {
                this.$router.go(-1)
            } else {
                this.$router.push('/')
            }
            //window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
        },
        gotoLogin: function() {
            
        },
/*        testGet: function() {
            this.$axios.get('/data/cityinfo/101190101.html')
                .then(function (response) {
                  console.log(response);
                })
                .catch(function (error) {
                  console.log(error);
                })
                .then(function () {
                  console.log("finished");
                });
        },
        testPost: function() {
            this.$axios.post('/user', {
                    firstName: 'Fred',
                    lastName: 'Flintstone'
                })
                .then(function (response) {
                    debugger
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                });
       }
*/
    }
}
</script>

<style scoped>
    .description_header {
        background-color: #CDCDCD;
        width: 100%;
        height: 44px;
        border-top: 8px solid #20BCC4;
        border-bottom: 3px solid #EEAD0E;
    }

    .description_header .header_back {
        width: 30px;
        margin: 10px auto 10px 15px;
        float: left;
        cursor: pointer;
    }
    
    .description_header .header_share {
        width: 30px;
        margin: 10px 15px 10px auto;
        float: right;
        cursor: pointer;
    }
    
    .articleContent {
        width: 100%;
    }
    
    .articleContent .siteClip {
        width: 100%;
        height: 36px;
        border-bottom: 2px solid #7D7D7D;
    }
    
    .articleContent .siteClip p {
        font-size: 12px;
        line-height: 36px;
        font-weight: 400;
        color: #A1A1A1;
        margin: 0px auto 0px 15px;
        float: left;
    }
    
    .articleContent .siteClip img {
        width: 24px;
        margin: 6px 20px 6px auto;
        cursor: pointer;
        float: right;
    }
    
    .articleContent .openDate {
        width: 100%;
    }
    
    .articleContent .openDate p {
        margin: 0px auto 0px 15px;
        font-size: 14px;
        line-height: 30px;
        font-weight: 400;
        color: #A1A1A1;
    }
    
    .articleContent .title {
        font-size: 20px;
        color: #2B2B2B;
        margin: 0px 25px 10px 15px;
        word-wrap: break-word;
        font-weight: 700;
        line-height: 24px;
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
    
    .articleContent .content {
        font-size: 16px;
        color: #2B2B2B;
        margin: 0px 15px 30px 15px;
        word-wrap: break-word;
        font-weight: 400;
        line-height: 20px;
        overflow: hidden;
    }
    
    .articleContent .readMore {
        height: 30px;
        margin: 0px 0px 10px 0px;
        border: 2px solid #7D7D7D;
        text-align: center;
        font-size: 16px;
        color: #7D7D7D;
        word-wrap: break-word;
        font-weight: 700;
        line-height: 30px;
        cursor: pointer;
    }
</style>