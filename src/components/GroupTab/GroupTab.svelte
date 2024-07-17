<script>
  import { groupTabMock } from "../../mocks/groupTabMock";
  import { selectedTab, listNotes, searchValue } from "../../store/stores";
  import { notesMock } from "../../mocks/notesMock";

  export let tabHasChanged;

  const onButtonClick = (id) => {
    selectedTab.set(id);
    tabHasChanged()
    searchValue.set('')

    const list = notesMock.find(elem => elem.id === id);

    if (list) {
      listNotes.set(list);
    } else {
      console.error('Nenhum elemento encontrado');
    }
  };
</script>

<section class="flex pb-5 gap-4">
  {#each groupTabMock as { label, id }}
    <button
      class={$selectedTab === id && 'active'}
      on:click={() => onButtonClick(id)}
    >
      {label}
    </button>
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

  button:hover {
    @apply bg-neutral-700;
  }

  button.active {
    @apply border-b-2 border-neutral-300;
  }
</style>
