<script setup lang="ts">
import { computed, ref } from "vue";
import StatusBox from "./component/StatusBox.vue";
import FontAwesomeIcon from "./component/FontAwesomeIcon.vue";

const defaultView = {
  view: StatusBox,
  properties: {
    headlineText: "This is header",
    boxFlavorName: "info",
    initializeMinimized: false,
  },
};

const routes: { [key: string]: any } = {
  "/": defaultView,
  "/StatusBox": defaultView,
  "/FontAwesomeIcon": {
    view: FontAwesomeIcon,
    properties: { icon: "fas-triangle-exclamation" },
  },
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"].view || StatusBox;
});

const currentProperties = computed(() => {
  return routes[currentPath.value.slice(1) || "/"].properties || StatusBox;
});
</script>

<template>
  <ul v-for="route in Object.keys(routes)" :key="route">
    <li>
      <a :href="`#${route}`">{{ route }}</a>
    </li>
  </ul>
  <StatusBox box-flavor-name="warn" headline-text="head">body</StatusBox>
  <component :is="currentView" v-bind="currentProperties" />
</template>

<style lang="scss" scoped></style>
