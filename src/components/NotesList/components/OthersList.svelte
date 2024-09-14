<script>
  export let listOfOthers;
  export let isvisible;
  export let idPassword;
  export let getFormattedPassword;
  export let toggleVisibility;
  export let copied;
  export let copyText;
  export let onEditClick;
  export let isEditOrder;
  export let onFormChange
  export let onClose
  export let onSaveOthersClick
</script>

<div class="container">
  <h2>Outros</h2>
  <ul class="sub-item server">
    {#each listOfOthers as other}
      <li class="border border-dashed border-neutral-800">
        {#if isEditOrder?.status && isEditOrder?.other?.id === other.id}
          <div class="border border-orange-300 p-2">
            <div class="item-container">
              <input
                type="text"
                name="name"
                bind:value={other.name}
                placeholder="Nome *"
                on:change={onFormChange}
                on:change={onFormChange}
              />
            </div>
            <div class="p-2 text-base">
              <input
                type="text"
                name="password"
                bind:value={other.password}
                placeholder="Senha *"
                on:change={onFormChange}
              />
              <input
                type="text"
                name="login"
                bind:value={other.login}
                placeholder="Login"
                on:change={onFormChange}
              />
              <input
                type="text"
                name="url"
                bind:value={other.url}
                placeholder="Url"
                on:change={onFormChange}
              />
              <textarea
                placeholder="Observações"
                name="observation"
                bind:value={other.observation}
                class="mb-0"
                on:change={onFormChange}
              />
            </div>
            <div class="flex justify-between pt-4">
              <button class="button cancel" on:click={() => onClose()}>
                <i class="fa-solid fa-xmark" />
                Cancelar
              </button>
              <button class="button edit" on:click={() => onSaveOthersClick(other)}>
                <i class="fa-solid fa-save" />
                Salvar
              </button>
            </div>

          </div>
        {:else}
          <div class="item-container">
            <span>{other.name}</span>
            <button class="button" on:click={() => onEditClick(other)}>
              <i class="fa-regular fa-pen-to-square" />
            </button>
          </div>

          <div class="p-2 text-base">
            <p>
              <b>Login:</b>
              {other?.login || '-'}
            </p>
            <p class="flex items-center gap-1 relative">
              <b>Senha:</b>
              {isvisible && idPassword === other.id ? other.password : getFormattedPassword(other.password, other.id)}
              <button class="icon server" on:click={() => toggleVisibility(other.id)}>
                <i class="fa-solid fa-eye-slash" />
              </button>
              {#if copied && other.id === idPassword}
                <div class="copied">copiado</div>
              {/if}
              <button class="icon server" on:click={() => copyText(other.password, other.id)}>
                <i class="fa-solid fa-copy" />
              </button>
            </p>
            <p>
              <b>Observação:</b>
              {other?.observation || '-'}
            </p>
          </div>
        {/if}
      </li>
    {/each}
  </ul>
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

      &.server {
        i {
          @apply text-sm;
        }
      }
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
    @apply border border-solid border-neutral-600 mt-5  mx-auto;
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

  .item-container {
    @apply flex justify-between align-middle border border-solid border-neutral-600 p-2 text-neutral-400 bg-neutral-700 relative;
  }

   span {
    @apply p-2 font-bold text-neutral-300 text-lg;
  }

  .sub-item {
    @apply border border-solid border-neutral-600 p-2 text-neutral-300 bg-neutral-600 text-[13px] flex flex-wrap gap-2;

    &.server {
      @apply block p-4;

      li {
        @apply w-full mb-3;
      }
    }
  }

  input, textarea {
    @apply w-full p-2 border border-solid border-neutral-600 bg-neutral-700 text-neutral-300 rounded mb-2 placeholder-neutral-300;
  }

  h2 {
    @apply border-b border-neutral-600 p-2 font-bold bg-neutral-800 text-neutral-300 text-lg;
  }
</style>
