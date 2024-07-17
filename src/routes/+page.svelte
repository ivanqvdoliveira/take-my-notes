<script>
  import { listNotes } from "../store/stores";
  import GroupTab from "../components/GroupTab/GroupTab.svelte";
  import NotesList from "../components/NotesList/NotesList.svelte";
  import SearchSection from "../components/SearchSection/SearchSection.svelte";

  export let filteredList = '';

  const onChangeSearch = (value) => {
    if (value === '' || !value) {
      filteredList = null
      return
    }

    filteredList = onSearchNotes(value)
  }

  const tabHasChanged = () => {
    filteredList = '';
  }

  const onSearchNotes = (search) => {
    const termo = search.toLowerCase();
    let resultados = [];

    $listNotes?.password && Array.prototype.push.apply(resultados, $listNotes.password.filter(item =>
      item.name && item.name.toLowerCase().includes(termo) ||
      item.password && item.password.toLowerCase().includes(termo) ||
      item?.observation && item.observation.toLowerCase().includes(termo) ||
      item?.url && item.url.toLowerCase().includes(termo)
    ));

    $listNotes?.others && Array.prototype.push.apply(resultados, $listNotes.others.filter(item =>
      item.name && item.name.toLowerCase().includes(termo) ||
      item.login && item.login.toLowerCase().includes(termo) ||
      item.password && item.password.toLowerCase().includes(termo) ||
      item?.observation && item.observation.toLowerCase().includes(termo)
    ));

    $listNotes?.server && $listNotes.server.map(server => {
      Array.prototype.push.apply(resultados, server?.serviceList.filter(item =>
        server.clientName.toLowerCase().includes(termo) ||
        server?.observation && server.observation.toLowerCase().includes(termo) ||
        item.name && item.name.toLowerCase().includes(termo) ||
        item.login && item.login.toLowerCase().includes(termo) ||
        item.password && item.password.toLowerCase().includes(termo) ||
        item?.url && item.url.toLowerCase().includes(termo)
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
	<GroupTab tabHasChanged={tabHasChanged} />
  <SearchSection onChangeSearch={onChangeSearch} />
  <NotesList filteredList={filteredList}/>
</section>
