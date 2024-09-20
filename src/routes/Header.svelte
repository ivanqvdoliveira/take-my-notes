<script>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import db from "../firebase";
  import { getDocs, collection } from "firebase/firestore";
  import { app } from "../firebase";
  import { onMount } from "svelte";
  import {
    loadPage,
    groupCollection,
    typeCollection,
    selectedTab,
    isLoading,
  } from "../store/stores";

  let url = "/";

  onMount(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      url = window.location.pathname;
      const login = "/login";
      isLoading.set(false);

      console.log("user", user);

      if (user && url === login) {
        loadPage.set(false);
        window.location.href = "/";
      } else if (!user && url !== login) {
        loadPage.set(true);
        window.location.href = login;
      }
    });
  });

  onMount(async () => {
    const groupRef = collection(db, "my-groups");
    const typeRef = collection(db, "my-types");
    let groupList = [];

    const [groupSnapshot, typeSnapshot] = await Promise.all([
      getDocs(groupRef),
      getDocs(typeRef),
    ]);

    groupList = groupSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    groupCollection.set(groupList);
    selectedTab.set(groupList[0].value);

    typeCollection.set(
      typeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    );
  });

  const logout = () => {
    const auth = getAuth(app);
    auth
      .signOut()
      .then(() => {
        loadPage.set(true);
        window.location.href = "/login";
      })
      .catch((error) => {
        console.error(error);
      });
  };
</script>

<header>
  <nav>
    {#if url !== "/login"}
      <button class="absolute right-5 text-red-700 top-11" on:click={logout}>
        <i class="fas fa-sign-out-alt" />
      </button>
    {/if}
    <h1 class="text-neutral-300 border-b-2 border-neutral-300 w-full pb-5 mx-4">
      ANOTAÇÕES
    </h1>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
  }

  nav {
    display: flex;
    padding-top: 30px;
    width: 100%;
    justify-content: center;
  }
</style>
