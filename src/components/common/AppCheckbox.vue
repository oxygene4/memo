<template>
  <label
    class="checkbox"
    :class="{ disabled, checked }"
    @keypress.enter="checked = !checked"
  >
    <transition name="checkbox" mode="out-in">
      <span class="checkbox__icon" :key="checked">
        <svg-checked v-if="checked" />
        <svg-circle v-else />
      </span>
    </transition>

    <input
      class="checkbox__input"
      type="checkbox"
      v-model="checked"
      :disabled="disabled"
    />
  </label>
</template>

<script>
export default {
  name: "AppCheckbox",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    checked: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/variables";

.checkbox {
  position: relative;
  width: 34px;
  height: 34px;
  cursor: pointer;
  user-select: none;
  outline-offset: -1px;
  &.disabled {
    pointer-events: none;
  }

  &::v-deep svg {
    color: $primary-color;
  }

  &.checked::v-deep svg {
    color: $accent-color;
  }

  &:focus-within {
    outline: 1px solid $outline-color;
  }

  &__icon {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    width: 24px;
    height: 24px;
    margin: auto;
    flex-grow: 1;
  }

  &__input {
    width: 0;
    height: 0;
    opacity: 0;
  }
}
</style>
