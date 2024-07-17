<script>
  import { onMount } from 'svelte';
  import { selectedTab, listNotes } from '../../store/stores';
  export let seletecdItem = null;
  export let filteredList;
  let selectedName = null;
  let isEdit = false;
  let passwordList = [];
  let form = {};
  let newForm = false;
  let isvisible = false;
  let idPassword = null;
  let copied = false;

  onMount(() => {
    async function fetchData() {
      const notes = $listNotes;

      aggregatePasswords(notes.password);
    }

    fetchData();
  });

  const aggregatePasswords = (passwords) => {
    const safePasswords = passwords || [];
    let id = 0;
    const grouped = safePasswords.reduce((acc, item) => {
      const {password, name, url, observation} = item;
      if (!acc[password]) {
        acc[password] = {
          id: ++id, 
          password, 
          items: [{id: item.id, name, url, observation}]
        };
      } else {
        acc[password].items.push({id: item.id, name, url, observation});
      }
      return acc;
    }, {});

    passwordList = Object.values(grouped);
  }

  const getFormattedPassword = (password) => {
    const halfLength = Math.ceil(password.length / 2);
    return password.substring(0, halfLength) + '*'.repeat(password.length - halfLength);
  }

  const copyText = (text, id) => {
    navigator.clipboard.writeText(text);
    copied = true;
    idPassword = id
    setTimeout(() => {
      copied = false;
      idPassword = null;
    }, 2000);
  }

  const onClickName = (item) => {
    selectedName = item
  }

  const onClickItem = (id) => {
    if (seletecdItem === id) {
      seletecdItem = null;
      return;
    }
    seletecdItem = id;
  };

  const onCancelClick = () => {
    selectedName = null;
  }

  const onEditClick = (password) => {
    isEdit = true;
    form = {
      ...selectedName,
      password
    }
  }

  const onCancelEditClick = () => {
    isEdit = false;
  }

  const onCancelCreateClick = () => {
    newForm = false;
    seletecdItem = null;
  }

  const onCreateClick = (id) => {
    newForm = true;
    seletecdItem = id;
  }

  const toggleVisibility = (id) => {
    isvisible = !isvisible;
    idPassword = id === idPassword ? null : id;
  }
</script>

<section>
  {#if filteredList}
    <div class="container">
      <h2>Resultados</h2>
      <ul class="sub-item server">
        {#if filteredList.length === 0}
          <li>
            <p class="block w-full text-lg text-center py-10 text-orange-400">Nenhum resultado encontrado</p>
          </li>
        {/if}
        {#each filteredList as item}
          <li class="border border-dashed border-neutral-800">
            <h2>{item.name}</h2>
            <div class="p-2 text-base">
              <p>
                <b>Login:</b>
                {item?.login || '-'}
              </p>
              <p class="flex items-center gap-1 relative">
                <b>Senha:</b>
                {isvisible && idPassword === item.id ? item.password : getFormattedPassword(item.password)}
                <button class="icon server" on:click={() => toggleVisibility(item.id)}>
                  <i class="fa-solid fa-eye-slash" />
                </button>
                {#if copied && item.id === idPassword}
                  <div class="copied">copiado</div>
                {/if}
                <button class="icon server" on:click={() => copyText(item.password, item.id)}>
                  <i class="fa-solid fa-copy" />
                </button>
              </p>
              <p>
                <b>Observação:</b>
                {item?.observation || '-'}
              </p>
              <p>
                <b>Url:</b>
                {item?.url || '-'}
              </p>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  {:else}
    {#if $listNotes?.password}
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
                <i class={`fa-solid fa-bars-staggered ${id === seletecdItem && 'text-orange-600'}`} />
              </button>
              <button class="icon" on:click={() => onCreateClick(id)}>
                <i class="fa-solid fa-square-plus text-emerald-700" />
              </button>
            </div>

            {#if newForm && id === seletecdItem}
              <div class="w-full p-3">
                <div>
                  <input type="text" placeholder="Senha" value={password} />
                  <input type="text" placeholder="Nome" value={form?.name || ''} />
                  <input type="text" placeholder="Url" value={form?.url || ''} />
                  <input type="text" placeholder="Obs" value={form?.observation || ''} />
                </div>
                <div class="flex justify-between pt-4">
                  <button class="button cancel" on:click={() => onCancelCreateClick()}>
                    <i class="fa-solid fa-xmark" />
                    Cancelar
                  </button>
                  <button class="button edit">
                    <i class="fa-solid fa-save" />
                    Salvar
                  </button>
                </div>
              </div>
            {/if}

            {#if id === seletecdItem && !newForm}
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
                      <input type="text" placeholder="Senha" value={form.password || ''} />
                      <input type="text" placeholder="Nome" value={form.name || ''} />
                      <input type="text" placeholder="Url" value={form.url || ''} />
                      <input type="text" placeholder="Obs" value={form.observation || ''} />
                    </div>
                    <div class="flex justify-between pt-4">
                      <button class="button cancel" on:click={() => onCancelEditClick()}>
                        <i class="fa-solid fa-xmark" />
                        Fechar
                      </button>
                      <button class="button edit">
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
    {/if}

    {#if $listNotes?.server}
      <div class="container">
        <h2>Servidores</h2>
        {#each $listNotes.server as {
          id, clientName, observation, serviceList
        }}
          <div class="p-2">
            <div class="item-container">
              <span>{clientName}</span>
              <button class="icon">
                <i class="fa-solid fa-eye" />
              </button>
            </div>
            {#if serviceList}
              <ul class="sub-item server">
                {#each serviceList as service}
                  <li class="border border-dashed border-neutral-800">
                    <h2>{service.name}</h2>
                    <div class="p-2 text-base">
                      <p>
                        <b>Login:</b>
                        {service?.login || '-'}
                      </p>
                      <p class="flex items-center gap-1 relative">
                        <b>Senha:</b>
                        {isvisible && idPassword === service.id ? service.password : getFormattedPassword(service.password)}
                        <button class="icon server" on:click={() => toggleVisibility(service.id)}>
                          <i class="fa-solid fa-eye-slash" />
                        </button>
                        {#if copied && service.id === idPassword}
                          <div class="copied">copiado</div>
                        {/if}
                        <button class="icon server" on:click={() => copyText(service.password, service.id)}>
                          <i class="fa-solid fa-copy" />
                        </button>
                      </p>
                      <p>
                        <b>Url:</b>
                        {service?.url || '-'}
                      </p>
                    </div>
                  </li>
                {/each}
                <li>
                  <p>
                    <b class="text-base">Observação:</b>
                    <span>{observation || '-'}</span>
                  </p>
                </li>
              </ul>
            {/if}
          </div>
        {/each}
      </div>
    {/if}

    {#if $listNotes?.others}
      <div class="container">
        <h2>Outros</h2>
        <ul class="sub-item server">
          {#each $listNotes.others as other}
            <li class="border border-dashed border-neutral-800">
              <h2>{other.name}</h2>
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
            </li>
          {/each}
        </ul>
      </div>
    {/if}
  {/if}

</section>


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
        @apply bg-red-600;
      }

      &.edit {
        @apply bg-emerald-700;
      }
    }
  }

  .container {
    @apply border border-solid border-neutral-600 mt-5;
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

    &.server {
      @apply block p-4;

      li {
        @apply w-full mb-3;
      }
    }
  }

  span {
    @apply w-full flex items-center text-neutral-200;
  }

  input {
    @apply w-full p-2 border border-solid border-neutral-600 bg-neutral-700 text-neutral-300 rounded mb-2;
  }
</style>
