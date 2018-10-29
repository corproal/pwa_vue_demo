<template lang="html">
  <div class="vue-page-animation">
    <transition
      :name="transitionName"
      @before-leave="beforeLeave"
      @before-enter="beforeEnter"
      @after-leave="afterLeave"
      @after-enter="afterEnter"
      @enter-cancelled="cancelAnimation"
      @leave-cancelled="cancelAnimation"
      >
      <slot></slot>
    </transition>
  </div>
</template>

<script>
/** @see https://github.com/linfenpan/vue-page-animation */

import { isSupportHistoryApi } from './config';
import PositionFixer from './position-fixer';
import StateHelper from './state-helper';

export default {
  props: {
    forceTransitionName: {
      default: ''
    },
    driveByUrl: {
      default: false
    },
  },

  data() {
    return { transitionName: 'vue-page-animation-fade' };
  },

  created() {
    this.positionFixer = new PositionFixer({});
    this.stateHelper = new StateHelper(this.driveByUrl);
    this.watchRouter();
  },

  beforeDestroy() {
    this.unwatchRouter();
  },

  activated() {
    this.watchRouter();
  },

  deactivated() {
    this.unwatchRouter();
  },

  methods: {
    watchRouter() {
      if (!this._calculateScroll) {
        this._calculateScroll = (to, fr, next) => {
          this._lastScrollY = window.scrollY || window.pageYOffset || document.body.scrollTop;
          next();
        };
        this.$router.beforeHooks.push(this._calculateScroll);
      }

      if (!this._unwatchRouter) {
        this._unwatchRouter = this.$watch('$route', (to, from) => {
          if (!this._isWatchingRouter) { return; }
          const lastScrollY = this._lastScrollY || 0;
          const stateHelper = this.stateHelper;
          const positionFixer = this.positionFixer;
          
          stateHelper.update();
          stateHelper.saveLastPosition(lastScrollY);

          let transitionName = this.forceTransitionName || '';

          if (!transitionName) {
            if (stateHelper.isPageBack()) {
              transitionName = 'vue-page-animation-right';
            } else if (stateHelper.isPageForward()) {
              transitionName = 'vue-page-animation-left';
            } else {
              transitionName = 'vue-page-animation-fade';
            }
          }

          this.transitionName = transitionName;
        });
      }

      this._isWatchingRouter = true;
    },

    unwatchRouter() {
      if (this._calculateScroll) {
        const hooks = this.$router.beforeHooks;
        const fn = this._calculateScroll;
        if (hooks.indexOf(fn) >= 0) {
          this.$router.beforeHooks.splice(hooks.indexOf(fn), 1);
        }
        this._calculateScroll = null;
      }

      this._isWatchingRouter = false;
    },

    beforeLeave(el) {
      const positionFixer = this.positionFixer;
      const stateHelper = this.stateHelper;

      positionFixer.lockScroll();
      this._leaveFixer = positionFixer.fixElementPos(el, stateHelper.getLastPosition() || 0);
    },

    beforeEnter(el) {
      const positionFixer = this.positionFixer;
      const stateHelper = this.stateHelper;

      let scrollY = null;
      if (stateHelper.isPageBack()) {
        scrollY = el.getAttribute('data-vue-paga-animation-back');
      } else if (stateHelper.isPageForward()) {
        scrollY = el.getAttribute('data-vue-paga-animation-forward');
      }
      scrollY = scrollY || stateHelper.getCurrentPosition();

      positionFixer.lockScroll();
      this._enterFixer = positionFixer.fixElementPos(el, scrollY);
    },

    afterLeave() {
      const positionFixer = this.positionFixer;
      positionFixer.unlockScroll();

      this._leaveFixer && this._leaveFixer.clear();
      this._leaveFixer = null;
    },

    afterEnter(el) {
      const positionFixer = this.positionFixer;
      positionFixer.unlockScroll();

      const isFixWindowScroll = true;
      this._enterFixer && this._enterFixer.clear(isFixWindowScroll);
      this._enterFixer = null;
    },

    cancelAnimation() {
      this.afterLeave();
      this.afterEnter();
    }
  }
}
</script>

<style lang="css">
  .vue-page-animation-lock {
    position: fixed;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .vue-page-animation-router-view {
    width: 100%;
    position: absolute;
    left: 0;
    will-change: left, opacity;
    -webkit-transition-duration: .3s;
    transition-duration: .3s;
    -webkit-transition-property: left, opacity;
    transition-property: left, opacity;
    -webkit-transition-timing-function: cubic-bezier(.55,0,.1,1);
            transition-timing-function: cubic-bezier(.55,0,.1,1);
  }

  .vue-page-animation-left-enter, .vue-page-animation-right-leave-active {
    opacity: 0;
    left: 20px;
  }

  .vue-page-animation-left-leave-active, .vue-page-animation-right-enter {
    opacity: 0;
    left: -20px;
  }

  .vue-page-animation-fade-enter, .vue-page-animation-fade-leave-active {
    opacity: 0;
  }
</style>
