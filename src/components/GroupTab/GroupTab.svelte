<script>
  import {
    selectedTab,
    searchValue,
    groupCollection,
    loadPage
  } from "../../store/stores";

  export let tabHasChanged;

  const onButtonClick = (value) => {
    loadPage.set(true);
    selectedTab.set(value);
    tabHasChanged(value)
    searchValue.set('')
  };
</script>

<section class="flex pb-5 gap-4">
  {#each $groupCollection as { label, value }}
    {#if $loadPage}
      <div class="fake-button">
        <i class="fa-solid fa-spinner loader" />
      </div>
    {:else}
      <button
        class={$selectedTab === value && 'active'}
        on:click={() => onButtonClick(value)}
      >
        {label}
      </button>
    {/if}
  {/each}
</section>

<style lang="scss">
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 10px 10px 0 0;
    line-height: 1.5;
    padding: 0.5rem 1rem;
    border-bottom: 2px solid transparent;

    @apply text-neutral-300;
  }

  .fake-button {
    @apply bg-transparent;
    border-radius: 10px 10px 0 0;
    line-height: 1.5;
    padding: 0.5rem 1rem;
    border-bottom: 2px solid transparent;
    min-width: 90px;
    text-align: center;
  }

  button:hover {
    @apply bg-neutral-700;
  }

  .loader {
    font-size: 1rem;
    animation: spin 2s linear infinite;
  }

  button.active {
    @apply border-b-2 border-neutral-300;
  }
</style>
