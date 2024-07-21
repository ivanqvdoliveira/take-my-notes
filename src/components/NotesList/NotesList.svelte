<script>
  import { onMount } from 'svelte';
  import { listNotes, loadPage } from '../../store/stores';
  import OthersList from './components/OthersList.svelte';
  import ServersList from './components/ServersList.svelte';
  import PasswordsList from './components/PasswordsList.svelte';
  import CreateFloatingButton from '../CreateFloatingButton/CreateFloatingButton.svelte';
  export let seletecdItem = null;
  export let filteredList;
  let selectedName = null;
  let isEdit = false;
  let passwordList = [];
  let form = {};
  let newFormPassword = false;
  let isvisible = false;
  let idPassword = null;
  let copied = false;
  let isLoading = true

  onMount(() => {
    async function fetchData() {
      const notes = $listNotes;

      aggregatePasswords(notes.password);
    }

    fetchData();
    isLoading = $loadPage
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
    newFormPassword = false;
    seletecdItem = null;
  }

  const onCreateClick = (id) => {
    newFormPassword = true;
    seletecdItem = id;
  }

  const onAddNewClick = () => {

  }

  const toggleVisibility = (id) => {
    idPassword = id;
    isvisible = !isvisible;
  }
</script>

<section>
  {#if isLoading}
    <div class="flex justify-center items-center gap-5 py-14">
      <i class="fas fa-spinner fa-spin fa-3x text-orange-400"></i>
      <h3 class="text-orange-400">Carregando...</h3>
    </div>
  {:else}
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
        <PasswordsList 
          isvisible={isvisible}
          idPassword={idPassword}
          getFormattedPassword={getFormattedPassword}
          toggleVisibility={toggleVisibility}
          copied={copied}
          copyText={copyText}
          passwordList={passwordList}
          onClickName={onClickName}
          onClickItem={onClickItem}
          selectedName={selectedName}
          isEdit={isEdit}
          onEditClick={onEditClick}
          onCancelEditClick={onCancelEditClick}
          form={form}
          newForm={newFormPassword}
          seletecdItem={seletecdItem}
          onCancelCreateClick={onCancelCreateClick}
          onCreateClick={onCreateClick}
          onCancelClick={onCancelClick}
        />
      {/if}

      {#if $listNotes?.server}
        <ServersList
          isvisible={isvisible}
          idPassword={idPassword}
          getFormattedPassword={getFormattedPassword}
          toggleVisibility={toggleVisibility}
          copied={copied}
          copyText={copyText}
        />
      {/if}

      {#if $listNotes?.others}
        <OthersList
          isvisible={isvisible}
          idPassword={idPassword}
          getFormattedPassword={getFormattedPassword}
          toggleVisibility={toggleVisibility}
          copied={copied}
          copyText={copyText}
        />
      {/if}
    {/if}
  {/if}

  <CreateFloatingButton onClick={onAddNewClick}/>
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

    i {
      font-size: 1.5rem
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

  .sub-item {
    @apply border border-solid border-neutral-600 p-2 text-neutral-300 bg-neutral-600 text-[13px] flex flex-wrap gap-2;

    &.server {
      @apply block p-4;

      li {
        @apply w-full mb-3;
      }
    }
  }
</style>
