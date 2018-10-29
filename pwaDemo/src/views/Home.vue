<template>
  <div class="home" style="padding-bottom: 44px;">
    <ArticleList/>
  </div>
</template>

<script>
// @ is an alias to /src
import ArticleList from '@/components/ArticleList.vue'

export default {
  name: 'home',
  components: {
    ArticleList
  }
}
</script>
