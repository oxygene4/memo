<template>
  <button class="new-note" @click="handleClick">
    Create new note
    <svg-add />
  </button>
</template>

<script>
import { NEW_NOTE_KEY } from "../../../constants";

export default {
  name: "NewNoteButton",
  methods: {
    handleClick() {
      this.$router.push({
        name: "note",
        params: { id: NEW_NOTE_KEY }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../style/variables";
@import "../../../style/mixins";

.new-note {
  @include empty-button;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 280px;
  margin: 16px;
  padding: 16px 8px;
  border-radius: 4px;
  border: 1px dashed $border-color;
  color: $dark-text;
  font-size: 20px;
  font-family: $montserrat;
  opacity: 0.5;
  transition: $transition-duration ease;
  cursor: pointer;

  @media (max-width: $breakpoint-phone) {
    margin: 8px;
  }

  ::v-deep svg {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 72px;
    margin-top: 16px;
    color: $dark-text;
    transition: $transition-duration ease;
  }

  &:hover {
    opacity: 1;
  }

  &::v-deep:hover svg {
    transform: scale(1.1);
    color: $accent-color;
  }
}
</style>
