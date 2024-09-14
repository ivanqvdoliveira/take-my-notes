<div class="modal-overlay">
  <slot></slot>
</div>

<style lang="scss">
  .modal-overlay {
    @apply bg-zinc-900 bg-opacity-90 fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center w-full overflow-y-auto overflow-x-hidden z-50 md:inset-0 h-full max-h-screen;
  }
</style>
