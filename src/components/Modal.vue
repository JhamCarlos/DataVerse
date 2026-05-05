<template>
  <Teleport to="body">
    <div v-show="isOpen" class="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/40 backdrop-blur-sm"
        @click="closeModal"
      ></div>

      <!-- Modal Content -->
      <div
        class="relative bg-surface-container-lowest rounded-t-3xl md:rounded-3xl w-full md:w-full md:max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg"
      >
        <!-- Header -->
        <div
          class="sticky top-0 flex justify-between items-center px-6 py-4 border-b border-outline-variant/20 bg-[#e6e8eb]"
        >
          <h2 class="text-xl font-bold text-[#00375e]">
            <slot name="title">Modal Title</slot>
          </h2>
          <button
            @click="closeModal"
            class="text-[#516072] hover:text-[#00375e] transition-colors"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Content -->
        <div class="px-6 py-6">
          <slot></slot>
        </div>

        <!-- Footer (optional) -->
        <div
          v-if="$slots.footer"
          class="sticky bottom-0 border-t border-outline-variant/20 bg-surface-container-lowest px-6 py-4 flex gap-3 justify-end"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
