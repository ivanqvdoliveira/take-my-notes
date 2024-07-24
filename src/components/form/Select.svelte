<script>
  export let label
  export let options
  export let onChangeSelect
  export let name

  let selected = label
  let showOptions = false

  const handleSelect = (e, item, name) => {
    e.preventDefault()
    selected = item.label
    showOptions = false
    onChangeSelect(item.value, name)
  }

  const handleShowOptions = (e) => {
    e.preventDefault()
    showOptions = !showOptions
  }
</script>

<div class="mb-2 relative">
  <div class="flex w-full border border-solid border-neutral-600 bg-neutral-700 text-neutral-300 rounded h-10 justify-between items-center">
    <button
      on:click={handleShowOptions}
      class="w-5/6 p-2 text-left"
      type="button"
    >
      {selected}
    </button>
    <button on:click={handleShowOptions} class="w-10 h-10 border-l border-solid border-neutral-600">
      <i class="fa-solid fa-chevron-down" />
    </button>
  </div>
  {#if showOptions}
    <div class="grid grid-cols-1 gap-[1px] w-full bg-zinc-700 border border-solid border-zinc-700 rounded absolute top-full left-0 shadow-md z-50">
      {#each options as item}
        <button on:click={(e) => handleSelect(e, item, name)} class="w-full text-left px-5 py-3 bg-zinc-800" value={item.value}>{item.label}</button>
      {/each}
      {#if options.length <= 2}
        <button class="w-full text-left px-5 py-3 bg-zinc-800">+ Adicionar</button>
      {/if}
    </div>
  {/if}
</div>
