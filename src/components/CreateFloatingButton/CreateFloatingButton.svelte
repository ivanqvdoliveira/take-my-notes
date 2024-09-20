<script>
  export let onClick;
  const onButtonClick = () => {
    onClick()
  }
</script>

<button
  on:click={onButtonClick}
  class="fixed bottom-5 right-5 w-12 h-12 bg-emerald-600 rounded-full shadow-md hover:bg-emerald-900 z-40"
>
  <i class="fas fa-plus text-2xl" />
</button>
