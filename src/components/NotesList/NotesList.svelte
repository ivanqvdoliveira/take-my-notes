<script>
  import { listNotes, loadPage, selectedTab } from '../../store/stores';
  import OthersList from './components/OthersList.svelte';
  import ServersList from './components/ServersList.svelte';
  import PasswordsList from './components/PasswordsList.svelte';
  import CreateFloatingButton from '../CreateFloatingButton/CreateFloatingButton.svelte';
  import FormModal from '../modals/FormModal.svelte';  
  import { v4 as uuidv4 } from "uuid";
  import { addNotes } from '../../requests/addNotes';
  import { requestNotes } from '../../requests/requestNotes';
  import { updateNotes } from '../../requests/updateNotes';
  import { deleteNote } from '../../requests/deleteNote';

  export let selectedItem = null;
  export let filteredList;
  export let passwordList;
  export let serverList;
  export let othersList;

  let selectedName = null;
  let isEdit = false;
  let form = {};
  let newFormPassword = false;
  let isvisible = false;
  let idPassword = null;
  let copied = false;
  let showModal = false
  let submitError = ''
  let editServer = {isEdit: false}
  let successMsg = ''
  let isEditOrder = {};

  const noteId = uuidv4();

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
    if (selectedItem === id) {
      selectedItem = null;
      return;
    }
    selectedItem = id;
  };

  const handleChangeInpunt = (e) => {
    submitError = ''

    const { name, value } = e.target;
    form = {
      ...form,
      [name]: value
    }
  }

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
    selectedItem = null;
  }

  const onCreateClick = (id) => {
    newFormPassword = true;
    selectedItem = id;
  }

  const onAddNewClick = () => {
    showModal = true;
  }

  const toggleVisibility = (id) => {
    idPassword = id;
    isvisible = !isvisible;
  }

  const updateBeforeChange = async () => {
    const newList = await requestNotes($selectedTab);
    listNotes.set(newList);
    showModal = false;

    setTimeout(() => {
      successMsg = '';
      form = {};
      newFormPassword = false;
      selectedName = null;
      selectedItem = null;
      isEdit = false;
      idPassword = null;
      isvisible = false;
      isEditOrder = {};
    }, 2000);
  }

  const onEditServerClick = (clientName, observation, services, docId) => {
    editServer = {
      form: {
        clientName,
        observation,
        services,
      },
      docId,
      type: 'server',
      isEdit: true
    }
    showModal = true;
  }

  const onEditOtherClick = (other) => {
    isEditOrder = {
      status: true,
      other
    }
    form = {
      name: other.name,
      password: other.password,
      login: other.login,
      url: other.url,
      observation: other.observation
    }
  }

  const handleChangeOthers = (e) => {
    submitError = ''

    const { name, value } = e.target;
    form = {
      ...form,
      [name]: value
    }
  }

  const handleCloseOthers = () => {
    isEditOrder = {};
  }

  const handleSaveOthers = async (other) => {
    if (!form.name || !form.password) {
      submitError = 'Preencha os campos Nome e Senha';
      return;
    }
    
    const params = {
      ...other,
      ...form
    }

    try {
      await updateNotes($selectedTab, params);

      successMsg = 'Outros Editado com Sucesso';

      updateBeforeChange()
    } catch (error) {
      submitError = 'Erro ao editar outros';
    }
  }

  const handleSaveNewPassword = async (password) => {
    if (!form.name) {
      submitError = 'Preencha o campo nome';
      return;
    }

    const params = {
      id: noteId,
      group: $selectedTab,
      type: 'passwords',
      name: form.name,
      password: password,
      url: form.url || '',
      observation: form.observation || ''
    }

    try {
      await addNotes($selectedTab, {
        ...params,
        id: noteId,
      });

      successMsg = 'Senha criada com sucesso';

      updateBeforeChange()
    } catch (error) {
      submitError = 'Erro ao criar senha';
    }
  }

  const onSaveEditClick = async () => {
    try {
      await updateNotes($selectedTab, form);

      successMsg = 'Senha editada com sucesso';

      updateBeforeChange()
    } catch (error) {
      submitError = 'Erro ao editar senha';
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteNote($selectedTab, id);

      successMsg = 'Nota deletada com sucesso';

      updateBeforeChange()
    } catch (error) {
      submitError = 'Erro ao deletar senha';
    }
  }

  const onDeleteClick = async (id) => {
    if(confirm('Deseja realmente deletar essa anotação?')) {
      handleDelete(id)
      return;
    }
  }
</script>

<section>
  {#if successMsg}
    <div class="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div class="bg-white p-5 rounded-lg">
        <p class="text-green-600">{successMsg}</p>
      </div>
    </div>
  {/if}

  {#if $loadPage}
    <div class="flex justify-center items-center gap-5 py-14">
      <i class="fas fa-spinner fa-spin fa-3x text-orange-400"></i>
      <h3 class="text-orange-400">Carregando...</h3>
    </div>
  {:else if $listNotes.length === 0}
    <div class="flex justify-center items-center gap-5 py-14">
      <h3 class="text-orange-400">Nenhum resultado encontrado</h3>
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
              <h2>{item.name || item.serviceName}</h2>
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
      {#if passwordList.length}
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
          selectedItem={selectedItem}
          onCancelCreateClick={onCancelCreateClick}
          onCreateClick={onCreateClick}
          onCancelClick={onCancelClick}
          onSavePasswordClick={handleSaveNewPassword}
          onChangeInpunt={handleChangeInpunt}
          submitError={submitError}
          onSaveEditClick={onSaveEditClick}
          onDeleteClick={onDeleteClick}
        />
      {/if}

      {#if serverList.length}
        <ServersList
          listOfServers={serverList}
          isvisible={isvisible}
          idPassword={idPassword}
          getFormattedPassword={getFormattedPassword}
          toggleVisibility={toggleVisibility}
          copied={copied}
          copyText={copyText}
          onEditClick={onEditServerClick}
        />
      {/if}

      {#if othersList.length}
        <OthersList
          listOfOthers={othersList}
          isvisible={isvisible}
          idPassword={idPassword}
          getFormattedPassword={getFormattedPassword}
          toggleVisibility={toggleVisibility}
          copied={copied}
          copyText={copyText}
          onEditClick={onEditOtherClick}
          isEditOrder={isEditOrder}
          onFormChange={handleChangeOthers}
          onClose={handleCloseOthers}
          onSaveOthersClick={handleSaveOthers}
          form={form}
          onDeleteClick={onDeleteClick}
        />
      {/if}
    {/if}
  {/if}

  <CreateFloatingButton onClick={onAddNewClick}/>

  {#if showModal}
    <FormModal
      onClose={() => showModal = false}
      editServer={editServer}
      onDeleteClick={() => onDeleteClick(editServer.docId)}
    />
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

    i {
      font-size: 1.5rem
    }
  }

  .container {
    @apply border border-solid border-neutral-600 mt-5 mx-auto;
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
