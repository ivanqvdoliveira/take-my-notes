<script>
  export let listOfServers;
  export let isvisible;
  export let idPassword;
  export let getFormattedPassword;
  export let toggleVisibility;
  export let copied;
  export let copyText;
</script>

<div class="container">
  <h2>Servidores</h2>
  {#each listOfServers as {
    clientName, observation, services
  }}
    <div class="p-2">
      <div class="item-container">
        <span>{clientName}</span>
      </div>
      {#if services}
        <ul class="sub-item server">
          {#each services as service}
            <li class="border border-dashed border-neutral-800">
              <h2>{service.serviceName}</h2>
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
</style>
