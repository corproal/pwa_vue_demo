<template>
    <transition name="appMenuModal">
        <div class="appMenuMask">
            <div class="appMenuWrapper">
                <div class="appMenu">
                    <div class="appMenuHeader">
                        <img class="headerClose" src="../assets/description/close-button.png" @click="closePage()"/>
                        <div class="headerTitle">メニュー</div>
                    </div>
                    <div class="appMenuContent">
                        <ul class="appMenuList">
                            <li class="appMenuItem" v-for="(item, index) in menuList" @click="gotoMenuDetail(index)">
                                <div class="appMenuIcon"></div>
                                <p class="appMenuItemTitle">{{ item.title }}</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    name: 'AppMenu',
    data() {
        return {
           menuList: [
               { title: "ユーザー情報設定"},
               { title: "お知らせ・キャンペン"},
               { title: "アンケート"},
               { title: "配信スケジュール設定"},
               { title: "クリップリスト"},
               { title: "論文検索"},
               { title: "MEDYポイント"},
               { title: "利用規約"},
               { title: "よくある質問"},
               { title: "お問い合わせ"},
               { title: "お問い合わせ"},
               { title: "お問い合わせ"},
               { title: "お問い合わせ"}
           ]
        }
    },
    methods: {
        closePage: function() {
            this.$emit("closePage");
        },
        gotoMenuDetail: function() {
            
        }
    }
}
</script>

<style>
.appMenuMask {
    position: fixed;
    z-index: 9990;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: table;
    transition: opacity .3s ease;
}

.appMenuWrapper {
    display: table-cell;
    vertical-align: middle;
}

.appMenu {
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    margin: 0px auto;
    background-color: #FFFFFF;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
    transition: all .3s ease;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}

.appMenuHeader {
    background-color: #CDCDCD;
    width:calc(100vw - 20px);
    height: 44px;
    border-top: 8px solid #20BCC4;
    border-bottom: 3px solid #EEAD0E;
}

.appMenuHeader .headerClose {
    width: 30px;
    margin: 10px auto 10px 15px;
    float: left;
    position: absolute;
    cursor: pointer;
}

.appMenuHeader .headerTitle {
    text-align: center;
    width: 100%;
    line-height: 44px;
    font-size: 20px;
    font-weight: 700;
}

.appMenuContent {
    width: 100%;
    height: calc(100vh - 75px);
    overflow-y: auto;
}

.appMenuContent .appMenuList {
    margin: 0px;
    padding: 0px;
}

.appMenuContent .appMenuList .appMenuItem {
    display: flex;
    padding: 3px;
    height: 60px;
    background: #fff;
    border-bottom: 1px solid #7D7D7D;
    overflow: hidden;
    cursor: pointer;
}

.appMenuModal-enter {
  opacity: 0;
}

.appMenuModal-leave-active {
  opacity: 0;
}

.appMenuModal-enter .appMenu,
.appMenuModal-leave-active .appMenu {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
