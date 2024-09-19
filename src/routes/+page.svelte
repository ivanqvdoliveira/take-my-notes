<script>
  import { onMount } from 'svelte';
  import { derived } from 'svelte/store';
  import { listNotes, loadPage, isLoading } from "../store/stores";
  import GroupTab from "../components/GroupTab/GroupTab.svelte";
  import NotesList from "../components/NotesList/NotesList.svelte";
  import SearchSection from "../components/SearchSection/SearchSection.svelte";
  import { requestNotes } from '../requests/requestNotes'

  export let filteredList = '';

  let passwordList = [];
  let notFilteredPasswordList = [];
  let serverList = [];
  let othersList = [];

  const setupRequest = async (collection) => {
    return await requestNotes(collection);
  }

  const filteredData = derived(listNotes, $listNotes => {
    if($listNotes.length > 0) {
      const filteredPassword = $listNotes.filter(item => item.type === 'passwords');
      const filteredServer = $listNotes.filter(item => item.type === 'server');
      const filteredOthers = $listNotes.filter(item => item.type === 'others');

      return {filteredPassword, filteredServer, filteredOthers}
    }

    return null
  })

  onMount(() => {
    const unsubscribe = filteredData.subscribe(data => {
      if(data) {
        aggregatePasswords(data.filteredPassword);
        notFilteredPasswordList = data.filteredPassword
        serverList = data.filteredServer
        othersList = data.filteredOthers
      }
    })

    return () => {
      unsubscribe()
    }
  });

  const aggregatePasswords = (passwords) => {
    const safePasswords = passwords || [];
    let id = 0;
    const grouped = safePasswords.reduce((acc, item) => {
      const {password} = item;
      if (!acc[password]) {
        acc[password] = {
          id: ++id, 
          password, 
          items: [{id: item.id, ...item}]
        };
      } else {
        acc[password].items.push({id: item.id, ...item});
      }
      return acc;
    }, {});

    passwordList = Object.values(grouped);
  }


  onMount(async () => {
    if (!$listNotes.length) {
      const newList = await setupRequest('my-personal-notes');
      listNotes.set(newList);
      return
    }
  })

  const onChangeSearch = (value) => {
    if (value === '' || !value) {
      filteredList = null
      return
    }

    filteredList = onSearchNotes(value)
  }

  const tabHasChanged = async (collection) => {
    const newList = await requestNotes(collection);
    listNotes.set(newList);
    filteredList = '';
    loadPage.set(false);
  }

  const onSearchNotes = (search) => {
    const termo = search.toLowerCase();
    let resultados = [];

    Array.prototype.push.apply(resultados, notFilteredPasswordList.filter(item =>
      item.name && item.name.toLowerCase().includes(termo) ||
      item.password && item.password.toLowerCase().includes(termo) ||
      item?.observation && item.observation.toLowerCase().includes(termo) ||
      item?.url && item.url.toLowerCase().includes(termo)
    ));

    serverList.map(server => {
      Array.prototype.push.apply(resultados, server?.services.filter(item =>
        server.clientName.toLowerCase().includes(termo) ||
        server?.observation && server.observation.toLowerCase().includes(termo) ||
        item.serviceName && item.serviceName.toLowerCase().includes(termo) ||
        item.login && item.login.toLowerCase().includes(termo) ||
        item.password && item.password.toLowerCase().includes(termo) ||
        item?.url && item.url.toLowerCase().includes(termo)
      ));

    Array.prototype.push.apply(resultados, othersList.filter(item =>
      item.name && item.name.toLowerCase().includes(termo) ||
      item.login && item.login.toLowerCase().includes(termo) ||
      item.password && item.password.toLowerCase().includes(termo) ||
      item?.observation && item.observation.toLowerCase().includes(termo)
    ));
    })

    return resultados;
  }
</script>

<svelte:head>
  <title>Take My Notes</title>
  <meta name="description" content="Tela de visualização das anotações" />
</svelte:head>

<section>
  {#if $isLoading}
    <div class="loading-container">
      <div class="loader">
        <i class="fa-solid fa-spinner"></i>
      </div>
    </div>
  {:else}
    <GroupTab tabHasChanged={tabHasChanged} />
    <SearchSection onChangeSearch={onChangeSearch} />
    <NotesList
      filteredList={filteredList}
      passwordList={passwordList}
      serverList={serverList}
      othersList={othersList}
    />
  {/if}
</section>

<style lang="scss">
  @keyframes spin {
    0% {
      transform: rotate(0deg);
      @apply text-gray-50;
    }
    100% {
      transform: rotate(360deg);
      @apply text-orange-500;
    }
  }

  .loading-container {
    @apply flex justify-center items-center h-screen w-screen bg-black bg-opacity-50 fixed top-0 left-0;

    .loader {
      font-size: 50px;
      animation: spin 2s linear infinite;
    }
  }
</style>
