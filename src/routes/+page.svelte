<script>
  import GroupTab from "../components/GroupTab/GroupTab.svelte";
  import NotesList from "../components/NotesList/NotesList.svelte";
  import SearchSection from "../components/SearchSection/SearchSection.svelte";

  let tabSelected = 9

  const updateTabSelected = (id) => {
    tabSelected = id
  }
</script>

<svelte:head>
  <title>Take My Notes</title>
  <meta name="description" content="Tela de visualização das anotações" />
</svelte:head>

<section>
	<GroupTab tabSelected={tabSelected} onUpdateTabSelected={updateTabSelected} />
  <SearchSection />
  <NotesList tabSelected={tabSelected} />
</section>
