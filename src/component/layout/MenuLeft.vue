<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { type MenuItemAny } from "../../provider/menu";

interface Props {
  menuItems: MenuItemAny[];
}

const props = defineProps<Props>();
</script>

<template>
  <menu>
    <li
      v-for="(menuItem, index) in menuItems"
      :key="index"
      :title="menuItem.name"
    >
      <router-link
        :to="menuItem.path"
        :class="{ current: menuItem.path === $route?.path }"
      >
        <FontAwesomeIcon :icon="menuItem.fa" class="square menu-icon" />
        <span class="menu-title">{{ menuItem.name }}</span>
      </router-link>
    </li>
  </menu>
</template>

<style lang="scss" scoped>
menu {
  padding-inline-start: 0;

  li {
    list-style-type: none;
    padding: 0;
    margin: 0;

    a {
      text-decoration: none;
      color: inherit;
      display: block;
      padding: 0.3em 0.3em 0.3em 0;
      border: var(--color-primary) solid;
      border-width: 0 0 0 0.3em;

      &.current {
        background-color: var(--color-primary);
        color: var(--color-primary-complement);
      }

      &:hover,
      &:active {
        background-color: var(--color-secondary);
        color: var(--color-secondary-complement);
        border-left-color: var(--color-secondary-complement);
      }
    }
  }
}

.menu-icon {
  padding: 0 0.5em;
}
</style>
