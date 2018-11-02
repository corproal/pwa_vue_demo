<template>
    <div class="dialog" v-show="showMask">
        <div class="dialog-container">
            <div class="dialog-title">{{title}}</div>
            <div class="content" v-html="content"></div>
            <div class="btns">
                <div v-if="type != 'confirm'" class="default-btn" @click="closeBtn">
                    {{cancelText}}
                </div>
                <div v-if="type == 'danger'" class="danger-btn" @click="dangerBtn">
                    {{dangerText}}
                </div>
                <div v-if="type == 'confirm'" class="confirm-btn" @click="confirmBtn">
                    {{confirmText}}
                </div>
            </div>
            <div class="close-btn" @click="closeMask"><i class="iconfont icon-close"></i></div>
        </div>
        
    </div>
</template>
<script>
export default {
    props: {
        value: {},
        type:{
            type: String,
            default: 'default'
        },
        content: {
            type: String,
            default: ''
        },
        title: {
            type: String,
            default: ''
        },
        cancelText: {
            type: String,
            default: 'キャンセル'
        },
        dangerText: {
            type: String,
            default: '削除'
        },
        confirmText: {
            type: String,
            default: '遑ｮ隶､'
        },
    },
    data(){
        return{
            showMask: false,
        }
    },
    methods:{
        closeMask(){
            this.showMask = false;
        },
        closeBtn(){
            this.$emit('cancel');
            this.closeMask();
        },
        dangerBtn(){
            this.$emit('danger');
            this.closeMask();
        },
        confirmBtn(){
            this.$emit('confirm');
            this.closeMask();
        }
    },
    mounted(){
        this.showMask = this.value;
    },
    watch:{
        value(newVal, oldVal){
            this.showMask = newVal;
        },
        showMask(val) {
            this.$emit('input', val);
        }
    },
}
</script>
<style scoped>
    .dialog{
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9999;
    }
    .dialog .dialog-container {
        width: 90%;
        height: 40%;
        background: #ffffff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 2px;
        position: relative;
    }
    .dialog .dialog-container .dialog-title {
        width: 100%;
        height: 60px;
        font-size: 18px;
        color: #696969;
        font-weight: 600;
        padding: 16px 50px 0 20px;
        box-sizing: border-box;
    }
    .dialog .dialog-container .content{
        color: #797979;
        line-height: 26px;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .dialog .dialog-container .btns{
        width: 100%;
        height: 35px;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: right;
        padding: 0 16px;
        box-sizing: border-box;
    }
    .dialog .dialog-container .btns div{
        display: inline-block;
        line-height: 25px;
        padding: 0 10px;
        color: #ffffff;
        background: #DCDCDC;
        border-radius: 2px;
        margin-right: 8px;
        cursor: pointer;
    }
    .dialog .dialog-container .btns .default-btn{
        color: #787878;
    }
    .dialog .dialog-container .btns .default-btn:hover{
        color: #509EE3;
    }
    .dialog .dialog-container .btns .danger-btn{
        background: #20BCC4;
    }
    .dialog .dialog-container .btns .danger-btn:hover{
        background: #20BCC4;
    }
    .dialog .dialog-container .btns .danger-btn:active{
        background: #20BCC4;
    }
    .dialog .dialog-container .btns .confirm-btn{
        color: #ffffff;
        background: #509EE3;
    }
    .dialog .dialog-container .btns .confirm-btn:hover{
        background: #6FB0EB;
    }
    .dialog .dialog-container .close-btn{
        position: absolute;
        top: 16px;
        right: 16px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        font-size: 18px;
        cursor: pointer;
    }
    .dialog .dialog-container .close-btn:hover{
        font-weight: 600;
    }
</style>