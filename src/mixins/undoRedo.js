import { MAX_MUTATION_STACK_SIZE } from "../constants";
import { UPDATE_NOTE } from "../store/mutation-types";
import { copyNote } from "../utils";

export default {
  data() {
    return {
      done: [],
      undone: [],
      newMutation: true,
      unsubscribe: null,
      MAX_MUTATION_STACK_SIZE
    };
  },
  computed: {
    canRedo() {
      return this.undone.length;
    },
    canUndo() {
      return this.done.length;
    }
  },
  created() {
    this.unsubscribe = this.$store.subscribe(mutation => {
      if (mutation.type === UPDATE_NOTE) {
        const { type, payload } = mutation;

        this.done.push({ type, payload: copyNote(payload) });
      }
      if (this.newMutation) {
        this.undone = [];
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    handleUndo() {
    },

    handleRedo() {
    }
  }
};
