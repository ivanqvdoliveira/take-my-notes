<script>
  import db from '../../firebase';
  import {
    addDoc,
    getDocs,
    collection,
  } from 'firebase/firestore';
  import { groupCollection, typeCollection } from '../../store/stores';
  import Select from "../form/Select.svelte";
  import ModalOverlay from "./ModalOverlay.svelte";

  export let onClose;

  let form = {}
  let serviceList = []
  let type = 'default'
  let serviceError = ''
  let submitError = ''
  let successMessage = ''

  const onGroupChange = (value, name) => {
    form = {
      ...form,
      [name]: value
    }
  }

  const onTypeChange = (value, name) => {
    form = {
      ...form,
      [name]: value
    }

    if (value === 'server') {
      type = 'server'
      serviceList = [{
        serviceName: '',
        login: '',
        password: ''
      }]

      return
    }

    type = 'default'
    serviceList = []
  }

  const onFormChange = (e) => {
    const { name, value } = e.target
    form = {
      ...form,
      [name]: value
    }
  }

  const onServerChange = (e, i) => {
    const newArray = [...serviceList]
    const { name, value } = e.target

    newArray[i] = {
      ...newArray[i],
      [name]: value
    }

    form = {
      ...form,
      serviceList: newArray
    }
    serviceList = newArray

  }

  const onCancelEditClick = (e) => {
    e.preventDefault()
    form = {serviceList: []}
    onClose()
  }

  const onAddServiceClick = () => {
    serviceError= ''

    if (serviceList.length > 0) {
      const lastService = serviceList[serviceList.length - 1];

      const allFieldsFilled = Object.values(lastService).every(value => value.trim() !== '');
      if (!allFieldsFilled || !form?.clientName) {
        serviceError = 'Preencha todos os campos do serviço requeridos com *';
        return;
      }
    }

    const defaultServiceList = {
      serviceName: '',
      login: '',
      password: ''
    }

    const newArray = [...serviceList]
    serviceList = [
      ...serviceList,
      defaultServiceList
    ]

    newArray.push(defaultServiceList)
  }

  const onRemoveServiceClick = (i) => {
    const newArray = [...serviceList]
    newArray.splice(i, 1)
    serviceList = newArray
  }

  const deliverySubmission = async (params) => {
    await addDoc(collection(db, "my-notes"), {
      ...params,
      id: crypto.randomUUID(),
    })
      .then(() => {
        successMessage = 'Nota adicionada com sucesso!'

        setTimeout(() => {
          successMessage = ''
          form = {}
          onClose()
        }, 2000)
      })
    ;

  }

  const onSubmitByServer = () => {
    const lastService = serviceList[serviceList.length - 1];

    const allFieldsFilled = Object.values(lastService).every(value => value.trim() !== '');
    if (
      !allFieldsFilled
      || !form?.clientName
      || !form?.group
      || !form?.type
    ) {
      submitError = 'Preencha todos os campos requeridos com *';
      return;
    }

    const params = {
      group: form.group,
      type: form.type,
      clientName: form.clientName,
      services: serviceList,
      observation: form.observation || ''
    }

    deliverySubmission(params)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitError = ''

    if (type === 'server') {
      onSubmitByServer()
      return
    }

    if (!form.group || !form.type || !form.name || !form.password) {
      submitError = 'Preencha todos os campos requeridos com *';
      return;
    }

    const params ={
      group: form.group,
      type: form.type,
      name: form.name,
      password: form.password,
      login: form.login || '',
      url: form.url || '',
      observation: form.observation || ''
    }

    deliverySubmission(params)
  }

</script>

<ModalOverlay>
  <div id="form-modal" data-modal-show="form-modal" tabindex="-1" class="">
    {#if successMessage}
      <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white p-5 rounded-lg">
          <p class="text-green-600">{successMessage}</p>
        </div>
      </div>
    {:else}
      <div class="relative p-4 w-full max-w-md max-h-full">
        <div class="relative rounded-lg shadow bg-zinc-800">
          <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-orange-600 text-center text-orange-600">
            <h3 class="w-full text-xl font-semibold">
              Nova Nota
            </h3>
            <button class="text-red-600 border border-solid border-red-600 rounded w-8 h-8 flex items-center justify-center hover:bg-red-900 hover:bg-opacity-30" on:click={onCancelEditClick}>
              <i class="fa-solid fa-xmark" />
            </button>
          </div>
          <div class="p-3">
            <form>
              <Select
                name="group"
                label="Selecione o Grupo *"
                options={$groupCollection}
                onChangeSelect={onGroupChange}
              />
              <Select
                name="type"
                label="Selecione o Tipo *"
                options={$typeCollection}
                onChangeSelect={onTypeChange}
              />

              {#if type === 'server'}
                <div class="border border-solid border-neutral-600 rounded">
                  <input
                    type="text"
                    class="customized"
                    bind:value={form.clientName}
                    placeholder="Nome do Cliente *"
                    name="clientName"
                    on:change={onFormChange}
                  />
                  <div class="p-3">
                    {#each serviceList as item, i}
                      <div class="border border-solid border-neutral-600 rounded mb-2">
                        <div class="w-full relative">
                          <input
                            class="customized"
                            bind:value={item.serviceName}
                            name="serviceName"
                            type="text"
                            placeholder="Nome do Serviço *"
                            on:change={(e) => onServerChange(e, i)}
                          />
                          {#if i > 0}
                            <button on:click={() => onRemoveServiceClick(i)} class="w-10 h-10 flex justify-center items-center absolute right-1 top-0 hover:bg-red-800 rounded hover:bg-opacity-30">
                              <i class="fa-regular fa-trash-can text-red-600" /> 
                            </button>
                          {/if}
                        </div>
                        <div class="p-3">
                          <input
                            name="login"
                            type="text"
                            bind:value={item.login}
                            placeholder="Login *"
                            on:change={(e) => onServerChange(e, i)}
                          />
                          <input
                            name="password"
                            type="text"
                            bind:value={item.password}
                            placeholder="Senha *"
                            on:change={(e) => onServerChange(e, i)}
                          />
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>

                {#if serviceError}
                  <div class="text-red-600 p-3 border border-solid mt-2 border-red-600">
                    {serviceError}
                  </div>
                {/if}

                <div class="flex w-full justify-end py-5">
                  <button
                    class=" flex items-center gap-3 border rounded-md border-solid border-orange-600 text-orange-600 font-bold px-5 py-2 hover:bg-orange-700 hover:bg-opacity-95 hover:text-white"
                    on:click={onAddServiceClick}
                  >
                    <i class="fas fa-plus" />
                    Adicionar Serviço
                  </button>
                </div>
              {:else}
                <input
                  type="text"
                  name="name"
                  bind:value={form.name}
                  placeholder="Nome *"
                  on:change={onFormChange}
                />
                <input
                  type="text"
                  name="password"
                  bind:value={form.password}
                  placeholder="Senha *"
                  on:change={onFormChange}
                />
                <input
                  type="text"
                  name="login"
                  bind:value={form.login}
                  placeholder="Login"
                  on:change={onFormChange}
                />
                <input
                  type="text"
                  name="url"
                  bind:value={form.url}
                  placeholder="Url"
                  on:change={onFormChange}
                />
              {/if}

              <textarea
                placeholder="Observações"
                name="observation"
                bind:value={form.observation}
                class="mb-0"
                on:change={onFormChange}
              />
            </form>

          {#if submitError}
            <div class="text-red-600 p-3 border border-solid mt-2 border-red-600">
              {submitError}
            </div>
          {/if}

          </div>
          <div class="flex justify-between items-center p-4 md:p-5 border-t rounded-b border-orange-600 text-center text-orange-600">
            <button class="button cancel" on:click={onCancelEditClick}>
              <i class="fa-solid fa-xmark" />
              Cancelar
            </button>
            <button class="button edit" on:click={handleSubmit}>
              <i class="fa-solid fa-save" />
              Salvar
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</ModalOverlay>


<style lang="scss">
  button {
    i {
      font-size: 1.5rem
    }

    &.button {
      background-color: transparent;
      border: none;
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

  input, textarea {
    @apply w-full p-2 border border-solid border-neutral-600 bg-neutral-700 text-neutral-300 rounded mb-2 placeholder-neutral-300;
  }

  input.customized {
    border: none;
    border-bottom: 1px solid;
    border-radius: 4px 4px 0 0;
    @apply border-neutral-600;
  }
</style>
