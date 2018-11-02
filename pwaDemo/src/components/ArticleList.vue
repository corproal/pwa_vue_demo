<template>
  <div class="articleList">
    <header :class="headerHiddenClass">
        <div class="primary-nav">
            <div class="medyLogoDiv">
                <img class="medyLogo" src="../assets/description/index_logo.png">
            </div>
            <div class="searchInputDiv">
                <img class="searchIcon" src="../assets/description/search.png">
                <input class="searchInput" type="text" name="search" placeholder="200以上の医療サイトから検索">
                <img class="updateIcon" src="../assets/description/update_icon.png" @click="getArticleListFromServer">
            </div>
        </div>
        <div class="secondary-nav">
            <ul class="cate-tab">
                <li class="cate" v-bind:class="{'tab-active': cate_index === item.id}" v-for="(item, index) in cate" @click="toggleCate(item.id)">
                    <p>{{ item.des }}</p>
                </li>
            </ul>
        </div>
    </header>
    <div class="page" :class="{disableScroll: showAppMenu}">
        <ul class="article-list">
            <li class="article-item" v-for="(item, index) in articleList" @click="gotoDescription(item.id)">
                <div class="article-img">
                    <img v-bind:src="item.imgUrl" v-bind:alt="item.name">
                </div>
                <div class="article-info">
                    <p class="article-title">{{ item.title }}</p>
                    <p class="article-site">{{ item.siteName }}</p>
                </div>
            </li>
        </ul>
    </div>
    <div v-if="shouldShowLoader" class="loader">
        <img src="../assets/description/loading.gif">
    </div>
    <div class="footerTabDiv">
        <ul class="footerTab">
            <li class="footerTabItem" v-for="item in footerTabs" @click="toggleTab(item.id)">
                <img src="../assets/description/configuration.png">
                <p>{{ item.title }}</p>
            </li>
            <dialog-bar v-model="sendVal" type="danger" title="ここはタイトル" content="ここはコンテンツ" v-on:cancel="clickCancel()" @danger="clickDanger()" @confirm="clickConfirm()" dangerText="デリート"></dialog-bar>
        </ul>
    </div>
    <AppMenu v-if="showAppMenu" @closePage="closePage()"/>
  </div>
</template>

<script>
import AppMenu from '@/components/AppMenu.vue'
import dialogBar from './dialog.vue';
const NEWS_API_KEY = 'feb8db34ea39448db7e2cdf798595036';
export default {
  name: 'ArticleList',
  data() {
     return {
        cate_index: this.Global.currentMenuId,
        cate: [
            { id: 100, des: '総合Top' },
            { id: 200, des: '臨床Q&A' },
            { id: 300, des: '医療ニュース' },
            { id: 400, des: 'アンケート' },
            { id: 500, des: '特集・企画' },
            { id: 600, des: '医学生ナビ' },
            { id: 700, des: 'ライフスタイル' }
        ],
        footerTabs: [
            { id: 0, title: "お知らせ" },
            { id: 1, title: "ポイント" },
            { id: 2, title: "メニュー" }
        ],
        articleList: [],
        shouldShowLoader: false,
        previousTop: 0,
        isLoading: false,
        scrolling: false,
        headerHiddenClass: "auto-hide-header",
        showAppMenu: false,
        popScrollTop: 0,
        popHeaderClass: '',
        notificationsSupported: false,
        sendVal: false
    }
  },
  components: {
      AppMenu,
      'dialog-bar': dialogBar,
  },
  created: function () {
      this.getArticleListFromServer()
      
      // notification support check
      if ('Notification' in window && 'serviceWorker' in navigator) {
          this.notificationsSupported = true;
      }
  },
  mounted: function() {
      window.addEventListener('scroll', this.handleScroll);
  },
  methods: {
        handleScroll: function() {
          //this.scroll  = document.documentElement && document.documentElement.scrollTop
          if(!this.scrolling) {
              this.scrolling = true;
              //(!window.requestAnimationFrame) ? setTimeout(this.autoHideHeader(), 250) : requestAnimationFrame(this.autoHideHeader());
              setTimeout(this.autoHideHeader(), 250);
          }
        },
        autoHideHeader: function() {
            if (this.showAppMenu) {
                this.scrolling = false;
                return;
            }
            var scrollDelta = 0;
            var scrollOffset = 100;
            var currentTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
            if ((this.previousTop - currentTop > scrollDelta && currentTop < 100) || currentTop < 100) {
                this.headerHiddenClass = "auto-hide-header";
            } else if( currentTop - this.previousTop > scrollDelta && currentTop > scrollOffset) {
                 this.headerHiddenClass = "auto-hide-header is-hidden";
            }
            this.previousTop = currentTop;
            this.scrolling = false;
        },
        toggleCate: function (index) {
            if (!this.isLoading) {
                this.cate_index = index;
                this.Global.currentMenuId = index;
                this.getArticleListFromServer();
            }
        },
        toggleTab: function(tabId) {
            if (tabId == 2) {
               this.recordScroll();
               this.showAppMenu = true;
               this.restoreScrolAfterPopOpen();
            } else if (tabId == 0) {
                this.askForNotificationPermission();
            } else if (tabId == 1) {
                this.sendVal = true;
            }
        },
        clickCancel(){
        },
        clickDanger(){
        },
        clickConfirm(){
        },
        bodyScroll(event) {
            event.preventDefault()
        },
        recordScroll: function(){
            this.popScrollTop = this.previousTop;
            this.popHeaderClass = this.headerHiddenClass;
        },
        restoreScrolAfterPopOpen: function() {
            this.headerHiddenClass = this.popHeaderClass;
            document.body.style.position = 'relative';
            document.body.style.top = '-' + this.popScrollTop + 'px';
        },
        restoreScrolAfterPopClose: function(){
            document.body.style.position = '';
            document.body.style.top = '0';
            this.$nextTick(() => {
                window.scrollTo(1, this.previousTop);
            });
        },
        closePage: function() {
            this.showAppMenu = false;
            this.restoreScrolAfterPopClose();
        },
        askForNotificationPermission: function() {
            if (this.notificationsSupported) {
                Notification.requestPermission(result => {
                    if (result == 'granted') {
                        this.showNotification();
                    }
                });
            }
        },
        showNotification: function() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.ready
                    .then(swreg => swreg.showNotification('Notifications granted', {
                        body: 'Here is a first notification',
                        icon: '/img/icons/android-chrome-192x192.png',
                        image: '../assets/description/index_logo.png',
                        vibrate: [300, 200, 300],
                        badge: '/img/icons/android-chrome-192x192.png'
                    }))
            }
        },
        gotoDescription: function(id) {
            var filterList = this.articleList.filter(function(item){return item.id == id})
            if (typeof(filterList) != "undefined" && filterList != null && filterList.length > 0) {
                var articleInfo = filterList[0];
                this.$router.push({ name: 'articleDetail', params: { 
                    title: articleInfo.title,
                    siteName: articleInfo.siteName != "" ? articleInfo.siteName : "null",
                    openDate: articleInfo.openDate != "" ? articleInfo.openDate : "null",
                    description: articleInfo.description != "" ? articleInfo.description : "null" }
                })
            }
        },
        showArticleList: function() {
            this.articleDetail = null;
        },
        getArticleListFromServer: function() {
            this.articleList = [];
            this.shouldShowLoader = true;
            this.isLoading = true;
            var currentCategory = null;
            switch(this.cate_index) {
                case this.Global.MENU_ID_CLINIC:
                    currentCategory = 'business';
                    break;
                case this.Global.MENU_ID_NEWS:
                    currentCategory = 'entertainment';
                    break;
                case this.Global.MENU_ID_ENQUETE:
                    currentCategory = 'health';
                    break;
                case this.Global.MENU_ID_FEATURE:
                    currentCategory = 'science';
                    break;
                case this.Global.MENU_ID_NAVI:
                    currentCategory = 'sports';
                    break;
                case this.Global.MENU_ID_LIFE:
                    currentCategory = 'technology';
                    break;
                default:
                    break;
            }
            var requestUrl = currentCategory != null ? process.env.VUE_APP_API_ENDPOINT + '/v2/top-headlines?country=jp&category=' + currentCategory : process.env.VUE_APP_API_ENDPOINT + '/v2/top-headlines?country=jp';
            requestUrl = requestUrl + '&apiKey=' + NEWS_API_KEY;
            var _this = this;
            this.$axios.get(requestUrl)
                .then(function (response) {
                    var topList = response.data.articles;
                    for(var i = 0; i < topList.length; i++) {
                        var newsInfo = topList[i];
                        var articleInfo = {
                            id: 1000 + i,
                            title: newsInfo.title,
                            siteName: newsInfo.author != null ? newsInfo.author : "",
                            openDate: newsInfo.publishedAt != null ? newsInfo.publishedAt : "",
                            imgUrl: newsInfo.urlToImage != null ? newsInfo.urlToImage : "",
                            description: newsInfo.description != null ? newsInfo.description : ""
                        };
                        _this.articleList.push(articleInfo);
                    }
                })
                .catch(function (error) {
                    alert("記事一覧更新失敗しました。");
                })
                .then(function () {
                    _this.shouldShowLoader = false;
                    _this.isLoading = false;
                });
        }
    }
}
</script>

<style scoped>
    body {
    font-size: 14px;
    color: #363636;
}
    h1,
    ul,
    li,
    p {
        margin: 0;
        padding: 0;
    }
    li {
        list-style: none;
    }
    
    .cate,
    .filter-opt,
    .save {
        cursor: pointer;
    }
    
    .header-edit {
        float: right;
        padding: 0 10px;
        cursor: pointer;
    }
    .cate-tab {
        white-space: nowrap;
        overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
        background-color: #D3D3D3;
    }
    .cate {
        display: inline-block;
        min-width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
        color: #2B2B2B;
        word-wrap: break-word;
        font-weight: 500;
        box-shadow: 1px -2px 3px 0px rgba(0,0,0,0.2);
    }
    .cate.tab-active {
        background-color: #FFFFFF;
        border-radius: 5px 5px 0px 0px;
    }
    .cate p {
        padding: 0px 5px;
    }
    .page {
        margin-top: 84px;
    }
    .article-item {
       display: flex;
       padding:3px;
       height: 100px;
       background: #fff;
       border-bottom: 1px solid #7D7D7D;
       overflow: hidden;
       cursor: pointer;
   }
   
   .article-item:hover .article-img {
       filter:alpha(opacity=80);
       opacity:0.8;
   }
   
   .article-item:hover .article-title {
       color: #20BCC4;
   }
   
   .article-img {
       width: 120px;
       height: 90px;
       position: relative;
       margin: 5px 10px 5px 5px;
       display: block;
       overflow: hidden;
       box-shadow: 1px 1px 8px 0px rgba(0,0,0,0.3);
   }
   .article-img img {
       top: 0;
       left: 0;
       width: 120px;
       position: relative;
       left: 50%;
       top: 50%;
       transform: translate(-50%,-50%);
       -webkit-transform: translate(-50%,-50%);
       -ms-transform: translate(-50%,-50%);
   }
   
   .article-info {
       width: calc(100% - 141px);
   }
   
   .article-title {
       width: 100%;
       height: 38px;
       font-size: 16px;
       color: #2B2B2B;
       word-wrap: break-word;
       font-weight: 700;
       line-height: 19px;
       display: -webkit-box;
       overflow: hidden;
       text-overflow: ellipsis;
       -webkit-box-orient: vertical;
       -webkit-line-clamp: 2;
       margin: 5px 0px 15px 0px;
    }
    
    .article-site {
        font-size: 16px;
        line-height: 20px;
        font-weight: 400;
        color: #A1A1A1;
    }
    
    .device {
        position: relative;
        height: 667px;
        background-color: #eee;
        border-radius: 4px;
        overflow: hidden;
    }
    .medyLogoDiv {
        display: inline-block;
        height: 44px;
    }
    
    .medyLogoDiv .medyLogo {
        width: 58px;
        margin: 15px 0px 0px 10px;
    }
    .searchInputDiv {
        width: calc(100% - 68px);
        height: 44px;
        display: inline-block;
        vertical-align: top;
    }
    .searchInputDiv .searchIcon {
        width: 16px;
        margin: 15px 0px 0px 16px;
        position: absolute;
        cursor: pointer;
    }
    .searchInputDiv .searchInput {
        width: 200px;
        height: 26px;
        margin: 0px 0px 0px 10px;
        display: inline-block;
        vertical-align: middle;
        border-width: 1px;
        border-radius: 4px;
        border-color: #20BCC4;
        border-style: solid;
        padding-left: 5px;
        font-size: 14px;
        font-weight: 400;
        color: #20BCC4;
        padding-left: 30px;
    }
    
    .updateIcon {
        display: inline-block;
        width: 30px;
        cursor: pointer;
        float: right;
        margin: 7px 10px 7px auto;
    }
    .loader {
       width: 100%;
       height: 100px;
    }
    
    .loader img {
       width: 30px;
       margin: 35px calc((100% - 30px) / 2);
    }
    
    .footerTabDiv {
        width: 100%;
        height: 44px;
        position: fixed;
        left: 0px;
        bottom: 0px;
        z-index: 9989;
        box-shadow: 0px -2px 3px 0px rgba(0,0,0,0.2);
    }
    
    .footerTabDiv .footerTab {
        width: 100%;
        height: 44px;
        white-space: nowrap;
        background-color: #D3D3D3;
    }
    
    .footerTabDiv .footerTab .footerTabItem {
        width: calc(100% / 3);
        display: inline-block;
        height: 44px;
        text-align: center;
        box-shadow: 1px 0px 3px 0px rgba(0,0,0,0.2);
        cursor: pointer;
    }
    
    .footerTabDiv .footerTab .footerTabItem img {
        width: 20px;
    }
    
    .footerTabDiv .footerTab .footerTabItem p {
        font-size: 12px;
        color: #2B2B2B;
        word-wrap: break-word;
        font-weight: 400;
        line-height: 14px;
    }
    .auto-hide-header {
        position: fixed;
        z-index: 2;
        top: 0;
        left: 0;
        width: 100%;
        height: 44px;
        line-height: 44px;
        background-color: #ffffff;
        border-bottom: 1px solid #ddd;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        will-change: transform;
        -webkit-transition: -webkit-transform .5s;
        transition: -webkit-transform .5s;
        transition: transform .5s;
        transition: transform .5s, -webkit-transform .5s;
    }
    .auto-hide-header::after {
        clear: both;
        content: "";
        display: block;
    }
    .auto-hide-header.is-hidden {
        -webkit-transform: translateY(-100%);
        -ms-transform: translateY(-100%);
        transform: translateY(-100%);
    }
    .primary-nav {
        height: 44px;
    }
    .secondary-nav {
        position: relative;
        z-index: 1;
        height: 40px;
        overflow: hidden;
        clear: both;
        background-color: #25283D;
        border-bottom: 1px solid #EEAD0E;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
        will-change: transform;
        -webkit-transition: -webkit-transform .5s;
        transition: -webkit-transform .5s;
        transition: transform .5s;
        transition: transform .5s, -webkit-transform .5s;
    }
    .disableScroll {
        position: fixed;
    }
</style>