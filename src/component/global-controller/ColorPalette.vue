<script setup lang="ts">
import {
  computeColorsContrastRatio,
  defaultColors,
  getColorNameComplementFromPlainColorName,
  getColorNameFromPlainColorName,
  getCurrentColor,
  HexColorApproximation,
  selectByContrastRatio,
  setColor,
  ValidColorName,
} from "../../provider/color-palette";
import FaIconWrapper from "../FontAwesomeIcon.vue";
import { computed, ComputedRef, Ref, ref } from "vue";
import StatusBox from "../StatusBox.vue";
import { getFlavorItem, StatusBoxFlavorItem } from "../../provider/status-box";

const COLOR_NAME = "color_name";

function applyColor(event: Event) {
  const input = event.target as HTMLInputElement;
  const colorValue = input.value as HexColorApproximation;
  const colorName = input.dataset[COLOR_NAME] as ValidColorName;
  if (!colorName)
    throw new Error(`Data field '${COLOR_NAME}' not found in input element.`);
  setColor(colorName, colorValue);
  recalculateContrast(colorName.replace(/^color-/, "").replace(/-.*/, ""));
}

function createDataAttribute(name: string, value: ValidColorName) {
  return { [`data-${name}`]: value };
}

type ContrastItem = {
  contrast: Ref<number>;
  flavor: ComputedRef<StatusBoxFlavorItem>;
};
type Contrasts = {
  [key: string]: ContrastItem;
};
const contrastsComplement: Contrasts = {};
const contrastsBlack: Contrasts = {};
const contrastsWhite: Contrasts = {};

function recalculateContrast(colorName: keyof typeof defaultColors) {
  const currentColor = getCurrentColor(
    getColorNameFromPlainColorName(colorName)
  );
  const currentComplement = getCurrentColor(
    getColorNameComplementFromPlainColorName(colorName)
  );
  contrastsComplement[colorName].contrast.value = computeColorsContrastRatio(
    currentComplement,
    currentColor
  );
  contrastsBlack[colorName].contrast.value = computeColorsContrastRatio(
    "#000",
    currentColor
  );
  contrastsWhite[colorName].contrast.value = computeColorsContrastRatio(
    "#FFF",
    currentColor
  );
}

function prepareContrastObject(): ContrastItem {
  const contrast = ref(0);
  const flavor: ComputedRef<StatusBoxFlavorItem> = computed(() =>
    getFlavorItem(
      selectByContrastRatio(contrast.value, "success", "warn", "error")
    )
  );
  return { contrast, flavor };
}

for (const colorName of Object.keys(defaultColors)) {
  contrastsComplement[colorName] = prepareContrastObject();
  contrastsBlack[colorName] = prepareContrastObject();
  contrastsWhite[colorName] = prepareContrastObject();
  recalculateContrast(colorName);
}
</script>

<template>
  <div class="content width-full">
    <div
      v-for="colorName in Object.keys(defaultColors)"
      :key="colorName"
      class="row"
    >
      <div
        class="test-field left"
        :class="getColorNameFromPlainColorName(colorName)"
      >
        <label>
          {{ colorName }} color
          <input
            type="color"
            v-bind="
              createDataAttribute(
                COLOR_NAME,
                getColorNameFromPlainColorName(colorName)
              )
            "
            :value="getCurrentColor(getColorNameFromPlainColorName(colorName))"
            @change="applyColor"
          />
        </label>
      </div>
      <div
        class="test-field right"
        :class="getColorNameComplementFromPlainColorName(colorName)"
      >
        <label>
          <input
            type="color"
            v-bind="
              createDataAttribute(
                COLOR_NAME,
                getColorNameComplementFromPlainColorName(colorName)
              )
            "
            :value="
              getCurrentColor(
                getColorNameComplementFromPlainColorName(colorName)
              )
            "
            @change="applyColor"
          />
          color complement for {{ colorName }}
        </label>
      </div>
    </div>
    <div class="row">
      <table>
        <thead>
          <tr>
            <th>Example</th>
            <th>Name</th>
            <th>Contrast ratio</th>
            <th>Example black</th>
            <th>Contrast black</th>
            <th>Example white</th>
            <th>Contrast white</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="colorName in Object.keys(defaultColors)"
            :key="colorName"
            :class="colorName"
          >
            <td :class="colorName">
              <span> Example </span>
            </td>
            <td>{{ colorName }}</td>
            <td
              class="contrast"
              :class="`${contrastsComplement[colorName].flavor.value.name}`"
            >
              <span>
                <FaIconWrapper
                  :icon="contrastsComplement[colorName].flavor.value.icon"
                />
                {{ contrastsComplement[colorName].contrast.value.toFixed(2) }}
              </span>
            </td>
            <td>
              <span :class="`${colorName}-black`">X</span>
              &nbsp;
              <span :class="`black-${colorName}`">X</span>
            </td>
            <td
              class="contrast"
              :class="`${contrastsBlack[colorName].flavor.value.name}`"
            >
              <span>
                <FaIconWrapper
                  :icon="contrastsBlack[colorName].flavor.value.icon"
                />
                {{ contrastsBlack[colorName].contrast.value.toFixed(2) }}
              </span>
            </td>
            <td>
              <span :class="`${colorName}-white`">X</span>
              &nbsp;
              <span :class="`white-${colorName}`">X</span>
            </td>
            <td
              class="contrast"
              :class="`${contrastsWhite[colorName].flavor.value.name}`"
            >
              <span>
                <FaIconWrapper
                  :icon="contrastsWhite[colorName].flavor.value.icon"
                />
                {{ contrastsWhite[colorName].contrast.value.toFixed(2) }}
              </span>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Example</th>
            <th>Name</th>
            <th>Contrast ratio</th>
            <th>Example black</th>
            <th>Contrast black</th>
            <th>Example white</th>
            <th>Contrast white</th>
          </tr>
        </tfoot>
      </table>
    </div>
    <StatusBox box-flavor-name="info" headline-text="Contrast ratio">
      <table>
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>4.5</td>
            <td>bad</td>
          </tr>
          <tr>
            <td>4.5</td>
            <td>7</td>
            <td>meh</td>
          </tr>
          <tr>
            <td>7</td>
            <td>21</td>
            <td>good</td>
          </tr>
        </tbody>
      </table>
    </StatusBox>
  </div>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 1em;
  padding: 1em 0;
}

.row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: stretch;
}

.test-field {
  padding: 0.5em 1em;

  &.left {
    text-align: right;
    width: 40%;
  }

  &.right {
    text-align: left;
    width: 60%;
  }
}

input {
  cursor: pointer;
}

$colorNames: primary, secondary, success, info, warn, error;
@each $colorName in $colorNames {
  .color-#{$colorName} {
    color: var(--color-#{$colorName});
    background-color: var(--color-#{$colorName}-complement);
  }
  .color-#{$colorName}-complement {
    color: var(--color-#{$colorName}-complement);
    background-color: var(--color-#{$colorName});
  }

  td.#{$colorName} {
    background-color: var(--color-#{$colorName});

    span {
      color: var(--color-#{$colorName}-complement);
    }
  }
  span.#{$colorName}-black {
    color: var(--color-#{$colorName});
    background-color: black;
    padding: 0.5em;
  }
  span.#{$colorName}-white {
    color: var(--color-#{$colorName});
    background-color: white;
    padding: 0.5em;
  }
  span.black-#{$colorName} {
    color: black;
    background-color: var(--color-#{$colorName});
    padding: 0.5em;
  }
  span.white-#{$colorName} {
    color: white;
    background-color: var(--color-#{$colorName});
    padding: 0.5em;
  }
}

td,
th {
  padding: 1em;
}
</style>
