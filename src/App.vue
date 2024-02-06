<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { setDefaultColors } from "./provider/color-palette";
import * as Z_INDEX from "./provider/z-index";
import MenuLeft from "./component/layout/MenuLeft.vue";
import { MENU } from "./provider/menu";
import MenuTopRight from "./component/layout/MenuTopRight.vue";
import BrandLogo from "./component/layout/BrandLogo.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBars, faChevronDown } from "@fortawesome/free-solid-svg-icons";

// window size for responsiveness
const windowSize = ref(window.innerWidth);
const eventListenerType = "resize";
const resizeEventListener = () => {
  const origCompactView = compactView.value;
  windowSize.value = window.innerWidth;
  const newCompactView = compactView.value;
  if (origCompactView !== newCompactView) {
    leftMenuVisible.value = !compactView.value;
  }
};
onMounted(() =>
  window.addEventListener(eventListenerType, resizeEventListener),
);
onBeforeUnmount(() =>
  window.removeEventListener(eventListenerType, resizeEventListener),
);

const compactView = computed(() => windowSize.value < 1024);

// view toggles
const leftMenuVisible = ref(!compactView.value);
const rightMenuVisible = ref(false);

function toggleLeftMenu() {
  leftMenuVisible.value = !leftMenuVisible.value;
}

function toggleRightMenu() {
  rightMenuVisible.value = !rightMenuVisible.value;
}

function hideLeftMenu() {
  leftMenuVisible.value = false;
}

function hideRightMenu() {
  rightMenuVisible.value = false;
}

function hideLeftMenuIfCompact() {
  if (!compactView.value) return;
  hideLeftMenu();
}

setDefaultColors();
</script>

<template>
  <div class="layout">
    <header :style="`z-index: ${Z_INDEX.HEADER}`">
      <span class="icon-button" @click="toggleLeftMenu">
        <FontAwesomeIcon
          :icon="faBars"
          :title="`${leftMenuVisible ? 'Hide' : 'Show'} main menu`"
        />
      </span>
      <div class="logo">
        <BrandLogo />
      </div>
      <span class="icon-button" @click="toggleRightMenu">
        <FontAwesomeIcon
          :icon="faChevronDown"
          :title="`${rightMenuVisible ? 'Hide' : 'Show'} quick menu`"
        />
      </span>
    </header>
    <div
      class="backdrop right-menu-backdrop"
      :class="{ hidden: !rightMenuVisible }"
      :style="`z-index: ${Z_INDEX.RIGHT_MENU_BACKDROP}`"
      @click="hideRightMenu"
    />
    <MenuTopRight
      class="menu-content right-menu-content"
      :class="{ hidden: !rightMenuVisible, compact: compactView }"
      :style="`z-index: ${Z_INDEX.RIGHT_MENU}`"
    />
    <div class="left-and-main" :class="{ compact: compactView }">
      <div
        class="backdrop left-menu-backdrop"
        :class="{
          hidden: !(leftMenuVisible && compactView),
          compact: compactView,
        }"
        :style="`z-index: ${Z_INDEX.LEFT_MENU_BACKDROP}`"
        @click="hideLeftMenu"
      />
      <nav
        class="menu-content left-menu-content"
        :class="{ hidden: !leftMenuVisible, compact: compactView }"
        :style="`z-index: ${Z_INDEX.LEFT_MENU}`"
        @click="hideLeftMenuIfCompact"
      >
        <MenuLeft :menu-items="JSON.parse(JSON.stringify(MENU))" />
      </nav>
      <div class="main-and-notifications">
        <div
          class="notifications-backdrop"
          :style="`z-index: ${Z_INDEX.NOTIFICATIONS}`"
        >
          <p>test</p>
          <p>test</p>
          <p>test test test test test test test test</p>
        </div>
        <main :style="`z-index: ${Z_INDEX.MAIN_CONTENT}`">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in" appear>
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
    <!-- <footer> </footer> -->
  </div>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  height: 100vh;
}

$headerHeight: 3rem;
$headerBorderBottom: 1px;

header {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  height: $headerHeight;
  width: 100%;
  position: sticky;
  top: 0;
  border-bottom: var(--color-secondary) solid $headerBorderBottom;
  background-color: var(--color-primary);
  color: var(--color-primary-complement);

  .icon-button {
    aspect-ratio: 1 / 1;
    cursor: pointer;

    &:first-child {
      border-right: var(--color-secondary) solid 1px;
    }

    &:last-child {
      border-left: var(--color-secondary) solid 1px;
    }

    svg {
      $padding: 25%;
      height: calc(100% - 2 * $padding);
      padding: $padding;
    }

    &:hover {
      background-color: var(--color-secondary);
      color: var(--color-secondary-complement);
    }
  }

  .logo {
    margin-left: 20px;
    margin-right: 20px;
    width: 100%;
    height: 80%;
    font-size: calc($headerHeight * 0.8);
  }
}

header > * {
  height: 100%;
}

.menu-content,
.backdrop {
  transition: all 300ms ease;

  &.hidden {
    visibility: hidden;
    opacity: 0;
  }

  &:not(.hidden) {
    visibility: visible;
    //opacity: 100%; // 50% for backdrop
  }
}

.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-secondary);
  opacity: 50%;
}

.menu-content {
  color: initial;
  background-color: Window;
  border: var(--color-secondary) solid;
  max-height: calc(100vh - $headerHeight - $headerBorderBottom);
  box-shadow: 0 1em 2em 0 var(--color-secondary);

  &.hidden {
    transform: scaleX(0);
  }

  &:not(.hidden) {
    transform: scaleX(1);
  }

  &.compact {
    left: 0;
  }

  &.compact,
  &.right-menu-content {
    border-width: 1px 0 1px 0;
    position: absolute;
    top: calc($headerHeight + $headerBorderBottom);
    right: 0;
  }

  &.left-menu-content {
    transform-origin: left;
    min-width: 15em;
    white-space: nowrap;
    overflow-x: hidden;
    overflow-y: auto;

    &:not(.compact) {
      border-width: 0 1px 0 0;
      box-shadow: none;

      &.hidden {
        min-width: 0;
        width: 0;
      }
    }
  }

  &.right-menu-content {
    transform-origin: right;
    display: flex;
    min-width: 15em;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: flex-end;
    gap: 0.5em;
    padding: 0.5em;
  }
}

.left-and-main {
  height: 100%;
  width: 100%;

  &.compact {
    display: block;
  }

  &:not(.compact) {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
  }

  .main-and-notifications {
    position: relative;
    width: 100%;
    height: calc(100vh - $headerHeight - $headerBorderBottom);

    main {
      padding: 1em;
      box-sizing: border-box;
      overflow: auto;
      max-height: calc(100vh - $headerHeight - $headerBorderBottom);

      .fade-enter-active,
      .fade-leave-active {
        transition: all 300ms ease;
      }

      .fade-enter-from,
      .fade-leave-to {
        opacity: 0;
      }
    }

    .notifications-backdrop {
      position: absolute;
      top: 0;
      right: 1em;

      display: flex;
      flex-direction: column;
      align-items: flex-end;
      align-content: flex-end;
      justify-content: flex-start;

      pointer-events: none;

      & > * {
        background-color: grey; // TODO: get the same color as the body background (initial=transparent)
        margin: 1em;
        pointer-events: auto;
      }
    }
  }
}
</style>
