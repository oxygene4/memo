<template>
  <form class="form" v-if="note">
    <div class="form__body">
      <div class="form__title">
        <text-area
          v-model="note.title"
          @input="handleChange"
          :max-length="NOTE_TITLE_MAX_LENGTH"
          autofocus
          required
          ref="title"
          placeholder="Type note title here..."
        />
      </div>

      <todo-list v-model="note.todoList" @change="handleChange" />
    </div>

    <form-actions
      :canUndo="canUndo"
      :canRedo="canRedo"
      :canRevert="canRevert"
      :isNewNote="isNewNote"
      @undo="handleUndo"
      @redo="handleRedo"
      @discard="handleDiscard"
      @revert="handleRevert"
      @remove="handleRemove"
      @save="handleSave"
    />

    <confirm-dialog
      v-if="showConfirmDialog"
      :note="note"
      :type="confirmType"
      :on-confirm="onConfirm"
      @cancel="closeConfirmDialog"
    />
  </form>
</template>

<script>
import TodoList from "../components/note/form/TodoList";
import FormActions from "../components/note/form/FormActions";
import { ConfirmDialog, TextArea } from "../components/common";
import undoRedo from "../mixins/undoRedo";
import { mapGetters, mapMutations } from "vuex";
import { NEW_NOTE_KEY } from "../constants";
import { cloneNote, getNoteSchema } from "../utils";
import { SAVE_NOTE, REMOVE_NOTE } from "../store/mutation-types";
import { NOTE_TITLE_MAX_LENGTH, TODO_TEXT_MAX_LENGTH } from "../constants";

export default {
  name: "EditNote",
  components: {
    TodoList,
    FormActions,
    TextArea,
    ConfirmDialog
  },
  mixins: [undoRedo],
  data() {
    return {
      note: {},
      confirmType: "",
      onConfirm: null,
      showConfirmDialog: false,
      NOTE_TITLE_MAX_LENGTH,
      TODO_TEXT_MAX_LENGTH
    };
  },
  computed: {
    ...mapGetters(["getNoteById"]),
    isNewNote() {
      return this.$route.params.id === NEW_NOTE_KEY;
    },
    canRevert() {
      return this.history.length > 1;
    }
  },
  created() {
    this.setNote();
  },
  beforeRouteLeave(to, from, next) {
    if (this.canRevert) {
      this.confirmType = "leave";
      this.showConfirmDialog = true;

      this.onConfirm = () => {
        next();
      };
    } else {
      next();
    }
  },
  methods: {
    ...mapMutations({
      saveNote: SAVE_NOTE,
      removeNote: REMOVE_NOTE
    }),

    handleSave() {
      const isValid = this.$refs.title.validate();

      if (isValid) {
        this.saveNote(this.note);
        this.resetHistory();
        this.navigateToList();
      }
    },

    handleRemove() {
      this.confirmType = "remove";
      this.showConfirmDialog = true;

      this.onConfirm = () => {
        this.removeNote(this.note.id);
        this.resetHistory();
        this.navigateToList();
      };
    },

    handleDiscard() {
      if (this.canRevert) {
        this.confirmType = "discard";
        this.showConfirmDialog = true;

        this.onConfirm = () => {
          this.resetHistory();
          this.navigateToList();
        };
      } else {
        this.navigateToList();
      }
    },

    handleRevert() {
      this.confirmType = "revert";
      this.showConfirmDialog = true;

      this.onConfirm = () => {
        this.closeConfirmDialog();
        this.resetHistory();
        this.note = cloneNote(this.history[this.changeIndex]);
      };
    },

    closeConfirmDialog() {
      this.showConfirmDialog = false;
      this.confirmType = "";
      this.onConfirm = null;
    },

    setNote() {
      const note = this.isNewNote
        ? getNoteSchema()
        : this.getNoteById(this.$route.params.id);

      if (note) {
        this.note = cloneNote(note);
        this.history.push(cloneNote(this.note));
      } else {
        this.navigateToList();
      }
    },

    resetHistory() {
      this.history.splice(1);
      this.changeIndex = 0;
    },

    navigateToList() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped lang="scss">
@import "../style/variables";
@import "../style/mixins";

.form {
  flex-grow: 1;
  &__body {
    background: $default-bg;
    border: 1px solid $border-color;
    max-width: $breakpoint-phone;
    margin: 48px auto 0;
    padding: 32px 16px 16px;
    box-sizing: border-box;

    @media (max-width: $breakpoint-phone) {
      margin: 0;
      border: none;
      background: none;
    }
  }
  &__title {
    margin-bottom: 24px;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
