<template>
  <el-config-provider :locale="currentLocale">
    <router-view :key="key" />
    <ReDialog />
  </el-config-provider>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { ElConfigProvider } from "element-plus";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import { ReDialog } from "@/components/ReDialog";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "app",
  components: {
    [ElConfigProvider.name]: ElConfigProvider,
    ReDialog
  },
  computed: {
    currentLocale() {
      return zhCn;
    }
  },
  setup() {
    const route = useRoute();
    const key = computed(() => {
      return route.path + Math.random();
    });
    return {
      key
    };
  }
});
</script>
