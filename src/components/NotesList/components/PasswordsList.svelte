<script>
  export let passwordList;
  export let isvisible;
  export let idPassword;
  export let getFormattedPassword;
  export let toggleVisibility;
  export let copied;
  export let copyText;
  export let selectedItem;
  export let onClickItem;
  export let selectedName;
  export let onClickName;
  export let isEdit;
  export let onEditClick;
  export let onCancelEditClick;
  export let newForm;
  export let onCreateClick;
  export let onCancelCreateClick;
  export let onCancelClick;
  export let form;
  export let onSavePasswordClick;
  export let onChangeInpunt;
  export let submitError;
  export let onSaveEditClick;
</script>

<div class="container">
  <h2>Senhas</h2>
  {#each passwordList as { password, items, id }}
    <div class="p-2">
      <div class="item-container">
        <span>{
          isvisible && idPassword === id ? password : getFormattedPassword(password)
        }</span>
        {#if copied && id === idPassword}
          <div class="copied">copiado</div>
        {/if}
        <button class="icon" on:click={() => copyText(password, id)}>
          <i class="fa-solid fa-copy" />
        </button>
        <button class="icon" on:click={() => toggleVisibility(id)}>
          <i class="fa-solid fa-eye-slash" />
        </button>
        <button on:click={() => onClickItem(id)}>
          <i class={`fa-solid fa-bars-staggered ${id === selectedItem && !newForm && 'text-orange-600'}`} />
        </button>
        <button class="icon" on:click={() => onCreateClick(id)}>
          <i class="fa-solid fa-square-plus text-emerald-700" />
        </button>
      </div>

      {#if newForm && id === selectedItem}
        <div class="w-full p-3">
          <div>
            <input
              type="text"
              readonly
              placeholder="Senha"
              value={password}
            />
            <input
              type="text"
              name="name"
              placeholder="Nome *"
              value={form?.name || ''}
              on:change={onChangeInpunt}
            />
            <input
              type="text"
              name="url"
              placeholder="Url"
              value={form?.url || ''}
              on:change={onChangeInpunt}
            />
            <input
              type="text"
              name="observation"
              placeholder="Obs"
              value={form?.observation || ''}
              on:change={onChangeInpunt}
            />
            {#if submitError}
              <span class="text-red-600 p-3 border border-solid mt-2 border-red-600 error">{submitError}</span>
            {/if}
          </div>
          <div class="flex justify-between pt-4">
            <button class="button cancel" on:click={() => onCancelCreateClick()}>
              <i class="fa-solid fa-xmark" />
              Cancelar
            </button>
            <button class="button edit" on:click={() => onSavePasswordClick(password)}>
              <i class="fa-solid fa-save" />
              Salvar
            </button>
          </div>
        </div>
      {/if}

      {#if id === selectedItem && !newForm}
        <ul class="sub-item">
          {#if selectedName && !isEdit}
            <div class="w-full p-3">
              <div class="text-base">
                <p><b>Nome:</b> {selectedName.name}</p>
                <p><b>Url:</b> {selectedName.url}</p>
                <p><b>Obs:</b> {selectedName.observation}</p>
              </div>
              <div class="flex justify-between pt-4">
                <button class="button cancel" on:click={() => onCancelClick()}>
                  <i class="fa-solid fa-xmark" />
                  Fechar
                </button>
                <button class="button edit" on:click={() => onEditClick(password)}>
                  <i class="fa-regular fa-pen-to-square" />
                  Editar
                </button>
              </div>
            </div>
          {:else if selectedName && isEdit}
            <div class="w-full p-3">
              <div>
                <input
                  type="text"
                  name="password"
                  placeholder="Senha"
                  value={form.password || ''}
                  on:change={onChangeInpunt}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Nome *"
                  value={form.name || ''}
                  on:change={onChangeInpunt}
                />
                <input
                  type="text"
                  name="url"
                  placeholder="Url"
                  value={form.url || ''}
                  on:change={onChangeInpunt}
                />
                <input
                  type="text"
                  name="observation"
                  placeholder="Obs"
                  value={form.observation || ''}
                  on:change={onChangeInpunt}
                />
              </div>
              <div class="flex justify-between pt-4">
                <button class="button cancel" on:click={onCancelEditClick}>
                  <i class="fa-solid fa-xmark" />
                  Fechar
                </button>
                <button class="button edit" on:click={onSaveEditClick}>
                  <i class="fa-solid fa-save" />
                  Salvar
                </button>
              </div>
            </div>
          {:else}
            {#each items as item}
              <li>
                <button
                  class="pass-item"
                  on:click={() => onClickName(item)}
                >{item.name}</button>
              </li>
            {/each}
          {/if}
        </ul>
      {/if}

    </div>
  {/each}
</div>

<style lang="scss">
  button {
    background-color: transparent;
    border: none;

    &.icon {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &.pass-item {
      display: inline-block;
      @apply text-neutral-200 hover:bg-neutral-500 rounded p-2;
    }

    i {
      font-size: 1.5rem
    }

    &.button {
      @apply bg-neutral-700 text-neutral-300 p-2 rounded;

      i {
        font-size: 0.8rem;
      }

      &.cancel {
        @apply bg-red-600 hover:bg-red-800;
      }

      &.edit {
        @apply bg-emerald-700 hover:bg-emerald-800;
      }
    }
  }

  .container {
    @apply border border-solid border-neutral-600 mt-5 mx-auto;
  }

  .copied {
    @apply p-1 bg-orange-200 border border-orange-500 text-orange-500 font-bold text-sm rounded absolute left-3 top-[-25px];

    &::after {
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid rgb(249 115 22);
      top: 100%;
      left: 50%;
      transform: translateX(-50%);}
  }

  h2 {
    @apply border-b border-neutral-600 p-2 font-bold bg-neutral-800 text-neutral-300 text-lg;
  }

  .item-container {
    @apply flex gap-3 align-middle border border-solid border-neutral-600 p-2 text-neutral-400 bg-neutral-700 relative;
  }

  .sub-item {
    @apply border border-solid border-neutral-600 p-2 text-neutral-300 bg-neutral-600 text-[13px] flex flex-wrap gap-2;
  }

  span {
    @apply w-full flex items-center text-neutral-200;

    &.error {
      @apply text-red-600;
    }
  }

  input {
    @apply w-full p-2 border border-solid border-neutral-600 bg-neutral-700 text-neutral-300 rounded mb-2;
  }
</style>
