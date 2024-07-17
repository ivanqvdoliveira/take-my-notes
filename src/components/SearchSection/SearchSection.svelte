<script>
  import { searchValue } from "../../store/stores";

  export let onChangeSearch;

  const onSearchItem = (value) => {
    onChangeSearch(value);
    searchValue.set(value);
  }

  const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      onChangeSearch(e.target.value);
    }
  }
</script>

<section>
  <div class="relative">
    <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
      <i class="fa-solid fa-magnifying-glass"></i>
    </div>
    <input
      type="text"
      id="email-address-icon"
      class="border text-sm block w-full ps-10 p-2.5 bg-transparent border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
      placeholder="Buscar"
      bind:value={$searchValue}
      on:change={(e) => onSearchItem(e.target.value)}
      on:keypress={(e) => onKeyPress(e)}
    >
    {#if $searchValue}
      <button class="bg-transparent border-none w-10 h-10 absolute top-1 right-0" on:click={() => onSearchItem('')}>
        <i class="fa-solid fa-xmark w-2" />
      </button>
    {/if}
  </div>
</section>
