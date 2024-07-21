<script>
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { app } from '../firebase';
  import { onMount } from 'svelte';
  import { loadPage } from '../store/stores';

	let url = '/'

	onMount(() => {
  	const auth = getAuth(app);
		onAuthStateChanged(auth, (user) => {
			url = window.location.pathname
			const login = '/login'

			if (auth.currentUser&& url === login) {
					loadPage.set(false)
					window.location.href = '/'
			} else if (!user && url !== login) {
				loadPage.set(true)
				window.location.href = login
			}
		})
	})

	const logout = () => {
		const auth = getAuth(app);
		auth.signOut().then(() => {
			loadPage.set(true)
			window.location.href = '/login'
		}).catch((error) => {
			console.log(error)
		});
	}
</script>

<header>
	<nav>
		{#if url !== '/login'}
			<button class="absolute right-5 text-red-700 top-11" on:click={logout}>
				<i class="fas fa-sign-out-alt" />
			</button>
		{/if}
		<h1 class="text-neutral-300 border-b-2 border-neutral-300 w-full pb-5 mx-4">ANOTAÇÕES</h1>
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
